# OEM Source Manuals — Provenance Index

Public OEM PDFs fetched 2026-04-26. These are the authoritative sources
used to verify (or flag as `verify: true`) values in the data layer.
URLs may rot — the extracted plain text lives next to this file in
`*.txt` form for offline reference.

## Verlinde EUROCHAIN VR

- **Source:** `Technical Guide EUROCHAIN VR — VR2, VR5, VR10` (English, 2016)
- **URL:** https://www.hoistuk.com/wp-content/uploads/VR-Technical-Guide.pdf
- **Local:** `verlinde-vr-technical-guide.txt` (25 pages, 53 KB)
- **Verified values:**
  - §5.1 hook dimensions per frame + reeving — full table (markings 012T / 020T / 04T / 08T)
  - §6.2 brake torques: VR2 = 2.8 N·m, VR5 = 6.8 N·m, VR10 = 14 N·m
  - §6.1 motor power table per frame and lift speed
  - §4.4 friction torque limiter — single disc (VR02/05) vs twin disc + intermediate (VR10+)
  - Variant capacity table with FEM duty class and chain dimensions

## DEMAG DC-Pro

- **Source:** `Operating instructions/component parts — DC-Pro 1, 2, 5, 10, 20`
  (Demag Cranes & Components, 110205 US/EN, document 900 426 49)
- **URL:** https://www.aceindustries.com/content/Demag_DCPRO_OM_Manual.pdf
- **Local:** `demag-dc-pro-operating.txt` (68 pages, 249 KB)
- **Verified values:**
  - §7.4 chain wear limits:
    - DC-Pro 1/2: 11-link a = 144.7 mm, single-link t = 12.8 mm
    - DC-Pro 5: a = 180.3 mm, t = 15.9 mm
    - DC-Pro 10/20: a = 253 mm, t = 22.4 mm
  - §2.5 hook dimension C (overall length) tables per model and suspension type
  - §7.6 brake — checking and adjusting procedure (cone-rotor brake)
  - §7.7 slipping clutch checking and adjusting

## Yale CPV / CPVF

- **Source:** Yale CPV(F) Translated Operating Instructions — also covers
  special versions (Columbus McKinnon, ©2018, document
  Handbuch CPV_F_D_EN_FR_ES_IT_NL_HU_RO_TR_PL_RUS_V3)
- **URL:** https://portalimages.blob.core.windows.net/products/pdfs/cvsgjmfa_Yale-CPV-CPVF-Manual.pdf
- **Local:** `yale-cpv-cpvf.txt` (26 pages, 57 KB)
- **Verified values:**
  - §"Force-limit factor" — overload protection factory-set 145% ±10% rated capacity
  - Max slip duration 60 s, then 20 min cool-down to room temperature
  - Function test: min 125% rated capacity, max 5 s
  - Hook discard rule: replace if mouth opened > 10% OR nominal dimensions
    reduced > 5%
  - Chain wear: replace if diameter reduced > 10%, OR pitch elongated > 5%
    over 1 link, OR > 2% over 11 links (DIN 685-5)

## Kito ER2

- **Source:** ER2 Series Electric Chain Hoist (125 kg to 5 t) Owner's Manual,
  document OM-ER2ZZZ-CEE-02 (Kito Europe GmbH)
- **URL:** https://kito.net/files/downloads/er2/er2/manuals/en/ER2-Manual-125kg--5t-_-04.pdf
- **Local:** `kito-er2.txt` (4 MB PDF; 8500+ extracted lines)
- **Verified values:**
  - P92 ER2 Hook Service Limit table — full a/b/c standard + limit per body code:
    - B (125 kg) / C (250 kg, 500 kg L): a 45.0 / b 17.5/16.6 / c 23.5/22.3 mm
    - C/D (500 / 1000 kg standard): a 50.0 / b 22.5/21.4 / c 31.0/29.5 mm
    - E (1.6 t): a 60.0 / b 26.5/25.2 / c 36.5/34.7 mm
    - E/F (2 / 2.5 t): a 69.0 / b 31.5/29.9 / c 43.5/41.3 mm
    - 3.2 t: a 73.0 / b 34.5/32.8 / c 47.5/45.1 mm
    - 5 t: a 83.0 / b 42.5/40.4 / c 56.0/53.2 mm
  - "Replace if a exceeds dimension at purchasing" — Kito-unique
    record-initial-value rule
  - Friction clutch + limit switch double-protection — manual confirms
    independence of overload-prevention layers
  - 125-500 kg dual-speed type uses friction clutch with mechanical brake;
    grade ISO M5 / FEM 2m
  - Body-size to capacity mapping: ER2-001 (125 kg), ER2-003 (250 kg),
    ER2-005 (500 kg), ER2-010 (1 t), ER2-016 (1.6 t), ER2-020 (2 t),
    ER2-025 (2.5 t), ER2-032 (3.2 t), ER2-050 (5 t)

## GIS GP

- **Source:** Technical Data Sheet — Electric Chain Hoists / Trolleys / Industry
- **URL:** https://gis-ag.ch/gis%20ag/mediathek/pdf/englisch/01-elektrokettenzug/modell%20gp/9500_9105_1%20Technical%20data%20sheet%20GP%20-%20trolleys.pdf
- **Local:** `gis-gp-tech-data.txt` (115 KB)
- **Status:** Technical data sheet, NOT the full operating manual.
  Contains capacity / motor / wheel tables but not detailed wear limits.
  Operating + maintenance manual still needs sourcing.

## STAHL ST

- **Source:** Operating Instructions chapter excerpt
- **URL:** https://www.safety-lifting.com/file/download/8163
- **Local:** `stahl-st.txt` (103 lines — chapter 6 Operating only)
- **Status:** PARTIAL. The fetched PDF is Chapter 6 (Operating) of the
  ST manual. Full operating + maintenance instructions including chain
  wear table, motor codes for ST20, and brake/clutch geometry are not in
  this excerpt.
- **Next-step lead:** ManualsLib has a fuller version at
  https://www.manualslib.com/manual/1903515/Stahl-St-Series.html — but
  ManualsLib requires login and is not directly fetchable.
- **Outstanding gap:** ST20 motor codes still NOT FOUND. ST05/10/30/32/50/60
  values in our data layer were sourced from the original /oem/stahl/
  knowledge pack research and remain `verify: true` until cross-checked
  against the full STAHL service literature.

---

## Coverage summary

| Brand    | Hook dims | Chain wear | Brake | Clutch | Motor codes |
|----------|-----------|------------|-------|--------|-------------|
| STAHL    | partial   | unverified | shim/air-gap geometry verified | mechanism per model | ST05/10/30/32/50/60 ✓ · ST20 NOT FOUND |
| DEMAG    | dim C ✓   | a/t ✓     | cone topology ✓ | factory-set ✓ | covered |
| Yale     | rule ✓    | DIN 685 ✓ | air-gap ✓ | 145% ±10% ✓ | covered |
| Kito     | full table ✓ | rule ✓ | EM + Weston in load brake (option) | sealed + limit switch ✓ | covered |
| GIS      | partial   | partial    | partial | partial | partial |
| Verlinde | full table ✓ | industry std | torque per frame ✓ | single/twin disc ✓ | full table |

**HIGH-CONFIDENCE post this pass:** Kito ER2 hook table, Verlinde brake +
hook + clutch geometry, DEMAG chain wear, Yale slip-clutch + hook + chain
rules.

**Still flagged `verify: true` after this pass:** STAHL ST20 motor codes,
GIS detailed wear limits, Yale per-size chain a/t/d_min tables, DEMAG
cone-rotor half-angle (manual says "no field adjustment" — exact angle
not in operating manual; would require service manual).
