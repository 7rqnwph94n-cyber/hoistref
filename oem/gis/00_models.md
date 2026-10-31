# GIS — Model & Variant Matrix

**Manufacturer:** GIS AG — Swiss Lifting Solutions (Luzernerstrasse 50, CH-6247 Schötz, Switzerland). 60+ years Swiss-made.
**Series in scope:** GP electric chain hoist (GP 250 / GP 500 / GP 1000)
**Capacity range:** 125 kg – 2.5 t

References:
- [GIS GP product page](https://gis-ag.ch/en/industry/products/electric-chain-hoists/18-electric-chain-hoist-gp/)
- [GIS GP technical data sheet 9500_9105_1](https://gis-ag.ch/gis%20ag/mediathek/pdf/englisch/01-elektrokettenzug/modell%20gp/9500_9105_1%20Technical%20data%20sheet%20GP%20-%20trolleys.pdf)
- [GIS GP Translation of Original Instruction Manual 9500.9002.1, 02.19 issue (ManualsLib)](https://www.manualslib.com/manual/1979661/Gis-Gp-Series.html)

## Model coding

GIS uses structured nomenclature: `GP <size>/<falls><duty-code>`

| Field | Values |
|---|---|
| Size | 250 / 500 / 1000 (approximate capacity class) |
| Falls | 1 (single chain) / 2 (double chain) |
| Duty code | NF / SF / NL / N (see below) |
| Phase | `1Ph` suffix added if 230V single-phase |

### Duty codes

| Code | Motor | Speed pattern |
|---|---|---|
| `NF` | 8/2-pole pole-changing | 2-speed standard (8 m/min main on 1-fall) |
| `SF` | 16/4-pole pole-changing | 2-speed high-speed (16 m/min main on 1-fall) |
| `NL` | 4-pole single-speed | Low-speed (4 m/min main on 1-fall) |
| `N` | 2-pole single-speed | Standard single-speed (8 m/min main on 1-fall) |

## Models in scope (3-phase 400V; ≤ 2 t scope)

### GP 250

| Variant | FEM M3/1Bm | FEM M4/1Am | FEM M5/2m | FEM M6/3m | FEM M7/4m | Lift speed (50Hz) | Falls |
|---|---|---|---|---|---|---|---|
| GP 250/1NF | 400 | 320 | 250 | 200 | 160 | 8/2 m/min | 1 |
| GP 250/1SF | – | 160 | 125 | 100 | – | 16/4 m/min | 1 |
| GP 250/1NL | 400 | 320 | 250 | 200 | 160 | 4 m/min | 1 |
| GP 250/1N | 400 | 320 | 250 | 200 | 160 | 8 m/min | 1 |
| GP 250/2NF | – | 630 | 500 | 400 | 320 | 4/1 m/min | 2 |
| GP 250/2NL | – | 630 | 500 | 400 | 320 | 2 m/min | 2 |
| GP 250/2N | – | 630 | 500 | 400 | 320 | 4 m/min | 2 |

Confidence: HIGH (GIS Section 1 capacity table).

### GP 500

| Variant | FEM M3/1Bm | FEM M4/1Am | FEM M5/2m | FEM M6/3m | FEM M7/4m | Lift speed | Falls |
|---|---|---|---|---|---|---|---|
| GP 500/1NF | 800 | 630 | 500 | 400 | 320 | 8/2 m/min | 1 |
| GP 500/1SF | – | 320 | 250 | 200 | 160 | 16/4 m/min | 1 |
| GP 500/1NL | 800 | 630 | 500 | 400 | 320 | 4 m/min | 1 |
| GP 500/1N | 800 | 630 | 500 | 400 | 320 | 8 m/min | 1 |
| GP 500/2NF | – | 1250 | 1000 | 800 | 630 | 4/1 m/min | 2 |
| GP 500/2NL | – | 1250 | 1000 | 800 | 630 | 2 m/min | 2 |
| GP 500/2N | – | 1250 | 1000 | 800 | 630 | 4 m/min | 2 |

### GP 1000

| Variant | FEM M3/1Bm | FEM M4/1Am | FEM M5/2m | FEM M6/3m | FEM M7/4m | Lift speed | Falls |
|---|---|---|---|---|---|---|---|
| GP 1000/1NF | 1600 | 1250 | 1000 | 800 | 630 | 8/2 m/min | 1 |
| GP 1000/1SF | – | 630 | 500 | 400 | – | 16/4 m/min | 1 |
| GP 1000/1NL | 1600 | 1250 | 1000 | 800 | 630 | 4 m/min | 1 |
| GP 1000/1N | 1600 | 1250 | 1000 | 800 | 630 | 8 m/min | 1 |
| GP 1000/2NF | – | 2500 | 2000 | 1600 | 1250 | 4/1 m/min | 2 |
| GP 1000/2NL | – | 2500 | 2000 | 1600 | 1250 | 2 m/min | 2 |
| GP 1000/2N | – | 2500 | 2000 | 1600 | 1250 | 4 m/min | 2 |

## Single-phase 230V variants (1Ph)

Reduced FEM ratings; **inching causes malfunctions on 1Ph variants** (explicit GIS warning).

### GP 250 1Ph

| Variant | FEM M4 | FEM M5 | FEM M6 | Speed | Falls |
|---|---|---|---|---|---|
| GP 250/1NL 1Ph | 250 | 200 | 160 | 4 m/min | 1 |
| GP 250/1N 1Ph | 250 | 200 | 160 | 8 m/min | 1 |
| GP 250/2NL 1Ph | 500 | 400 | 320 | 2 m/min | 2 |
| GP 250/2N 1Ph | 500 | 400 | 320 | 4 m/min | 2 |

### GP 500 1Ph

| Variant | FEM M4 | FEM M5 | FEM M6 | Speed | Falls |
|---|---|---|---|---|---|
| GP 500/1NL 1Ph | 500 | 400 | 320 | 4 m/min | 1 |
| GP 500/1N 1Ph | 250 | 200 | 160 | 8 m/min | 1 |
| GP 500/2NL 1Ph | 1000 | 800 | 630 | 2 m/min | 2 |
| GP 500/2N 1Ph | 500 | 400 | 320 | 4 m/min | 2 |

### GP 1000 1Ph

| Variant | FEM M4 | FEM M5 | FEM M6 | Speed | Falls |
|---|---|---|---|---|---|
| GP 1000/1NL 1Ph | 1000 | 800 | 630 | 4 m/min | 1 |
| GP 1000/1N 1Ph | 500 | 400 | – | 8 m/min | 1 |
| GP 1000/2NL 1Ph | 2000 | 1600 | 1250 | 2 m/min | 2 |
| GP 1000/2N 1Ph | 1000 | 800 | – | 4 m/min | 2 |

## Important — capacity is COMMITTED at commissioning

The same physical hoist can carry different SWL ratings depending on the FEM duty classification selected at commissioning. **The rating on the data plate is the committed classification — operator cannot re-select**, this is set for the whole service life.

Sample: a GP 250/1NF physical unit, FEM-classified at M3 = 400 kg SWL on the plate. Re-using as M4 = 320 kg requires nameplate replacement and inspection.

## Suspension types

| Type | Detail |
|---|---|
| Top hook | Standard |
| Lug | Bolted direct |
| **Eyebolt** (GIS-specific) | Alternative to top hook in some installations — different h spec |
| Push trolley | Manual traverse |
| Motorised trolley | Powered (GIS motorised) |

**Note GIS includes an eyebolt suspension variant** with its own h dimension table (see [01_measurements.md](01_measurements.md) Section 3) — not standard on every brand.

## Related GIS products (identification — out of scope here)

If you encounter a GIS unit that ISN'T GP:

| Series | Notes |
|---|---|
| GPM 250 | Mini variant of GP 250 |
| GPK | Low-headroom up to 4,000 kg |
| GCH 250 / 500 (May 2005+) | Different series, different manual |
| GCH 1000 / 1600 / 2000 / 2500 (Oct 2006+) | Different series |
| LP / LPM | Smaller capacity Swiss design |
| EM / EME (1992-2005, discontinued) | Older series — parts may be challenging |

**Always check the data plate** to identify which series before applying inspection criteria.
