# YALE — Model & Variant Matrix

**Manufacturer:** Columbus McKinnon Industrial Products GmbH (Wuppertal, Germany). Yale is a CMCO brand.
**Series in scope:** Yale CPV / CPVF electric chain hoist
**Capacity range:** 125 kg – 2 t (CPE series above 1.6 t out of scope here)

References:
- [Yale CPV electric chain hoist (CMCO product page)](https://www.cmco.com/en-us/products/hoisting-lifting-equipment/electric-air-hoists/electric-chain-hoists/yale-cpv-electric-chain-hoist/)
- [Yale CPV/CPVF Operating Instructions (CMCO 2018)](https://portalimages.blob.core.windows.net/products/pdfs/cvsgjmfa_Yale-CPV-CPVF-Manual.pdf)
- [Yale CPV datasheet (Hawk Lifting)](https://www.hawklifting.co.uk/wp-content/uploads/2015/08/Yale-CPV-Electric-Chain-Hoist-Datasheet.pdf)

## Model coding

Format: `CPV [size]-[main-speed]` or `CPVF [size]-[main-speed]`

- `CPV` = single-speed
- `CPVF` = two-speed (Feinhub, fine-lift)
- Size number indicates capacity class
- Speed number = main lift speed in m/min

## Models in scope (3-phase 400V 50Hz, ≤ 2 t)

| Model | Capacity | Falls | Chain | FEM/ISO |
|---|---|---|---|---|
| CPV 2-8 | 125 / 250 kg | 1 | 4 × 12.2 DAT | 3m/M6 (125 kg); 1Am/M4 (250 kg) |
| CPVF 2-8 | 125 / 250 kg | 1 | 4 × 12.2 DAT | as above |
| CPVF 2-18 | 250 kg | 1 | 5 × 15.1 DAT | 1Am/M4 |
| CPV 5-8 | 320 / 500 kg | 1 | 5 × 15.1 DAT | 3m/M6 (320); 1Am/M4 (500) |
| CPVF 5-8 | 320 / 500 kg | 1 | 5 × 15.1 DAT | as above |
| CPV 5-4 | 500 kg | 2 | 4 × 12.2 DAT | 1Am/M4 |
| CPVF 5-4 | 500 kg | 2 | 4 × 12.2 DAT | 1Am/M4 |
| CPVF 5-18 | 500 kg | 1 | 7.1 × 20.5 DAT | 1Am/M4 |
| CPV 10-8 | 630 / 1000 kg | 1 | 7.1 × 20.5 DAT | 3m/M6 (630); 1Am/M4 (1000) |
| CPVF 10-8 | 630 / 1000 kg | 1 | 7.1 × 20.5 DAT | as above |
| CPV 10-4 | 1000 kg | 2 | 5 × 15.1 DAT | 1Am/M4 |
| CPVF 10-4 | 1000 kg | 2 | 5 × 15.1 DAT | 1Am/M4 |
| CPV 20-4 | 1500 / 2000 kg | 2 | 7.1 × 20.5 DAT | 2m/M5 (1500); 1Am/M4 (2000) |
| CPVF 20-4 | 1500 / 2000 kg | 2 | 7.1 × 20.5 DAT | as above |

Confidence: HIGH — Yale CPV/CPVF technical data table from CMCO 2018 manual.

## Note on chain across siblings

**Same model code can use different chain at different capacities.** Example:
- CPV 5-4 = 500 kg via 2 falls on **4 × 12.2** chain
- CPV 5-8 = 500 kg via 1 fall on **5 × 15.1** chain

Same plate weight, different chain, different inspection table. Always verify the chain on the unit before applying wear limits.

## 230V single-phase variants

Single-phase 230V variants exist (CPV 2-4 125/250, CPV 5-2 500, CPVF 5-8 500, CPVF 10-4 1000, CPV 10-4 1000, CPVF 20-2 2000) at **reduced duty classification (1Bm/M3)**. Theoretical service life shorter than 3-phase equivalent. Less common but worth knowing about.

## Identification on site

- **Nameplate:** model code, capacity, year, serial, FEM classification
- **Chain marking:** `DAT` text on the chain itself if stamped — primary chain authenticity check

## Theoretical service life

| FEM | Hours full load | Calendar (typical) |
|---|---|---|
| 1Am / M4 (standard) | 800 h | ~10 years |
| 3m / M6 | — | Higher duty re-classification |
| 1Bm / M3 (single-phase) | — | Shorter |

CPV can be re-classified up to 3m/M6 with capacity or duty-cycle reduction. After theoretical life expires → general overhaul required (BGV D6 / FEM 9.755).

## Higher capacities (CPE series — out of scope)

CPE series (1,600+ kg) uses the same philosophy but different part numbering. 11.3 × 31 mm chain. Not covered in this pack.

## Suspension types

| Type | Trolley series | Notes |
|---|---|---|
| Top hook | n/a | Standard |
| Lug | n/a | Bolted direct |
| Push trolley | CPS / VTC-A | Manual, flange 50–220 mm |
| Motorised trolley | CPE-VFM / E-VTE | VFD-controlled options available |

Trolley wheel clearance: 2 mm each side / 4 mm total max.
