# DEMAG — Model & Variant Matrix

**Manufacturer:** Demag Cranes & Components GmbH (Wetter, Germany; Konecranes Group since 2017)
**Series in scope:** DC-Pro chain hoist (DC-Pro 1 – DC-Pro 20). Manulift variant: DCM-Pro.
**Capacity range:** 125 kg – 2,000 kg
**Note:** **DC-Com** is the current generation; supersedes DC-Pro on new builds. Architecture is largely the same; values cross-check against current DC-Com manual where possible.

References:
- [Demag DC-Pro / DCM-Pro brochure 22930949](https://www.demagcranes.com/sites/default/files/media/documents/22930949%20DC-Pro_DCM-Pro_brochure_4.pdf)
- [Demag DC-Pro IS 817 (203 571 44)](https://www.demagcranes.com/sites/default/files/media/documents/20357144_131219_0.pdf)
- [Demag DC-Pro chain hoist product page](https://www.demagcranes.com/en-us/products/hoist-units/chain-hoists/dc-pro-chain-hoist)

## Models (in scope: ≤ 2 t)

| Model | Capacity | Reeving | Chain (d × t) | FEM | Brake check |
|---|---|---|---|---|---|
| DC-Pro 1 | 125 kg | 1/1 | 4.2 × 12.2 mm | 4m | Every 10 years |
| DC-Pro 2 | 250 kg | 1/1 | 4.2 × 12.2 mm | 2m+ | Every 10 years |
| DC-Pro 5 | 500 kg | 1/1 | 5.2 × 15.3 mm | 2m+ | Every 10 years |
| DC-Pro 10 | 1,000 kg | 1/1 | 7.2 × 21.4 mm | 2m+ | **Every 5 years** |
| DC-Pro 20 | 2,000 kg | 2/1 | 7.2 × 21.4 mm | 2m+ | **Every 5 years** |

The 5-year vs 10-year brake-check split is OEM (`DC-Pro 1/2/5` long interval, `DC-Pro 10/20` short interval). Confidence: HIGH.

DCM-Pro Manulift = DC-Pro 1/2/5 with helical-cord pendant for hand-held lifting.

## Variants (V1 vs V2)

DC-Pro variant suffix:
- **V1** — single-speed motor (8-pole)
- **V2** — dual-speed motor (8/2 or 8/4 pole-changing)

| Variant | SWL | Speed (m/min main) | Speed (m/min creep) | Motor | Confidence |
|---|---|---|---|---|---|
| DC-Pro 1-...V1 | 125 kg | 9.6 | 2.4 (no — single speed) | ZNK 71 B 8/2 | HIGH |
| DC-Pro 1-...V2 | 125 kg | 19.2 | 4.8 | ZNK 71 B 8/2 | HIGH |
| DC-Pro 2-...V1 | 250 kg | 9.6 | n/a | ZNK 71 B 8/2 | HIGH |
| DC-Pro 2-...V2 | 250 kg | 19.2 | 4.8 | ZNK 80 A 8/4 | HIGH |
| DC-Pro 5-...V1 | 500 kg | 7.2 | n/a | ZNK 80 A 8/2 | HIGH |
| DC-Pro 5-...V2 | 500 kg | 14.4 | 3.6 | ZNK 100 A 8/4 | HIGH |
| DC-Pro 10-...V1 | 1,000 kg | 7.2 | n/a | ZNK 100 A 8/2 | HIGH |
| DC-Pro 10-...V2 | 1,000 kg | 14.4 | 3.6 | ZNK 100 B 8/2 | HIGH |
| DC-Pro 20-...V1 | 2,000 kg | 7.2 | n/a | ZNK 100 B 8/2 | HIGH |
| DC-Pro 20-...V2 | 2,000 kg | 14.4 | 3.6 | ZNK 100 B 8/2 | HIGH |

Motor codes verified against the IS 817 technical data document — these are the actual designations on DC-Pro nameplates.

## Higher capacities (out of scope)

DC-Pro 25 / 32 / 50 exist (above 2 t). Architecture extends; chain class steps up. Refer to current DC-Com catalog for replacements.

## Suspension types

| Type | Trolley series | Notes |
|---|---|---|
| Top hook | n/a | Standard fit |
| Lug | n/a | Bolt-on direct mount |
| Push trolley | DRP-Pro | Manual traverse, flange 50–220 mm |
| Motorised trolley | DKK / DKUN | Powered, 3-axis pendant DSE-C |

Compatible with KBK suspension monorail system (Demag house standard for light-duty crane runways).

## Pendant variants

| Pendant | Axes | Use case |
|---|---|---|
| DSC | 2 (lift / lower) | Hoist only |
| DSE-C | 3 (lift + trolley + cross-travel) | Hoist with motorised trolley |
| DSM-C | 2 (Manulift spade-handle) | DCM-Pro Manulift only |

All pendants IP65; control voltage 24V (low-voltage relay control).

## Special variants

- **DCM-Pro** Manulift — helical pendant, spade handle. Same hoist body, different controls.
- **DC-Com** — successor generation; 7-segment display update, control electronics updated. Architecture closely matches DC-Pro.
- ATEX (DC-EX) — explosion-proof variants exist; separate manual; **out of scope for this pack**.
