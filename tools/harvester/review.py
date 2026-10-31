#!/usr/bin/env python3
"""
HoistRef Manual Review CLI
===========================
Interactive workflow for approving, tagging, and organising manuals
from manuals_inbox/ into manuals/{manufacturer}/{family}/{doc_type}/.

Usage:
    python review.py                        # review all inbox PDFs in order
    python review.py path/to/file.pdf       # review a specific file
    python review.py --list                 # list all un-reviewed manuals
    python review.py --stats               # show index summary

Review actions per file:
  a  approve — tag metadata, move to manuals/
  r  reject  — move to manuals_rejected/
  s  skip    — leave in inbox, review later
  q  quit
"""

import json
import os
import re
import shutil
import sys
from pathlib import Path

# reuse helpers from harvester
sys.path.insert(0, str(Path(__file__).parent))
from harvester import (
    CONFIDENCE_LEVELS, DOC_TYPES, INDEX_JSON, INBOX_DIR, REJECTED_DIR,
    REPO_ROOT, load_index, save_index, sha256_file, extract_pdf_metadata,
)

MANUALS_DIR = REPO_ROOT / "manuals"

KNOWN_MANUFACTURERS = [
    "stahl", "demag", "kito", "yale", "abus", "swf", "gis",
    "verlinde", "kone", "cmco", "street-crane", "jd-neuhaus",
    "lodestar", "coffing", "budgit", "donati", "unknown",
]


# ─── Display helpers ──────────────────────────────────────────────────────────

def hr(char="─", width=60):
    print(char * width)

def bold(text: str) -> str:
    return f"\033[1m{text}\033[0m"

def yellow(text: str) -> str:
    return f"\033[33m{text}\033[0m"

def green(text: str) -> str:
    return f"\033[32m{text}\033[0m"

def red(text: str) -> str:
    return f"\033[31m{text}\033[0m"

def cyan(text: str) -> str:
    return f"\033[36m{text}\033[0m"


def prompt(label: str, default: str = "", options: list[str] | None = None) -> str:
    """Interactive prompt with optional default and autocomplete hint."""
    if options:
        opts_str = " / ".join(options)
        hint = f"  [{opts_str}]"
    else:
        hint = ""

    if default:
        display = f"{cyan(label)} [{default}]{hint}: "
    else:
        display = f"{cyan(label)}{hint}: "

    try:
        value = input(display).strip()
    except (EOFError, KeyboardInterrupt):
        print()
        return default

    return value if value else default


def prompt_int(label: str, default: int | str = "") -> str:
    val = prompt(label, str(default) if default != "" else "")
    return val if re.match(r"^\d*$", val) else str(default)


def prompt_choice(label: str, options: list[str], default: str = "") -> str:
    """Prompt that only accepts values from options list."""
    while True:
        val = prompt(label, default, options)
        if val in options:
            return val
        if not val and default in options:
            return default
        print(f"  Please choose one of: {', '.join(options)}")


def print_entry_summary(entry: dict) -> None:
    hr()
    path = entry.get("local_path", "")
    print(bold(f"  {path}"))
    print()
    print(f"  sha256    : {entry.get('sha256', '')[:32]}…")
    print(f"  pages     : {entry.get('page_count', '?')}")
    print(f"  source    : {entry.get('source_url', '(no URL — pre-existing file)')}")
    print(f"  confidence: {entry.get('confidence_level', '')}")
    print(f"  status    : {entry.get('status', '')}")
    print()

    pdf_title = entry.get("_pdf_title") or ""
    pdf_author = entry.get("_pdf_author") or ""
    pdf_date = entry.get("_pdf_creation_date") or ""
    if any([pdf_title, pdf_author, pdf_date]):
        print(f"  PDF title : {pdf_title or '—'}")
        print(f"  PDF author: {pdf_author or '—'}")
        print(f"  PDF date  : {pdf_date or '—'}")
        print()

    print(f"  manufacturer  : {entry.get('manufacturer', '')}")
    print(f"  family        : {entry.get('product_family', '')}")
    print(f"  models        : {entry.get('models_covered', '')}")
    print(f"  doc_type      : {entry.get('document_type', '')}")
    print(f"  language      : {entry.get('language', '')}")
    print(f"  year          : {entry.get('year', '')}")
    print(f"  revision      : {entry.get('revision', '')}")
    print(f"  notes         : {entry.get('notes', '')}")
    hr()


def ask_action() -> str:
    print()
    print(f"  {green('a')} approve   {yellow('s')} skip   {red('r')} reject   q quit")
    try:
        return input("  action: ").strip().lower()
    except (EOFError, KeyboardInterrupt):
        print()
        return "q"


# ─── Metadata collection ──────────────────────────────────────────────────────

def collect_metadata(entry: dict) -> dict:
    """Ask user to fill/confirm each metadata field. Returns updated entry."""
    print()
    print(cyan("  Tag this manual (press Enter to keep existing value):"))
    print()

    pdf_title_hint = entry.get("_pdf_title") or ""

    e = entry.copy()

    e["manufacturer"] = prompt_choice(
        "  manufacturer",
        KNOWN_MANUFACTURERS,
        default=e.get("manufacturer") or "unknown",
    )

    e["product_family"] = prompt(
        "  product family  (e.g. ST, DC-Pro, VL, XN25)",
        default=e.get("product_family") or "",
    )

    models_current = e.get("models_covered") or []
    if isinstance(models_current, list):
        models_current = " ".join(models_current)
    models_raw = prompt(
        "  models covered  (space-separated, e.g. ST05 ST10 ST20)",
        default=models_current,
    )
    e["models_covered"] = models_raw.split() if models_raw else []

    e["document_type"] = prompt_choice(
        "  document type",
        DOC_TYPES,
        default=e.get("document_type") or "unknown",
    )

    e["language"] = prompt(
        "  language  (en / de / fr / es / …)",
        default=e.get("language") or "en",
    )

    e["year"] = prompt_int(
        "  year  (YYYY, blank if unknown)",
        default=e.get("year") or "",
    )

    e["revision"] = prompt(
        "  revision  (e.g. bao 1.8.0en-4.1, 11/2005, Rev. C)",
        default=e.get("revision") or "",
    )

    e["confidence_level"] = prompt_choice(
        "  confidence",
        CONFIDENCE_LEVELS,
        default=e.get("confidence_level") or "UNVERIFIED",
    )

    notes_hint = e.get("notes") or (f"PDF title: {pdf_title_hint}" if pdf_title_hint else "")
    e["notes"] = prompt(
        "  notes  (any caveats, limitations, page range used, …)",
        default=notes_hint,
    )

    return e


# ─── File operations ──────────────────────────────────────────────────────────

def build_dest_path(entry: dict) -> Path:
    """Construct the organised destination path for an approved manual."""
    mfr = entry.get("manufacturer") or "unknown"
    family = entry.get("product_family") or "unsorted"
    doc_type = entry.get("document_type") or "unknown"

    # sanitise for filesystem
    def slug(s: str) -> str:
        return re.sub(r"[^a-z0-9_\-]", "_", s.lower()).strip("_")

    dest_dir = MANUALS_DIR / slug(mfr) / slug(family) / slug(doc_type)
    dest_dir.mkdir(parents=True, exist_ok=True)

    src_path = REPO_ROOT / entry["local_path"]
    return dest_dir / src_path.name


def move_to_approved(entry: dict) -> dict:
    src = REPO_ROOT / entry["local_path"]
    dest = build_dest_path(entry)

    if dest == src:
        return entry

    # never overwrite
    counter = 1
    stem = dest.stem
    while dest.exists():
        dest = dest.parent / f"{stem}_{counter}{dest.suffix}"
        counter += 1

    shutil.move(str(src), str(dest))
    entry["local_path"] = str(dest.relative_to(REPO_ROOT))
    entry["status"] = "approved"
    entry["needs_review"] = False
    return entry


def move_to_rejected(entry: dict) -> dict:
    REJECTED_DIR.mkdir(parents=True, exist_ok=True)
    src = REPO_ROOT / entry["local_path"]
    dest = REJECTED_DIR / src.name

    counter = 1
    stem = dest.stem
    while dest.exists():
        dest = REJECTED_DIR / f"{stem}_{counter}{dest.suffix}"
        counter += 1

    shutil.move(str(src), str(dest))
    entry["local_path"] = str(dest.relative_to(REPO_ROOT))
    entry["status"] = "rejected"
    entry["needs_review"] = False
    return entry


# ─── Core review loop ─────────────────────────────────────────────────────────

def review_entry(entry: dict, entries: list[dict]) -> str:
    """Review one entry. Returns the action taken."""
    print_entry_summary(entry)

    action = ask_action()

    if action == "q":
        return "quit"

    if action == "s":
        print(f"  {yellow('Skipped')} — will appear again on next run.")
        return "skipped"

    if action == "r":
        reason = prompt("  rejection reason (optional)", default="")
        if reason:
            entry["notes"] = f"REJECTED: {reason}"
        entry = move_to_rejected(entry)

        # update in place
        for i, e in enumerate(entries):
            if e["id"] == entry["id"]:
                entries[i] = entry
                break
        save_index(entries)
        print(f"  {red('Rejected')} → {entry['local_path']}")
        return "rejected"

    if action == "a":
        entry = collect_metadata(entry)
        entry = move_to_approved(entry)

        for i, e in enumerate(entries):
            if e["id"] == entry["id"]:
                entries[i] = entry
                break
        save_index(entries)
        print()
        print(f"  {green('Approved')} → {entry['local_path']}")
        return "approved"

    print("  Unrecognised action — skipping.")
    return "skipped"


def review_file(pdf_path: Path, entries: list[dict]) -> str:
    """Find or create index entry for a specific file and review it."""
    file_hash = sha256_file(pdf_path)
    entry = next((e for e in entries if e.get("sha256") == file_hash), None)

    if not entry:
        # create a stub entry for a file not yet in the index
        import uuid
        pdf_meta = extract_pdf_metadata(pdf_path)
        rel = str(pdf_path.relative_to(REPO_ROOT))
        parts = pdf_path.relative_to(MANUALS_DIR).parts if pdf_path.is_relative_to(MANUALS_DIR) else ()
        mfr = parts[0].lower() if parts else "unknown"

        entry = {
            "id": str(uuid.uuid4()),
            "manufacturer": mfr,
            "product_family": "",
            "models_covered": [],
            "document_type": "unknown",
            "language": "en",
            "year": "",
            "revision": "",
            "source_url": "",
            "source_domain": "",
            "confidence_level": "UNVERIFIED",
            "local_path": rel,
            "sha256": file_hash,
            "page_count": pdf_meta.get("page_count", 0),
            "download_date": "",
            "status": "existing",
            "needs_review": True,
            "notes": "",
            "_pdf_title": pdf_meta.get("pdf_title", ""),
            "_pdf_author": pdf_meta.get("pdf_author", ""),
            "_pdf_creation_date": pdf_meta.get("pdf_creation_date", ""),
        }
        entries.append(entry)

    return review_entry(entry, entries)


# ─── Main ─────────────────────────────────────────────────────────────────────

def main() -> None:
    import argparse
    parser = argparse.ArgumentParser(description="HoistRef Manual Review CLI")
    parser.add_argument("file", nargs="?", help="Review a specific PDF file")
    parser.add_argument("--list", action="store_true", help="List all un-reviewed manuals")
    parser.add_argument("--stats", action="store_true", help="Show index summary")
    args = parser.parse_args()

    entries = load_index()

    if args.stats:
        from harvester import print_report
        print_report(entries)
        return

    if args.list:
        pending = [e for e in entries if e.get("needs_review")]
        if not pending:
            print("No manuals need review. ✓")
        else:
            print(f"\n{len(pending)} manual(s) need review:\n")
            for e in pending:
                pages = e.get("page_count") or "?"
                conf = e.get("confidence_level") or "?"
                mfr = e.get("manufacturer") or "?"
                print(f"  [{conf}] {mfr:<12}  {e['local_path']}  ({pages}pp)")
        print()
        return

    if args.file:
        pdf = Path(args.file)
        if not pdf.exists():
            print(f"File not found: {pdf}")
            sys.exit(1)
        review_file(pdf.resolve(), entries)
        return

    # default: review all inbox PDFs
    pending = [e for e in entries if e.get("needs_review") and e.get("status") in ("inbox", "existing")]

    if not pending:
        # also scan inbox dir for any files not yet indexed
        inbox_pdfs = list(INBOX_DIR.glob("*.pdf")) if INBOX_DIR.exists() else []
        if inbox_pdfs:
            print(f"\nFound {len(inbox_pdfs)} PDF(s) in manuals_inbox/ not in index — adding…")
            for pdf in inbox_pdfs:
                import uuid
                pdf_meta = extract_pdf_metadata(pdf)
                entry = {
                    "id": str(uuid.uuid4()),
                    "manufacturer": "unknown",
                    "product_family": "",
                    "models_covered": [],
                    "document_type": "unknown",
                    "language": "en",
                    "year": "",
                    "revision": "",
                    "source_url": "",
                    "source_domain": "",
                    "confidence_level": "UNVERIFIED",
                    "local_path": str(pdf.relative_to(REPO_ROOT)),
                    "sha256": sha256_file(pdf),
                    "page_count": pdf_meta.get("page_count", 0),
                    "download_date": "",
                    "status": "inbox",
                    "needs_review": True,
                    "notes": "",
                    "_pdf_title": pdf_meta.get("pdf_title", ""),
                    "_pdf_author": pdf_meta.get("pdf_author", ""),
                    "_pdf_creation_date": pdf_meta.get("pdf_creation_date", ""),
                }
                entries.append(entry)
                pending.append(entry)
            save_index(entries)
        else:
            print("\nNothing to review. Run harvester.py first to download PDFs.")
            return

    stats = {"approved": 0, "rejected": 0, "skipped": 0}
    print(f"\n{len(pending)} manual(s) to review.\n")

    for entry in pending:
        action = review_entry(entry, entries)
        if action == "quit":
            break
        if action in stats:
            stats[action] += 1

    print()
    hr("═")
    print(f"  Session: approved {stats['approved']}  rejected {stats['rejected']}  skipped {stats['skipped']}")
    pending_remaining = len([e for e in entries if e.get("needs_review")])
    if pending_remaining:
        print(f"  {pending_remaining} manual(s) still need review.")
    else:
        print(green("  All manuals reviewed. ✓"))
    hr("═")


if __name__ == "__main__":
    main()
