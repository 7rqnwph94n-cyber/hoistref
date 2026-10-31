#!/usr/bin/env python3
"""
HoistRef Manual Harvester
=========================
Downloads approved PDF URLs into manuals_inbox/, deduplicates by SHA-256,
extracts PDF metadata, and maintains manual_index.json + manual_index.csv.

Usage:
    python harvester.py                          # process approved_urls.txt
    python harvester.py --url https://...        # single URL
    python harvester.py --report                 # show index summary only
    python harvester.py --check-dupes           # scan manuals/ for un-indexed PDFs
"""

import argparse
import csv
import hashlib
import json
import os
import re
import sys
import uuid
from datetime import date
from pathlib import Path
from urllib.parse import urlparse

import subprocess

import requests


def _find_repo_root() -> Path:
    """
    Find the main repo root, even when running inside a git worktree.
    Prefers HOISTREF_ROOT env var → git common dir parent → script parents[2].
    """
    if "HOISTREF_ROOT" in os.environ:
        return Path(os.environ["HOISTREF_ROOT"]).resolve()

    # In a worktree, --git-common-dir points to the .git of the main worktree.
    # Walk up from there to find the main working directory.
    try:
        common_dir = subprocess.check_output(
            ["git", "rev-parse", "--git-common-dir"],
            cwd=Path(__file__).parent,
            stderr=subprocess.DEVNULL,
        ).decode().strip()
        common_path = Path(common_dir).resolve()
        # If common_dir is <repo>/.git, parent is the main repo root.
        # If common_dir is <main_wt>/.git (absolute), use its parent.
        candidate = common_path.parent
        if (candidate / "app").exists() or (candidate / "manuals").exists():
            return candidate
    except Exception:
        pass

    # Fallback: assume tools/ is one level below repo root
    return Path(__file__).resolve().parents[2]


REPO_ROOT   = _find_repo_root()
INBOX_DIR   = REPO_ROOT / "manuals_inbox"
REJECTED_DIR = REPO_ROOT / "manuals_rejected"
INDEX_JSON  = REPO_ROOT / "manual_index.json"
INDEX_CSV   = REPO_ROOT / "manual_index.csv"
URLS_FILE   = Path(__file__).parent / "approved_urls.txt"

CONFIDENCE_LEVELS = ["OEM_DIRECT", "DISTRIBUTOR_COPY", "ARCHIVE_COPY", "FIELD_COPY", "UNVERIFIED"]
DOC_TYPES = [
    "operation_manual", "service_manual", "parts_list",
    "tech_guide", "brochure", "standard", "unknown",
]

INDEX_FIELDS = [
    "id", "manufacturer", "product_family", "models_covered",
    "document_type", "language", "year", "revision",
    "source_url", "source_domain", "confidence_level",
    "local_path", "sha256", "page_count",
    "download_date", "status", "needs_review", "notes",
]


# ─── Index helpers ────────────────────────────────────────────────────────────

def load_index() -> list[dict]:
    if INDEX_JSON.exists():
        with open(INDEX_JSON, encoding="utf-8") as f:
            return json.load(f)
    return []


def save_index(entries: list[dict]) -> None:
    with open(INDEX_JSON, "w", encoding="utf-8") as f:
        json.dump(entries, f, indent=2, ensure_ascii=False)

    with open(INDEX_CSV, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=INDEX_FIELDS, extrasaction="ignore")
        writer.writeheader()
        for entry in entries:
            row = {k: entry.get(k, "") for k in INDEX_FIELDS}
            # flatten list fields for CSV
            if isinstance(row["models_covered"], list):
                row["models_covered"] = " ".join(row["models_covered"])
            writer.writerow(row)


def known_hashes(entries: list[dict]) -> set[str]:
    return {e["sha256"] for e in entries if e.get("sha256")}


def known_urls(entries: list[dict]) -> set[str]:
    return {e["source_url"] for e in entries if e.get("source_url")}


def find_by_hash(entries: list[dict], sha256: str) -> dict | None:
    for e in entries:
        if e.get("sha256") == sha256:
            return e
    return None


# ─── PDF utilities ────────────────────────────────────────────────────────────

def sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(65536), b""):
            h.update(chunk)
    return h.hexdigest()


def extract_pdf_metadata(path: Path) -> dict:
    """Extract title, author, creation date, page count from PDF. Returns {} on failure."""
    try:
        import pypdf  # optional — install with: pip install pypdf
        reader = pypdf.PdfReader(str(path))
        info = reader.metadata or {}
        page_count = len(reader.pages)

        def clean(val):
            if val is None:
                return ""
            return str(val).strip()

        return {
            "page_count": page_count,
            "pdf_title": clean(info.get("/Title")),
            "pdf_author": clean(info.get("/Author")),
            "pdf_subject": clean(info.get("/Subject")),
            "pdf_creation_date": clean(info.get("/CreationDate")),
        }
    except ImportError:
        return {"page_count": 0, "pdf_title": "", "pdf_author": "", "pdf_subject": "", "pdf_creation_date": ""}
    except Exception as e:
        err = repr(e)
        return {"page_count": 0, "pdf_title": "", "pdf_author": "", "pdf_subject": "", "pdf_creation_date": "", "_meta_error": err}


def guess_manufacturer(url: str, filename: str) -> str:
    combined = (url + " " + filename).lower()
    known = {
        "stahl": "stahl", "demag": "demag", "kito": "kito",
        "yale": "yale", "abus": "abus", "swf": "swf",
        "gis": "gis", "verlinde": "verlinde", "kone": "kone",
        "cmco": "yale", "cm-co": "yale",
    }
    for keyword, mfr in known.items():
        if keyword in combined:
            return mfr
    return "unknown"


def guess_confidence(url: str) -> str:
    domain = urlparse(url).netloc.lower()
    oem_domains = [
        "stahlcranes.com", "stahl-hoist.com",
        "demag.com", "demagcranes.com",
        "kito.net", "kito.com", "kito.co.jp", "kito.ca",
        "cmco.com", "cmcorpinc.com",
        "yale.com",
        "abus.help", "abus-kransysteme.de",
        "swfkrantechnik.com",
        "gis-ag.ch",
        "verlinde.com",
        "konecranes.com",
        "jdngroup.com",
        "streetcrane.co.uk",
    ]
    distributor_domains = [
        "manualslib.com", "manualzz.com", "docs.rs",
    ]
    if any(d in domain for d in oem_domains):
        return "OEM_DIRECT"
    if any(d in domain for d in distributor_domains):
        return "DISTRIBUTOR_COPY"
    return "UNVERIFIED"


def safe_filename(url: str) -> str:
    name = os.path.basename(urlparse(url).path)
    name = re.sub(r"[^A-Za-z0-9._\- ]", "_", name)
    name = name.strip("_. ")
    return name if name.lower().endswith(".pdf") else (name or "manual") + ".pdf"


# ─── Download ─────────────────────────────────────────────────────────────────

class DownloadResult:
    def __init__(self, status: str, entry: dict | None = None, message: str = ""):
        self.status = status    # 'downloaded' | 'duplicate' | 'skipped' | 'failed'
        self.entry = entry
        self.message = message


def download_url(url: str, entries: list[dict]) -> DownloadResult:
    url = url.strip()
    if not url or url.startswith("#"):
        return DownloadResult("skipped", message="blank/comment")

    if url in known_urls(entries):
        existing = next(e for e in entries if e.get("source_url") == url)
        return DownloadResult("duplicate", entry=existing, message="URL already in index")

    print(f"  → {url}")

    try:
        resp = requests.get(url, timeout=60, headers={"User-Agent": "HoistRef-Harvester/1.0"})
        resp.raise_for_status()
    except Exception as e:
        return DownloadResult("failed", message=str(e))

    content_type = resp.headers.get("content-type", "").lower()
    if "pdf" not in content_type and not url.lower().endswith(".pdf"):
        return DownloadResult("skipped", message=f"Non-PDF content-type: {content_type}")

    INBOX_DIR.mkdir(parents=True, exist_ok=True)

    filename = safe_filename(url)
    dest = INBOX_DIR / filename

    # avoid overwrite — append counter if needed
    counter = 1
    stem = dest.stem
    while dest.exists():
        dest = INBOX_DIR / f"{stem}_{counter}.pdf"
        counter += 1

    with open(dest, "wb") as f:
        f.write(resp.content)

    file_hash = sha256_file(dest)

    # dedup by hash
    existing = find_by_hash(entries, file_hash)
    if existing:
        dest.unlink()
        return DownloadResult(
            "duplicate",
            entry=existing,
            message=f"Identical file already at {existing.get('local_path')}",
        )

    pdf_meta = extract_pdf_metadata(dest)
    manufacturer = guess_manufacturer(url, filename)
    confidence = guess_confidence(url)
    domain = urlparse(url).netloc

    entry: dict = {
        "id": str(uuid.uuid4()),
        "manufacturer": manufacturer,
        "product_family": "",
        "models_covered": [],
        "document_type": "unknown",
        "language": "en",
        "year": "",
        "revision": "",
        "source_url": url,
        "source_domain": domain,
        "confidence_level": confidence,
        "local_path": str(dest.relative_to(REPO_ROOT)),
        "sha256": file_hash,
        "page_count": pdf_meta.get("page_count", 0),
        "download_date": date.today().isoformat(),
        "status": "inbox",
        "needs_review": True,
        "notes": "",
        # extra fields from PDF metadata (stored in JSON, not CSV)
        "_pdf_title": pdf_meta.get("pdf_title", ""),
        "_pdf_author": pdf_meta.get("pdf_author", ""),
        "_pdf_creation_date": pdf_meta.get("pdf_creation_date", ""),
    }

    return DownloadResult("downloaded", entry=entry)


# ─── Duplicate scanner ────────────────────────────────────────────────────────

def scan_existing_manuals(entries: list[dict]) -> list[dict]:
    """Walk manuals/ and find PDFs not yet in the index. Returns new entries."""
    manuals_dir = REPO_ROOT / "manuals"
    if not manuals_dir.exists():
        return []

    hashes = known_hashes(entries)
    new_entries = []

    for pdf_path in manuals_dir.rglob("*.pdf"):
        file_hash = sha256_file(pdf_path)
        if file_hash in hashes:
            continue

        pdf_meta = extract_pdf_metadata(pdf_path)
        rel_path = str(pdf_path.relative_to(REPO_ROOT))
        parts = pdf_path.relative_to(manuals_dir).parts
        manufacturer = parts[0].lower() if parts else "unknown"

        entry: dict = {
            "id": str(uuid.uuid4()),
            "manufacturer": manufacturer,
            "product_family": "",
            "models_covered": [],
            "document_type": "unknown",
            "language": "en",
            "year": "",
            "revision": "",
            "source_url": "",
            "source_domain": "",
            "confidence_level": "UNVERIFIED",
            "local_path": rel_path,
            "sha256": file_hash,
            "page_count": pdf_meta.get("page_count", 0),
            "download_date": "",
            "status": "existing",
            "needs_review": True,
            "notes": "Found in manuals/ but not previously indexed",
            "_pdf_title": pdf_meta.get("pdf_title", ""),
            "_pdf_author": pdf_meta.get("pdf_author", ""),
            "_pdf_creation_date": pdf_meta.get("pdf_creation_date", ""),
        }
        new_entries.append(entry)
        print(f"  + {rel_path}")

    return new_entries


# ─── Report ───────────────────────────────────────────────────────────────────

def print_report(entries: list[dict]) -> None:
    by_status = {}
    for e in entries:
        s = e.get("status", "unknown")
        by_status.setdefault(s, []).append(e)

    print("\n─── Manual Index Summary ───────────────────────────────")
    print(f"  Total entries  : {len(entries)}")
    for status, items in sorted(by_status.items()):
        print(f"  {status:<18}: {len(items)}")
    print()

    needs_review = [e for e in entries if e.get("needs_review")]
    if needs_review:
        print(f"  ⚠  {len(needs_review)} manuals need review (run python review.py)")
        for e in needs_review[:10]:
            print(f"     • {e.get('local_path', e.get('id'))}")
        if len(needs_review) > 10:
            print(f"     … and {len(needs_review) - 10} more")
    print()

    by_mfr: dict[str, int] = {}
    for e in entries:
        mfr = e.get("manufacturer") or "unknown"
        by_mfr[mfr] = by_mfr.get(mfr, 0) + 1
    print("  By manufacturer:")
    for mfr, count in sorted(by_mfr.items()):
        print(f"    {mfr:<20}: {count}")
    print("────────────────────────────────────────────────────────\n")


# ─── Main ─────────────────────────────────────────────────────────────────────

def main() -> None:
    parser = argparse.ArgumentParser(description="HoistRef Manual Harvester")
    parser.add_argument("--url", help="Download a single PDF URL")
    parser.add_argument("--report", action="store_true", help="Show index summary and exit")
    parser.add_argument("--check-dupes", action="store_true", help="Scan manuals/ for un-indexed PDFs")
    parser.add_argument("--urls-file", default=str(URLS_FILE), help="Path to approved_urls.txt")
    args = parser.parse_args()

    entries = load_index()
    stats = {"downloaded": 0, "duplicate": 0, "skipped": 0, "failed": 0}

    if args.report:
        print_report(entries)
        return

    if args.check_dupes:
        print("Scanning manuals/ for un-indexed PDFs…")
        new = scan_existing_manuals(entries)
        if new:
            entries.extend(new)
            save_index(entries)
            print(f"\nAdded {len(new)} un-indexed PDF(s) to index (marked needs_review=true).")
        else:
            print("All PDFs in manuals/ are already indexed.")
        print_report(entries)
        return

    urls: list[str] = []
    if args.url:
        urls = [args.url]
    else:
        urls_path = Path(args.urls_file)
        if not urls_path.exists():
            print(f"No approved_urls.txt found at {urls_path}")
            print("Create it and paste one PDF URL per line, then re-run.")
            sys.exit(0)
        with open(urls_path, encoding="utf-8") as f:
            urls = [line.strip() for line in f if line.strip() and not line.startswith("#")]

    if not urls:
        print("No URLs to process.")
        print_report(entries)
        return

    print(f"\nProcessing {len(urls)} URL(s)…\n")

    for url in urls:
        result = download_url(url, entries)
        stats[result.status] += 1

        if result.status == "downloaded" and result.entry:
            entries.append(result.entry)
            save_index(entries)
            meta = result.entry
            pages = meta.get("page_count") or "?"
            pdf_title = meta.get("_pdf_title") or ""
            title_str = f' — "{pdf_title}"' if pdf_title else ""
            print(f"    ✓ downloaded  {meta['local_path']}  ({pages} pages){title_str}")
            print(f"      confidence: {meta['confidence_level']}  sha256: {meta['sha256'][:16]}…")

        elif result.status == "duplicate":
            existing_path = result.entry.get("local_path", "") if result.entry else ""
            print(f"    = duplicate   {result.message}  ({existing_path})")

        elif result.status == "failed":
            print(f"    ✗ failed      {result.message}")

        elif result.status == "skipped":
            print(f"    – skipped     {result.message}")

    print(f"\n─── Run complete ──────────────────────────────────────")
    print(f"  Downloaded : {stats['downloaded']}")
    print(f"  Duplicates : {stats['duplicate']}")
    print(f"  Skipped    : {stats['skipped']}")
    print(f"  Failed     : {stats['failed']}")
    print_report(entries)


if __name__ == "__main__":
    main()
