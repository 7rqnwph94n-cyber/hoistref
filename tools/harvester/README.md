# HoistRef Manual Harvester

Semi-automated tool for collecting, deduplicating, and indexing OEM hoist/crane
manuals. You control what gets downloaded — the harvester never scrapes blindly.

---

## Quick start (macOS)

```bash
cd hoistref/tools/harvester

# 1. Install Python dependencies (once)
pip3 install -r requirements.txt

# 2. Paste approved PDF URLs into approved_urls.txt (one per line)
#    Only add URLs you have verified are from the OEM or a known distributor.

# 3. Run the harvester
python3 harvester.py

# 4. Review and tag downloaded PDFs
python3 review.py
```

---

## File structure

```
tools/harvester/
  harvester.py        download + hash + index
  review.py           interactive CLI review workflow
  approved_urls.txt   paste verified PDF URLs here
  targets.csv         priority list of manufacturers / families to collect
  requirements.txt    pip dependencies

# Created at repo root when you run the scripts:
manuals_inbox/        newly downloaded PDFs awaiting review
manuals_rejected/     PDFs you have rejected
manual_index.json     master index (JSON, one entry per file)
manual_index.csv      same index as CSV (for spreadsheet review)
```

---

## Workflow

### Phase 1 — Find PDF URLs

Search patterns that work well:

```
STAHL ST05 ST10 operating manual filetype:pdf
DEMAG DC-Pro service instructions PDF site:demagcranes.com
KITO ER2 maintenance manual PDF
ABUS GM4 chain hoist operating instructions PDF
GIS GP chain hoist manual PDF site:gis-ag.ch
```

Check `targets.csv` for priority order and which manufacturers are still missing
manuals.

### Phase 2 — Approve URLs

Paste only URLs you have verified into `approved_urls.txt`. Add a comment above
each URL block explaining the source:

```
# Source: STAHL official site → Products → Downloads → ST operating instructions
https://www.stahlcranes.com/downloads/...ST_OI_EN.pdf
```

Confidence is assigned automatically by domain:

| Level              | Assigned when…                              |
|--------------------|---------------------------------------------|
| `OEM_DIRECT`       | URL is from a known OEM domain              |
| `DISTRIBUTOR_COPY` | URL is from manualslib.com or similar       |
| `UNVERIFIED`       | Domain not recognised                       |

### Phase 3 — Download

```bash
python3 harvester.py
```

Each PDF lands in `manuals_inbox/` with `needs_review=true`. The SHA-256 hash
is calculated on download — exact duplicates are skipped automatically.

### Phase 4 — Review

```bash
python3 review.py           # work through all inbox PDFs
python3 review.py file.pdf  # review one specific file
python3 review.py --list    # see what needs review
```

For each PDF you are prompted for:

- Manufacturer (tab-complete from known list)
- Product family (e.g. `DC-Pro`, `ST`, `VL`)
- Models covered (space-separated, e.g. `ST05 ST10 ST20`)
- Document type (`operation_manual`, `service_manual`, `parts_list`, `tech_guide`, `brochure`, `standard`, `unknown`)
- Language (`en`, `de`, `fr`, …)
- Year
- Revision stamp
- Confidence level
- Notes

Then choose:

| Key | Action |
|-----|--------|
| `a` | **Approve** — tag metadata, move to `manuals/{mfr}/{family}/{doc_type}/` |
| `r` | **Reject** — move to `manuals_rejected/` |
| `s` | **Skip** — leave in inbox, come back later |
| `q` | Quit, save progress |

---

## Commands reference

```bash
# Download from approved_urls.txt
python3 harvester.py

# Download a single URL
python3 harvester.py --url https://example.com/manual.pdf

# Show index summary only
python3 harvester.py --report

# Scan manuals/ for PDFs not yet in the index
python3 harvester.py --check-dupes

# Review all inbox PDFs
python3 review.py

# Review a specific file
python3 review.py manuals_inbox/some_manual.pdf

# List everything that still needs review
python3 review.py --list

# Show full index stats
python3 review.py --stats
```

---

## Index fields

| Field             | Description                                          |
|-------------------|------------------------------------------------------|
| `id`              | UUID assigned on first download/indexing             |
| `manufacturer`    | lowercase slug: `stahl`, `demag`, `kito`, etc.       |
| `product_family`  | e.g. `ST`, `DC-Pro`, `VL`                           |
| `models_covered`  | space-separated model codes                          |
| `document_type`   | see doc types above                                  |
| `language`        | ISO 639-1 code: `en`, `de`, `fr`, …                 |
| `year`            | publication year (approximate if not on title page)  |
| `revision`        | manual's own revision stamp                          |
| `source_url`      | URL the file was downloaded from                     |
| `source_domain`   | domain extracted from source_url                     |
| `confidence_level`| `OEM_DIRECT` / `DISTRIBUTOR_COPY` / `ARCHIVE_COPY` / `FIELD_COPY` / `UNVERIFIED` |
| `local_path`      | path relative to repo root                           |
| `sha256`          | SHA-256 hash of the PDF file                         |
| `page_count`      | extracted from PDF metadata                          |
| `download_date`   | ISO date `YYYY-MM-DD`                                |
| `status`          | `inbox` / `approved` / `rejected` / `existing`       |
| `needs_review`    | `true` until reviewed                                |
| `notes`           | free text for caveats, page ranges, etc.             |

---

## Adding a new manufacturer

1. Add a row to `targets.csv` with the manufacturer details and priority.
2. Add a URL block comment section to `approved_urls.txt`.
3. Search for manuals, paste approved URLs.
4. Run harvester + review.

---

## Important: never blindly trust a download

The harvester cannot verify that a PDF actually matches its filename or URL.
Always:

- Check the page count is plausible for the manual type (OI = 30–100pp, parts list = 10–60pp)
- Skim the PDF title page before approving
- Set `needs_review=true` for anything that looks off
- Reject files that appear to be marketing brochures masquerading as service manuals

`UNVERIFIED` confidence does not mean the PDF is wrong — it means the source
has not been confirmed as OEM or a trusted distributor. Many perfectly good
manuals come from `manualslib.com` — tag these as `DISTRIBUTOR_COPY` if you
can confirm the content matches the OEM version.
