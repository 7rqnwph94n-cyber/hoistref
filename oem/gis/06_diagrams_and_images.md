# GIS — Diagrams & Image Roadmap

---

## Already implemented (shared diagram components)

| Diagram | Component | Behaviour for GIS |
|---|---|---|
| Chain 11-link strip | `ChainDiagram` | Renders profile-chain dimensions per variant (note: visual is round; profile-shape diagram still to add) |
| **Chain weld orientation** | `ChainWeldsDiagram weldFaces="inward"` | **GIS = INWARD** (the diagram is brand-aware) |
| Hook profile | `HookDiagram` | Renders h, l per Table 3-5 |
| Brake — air gap | `BrakeDiagram variant="air-gap"` | Per-model max (0.7 / 0.7 / 0.9 mm) |
| Clutch — clamping-screw | `ClutchDiagram variant="clamping-screw"` | Adjustment by authorised personnel |
| Trolley wheel | `TrolleyWheelDiagram` | Standard wear table |

---

## Diagrams to add (GIS-specific)

| Diagram | Use case | Suggested component |
|---|---|---|
| **Profile chain cross-section** (visual difference vs round) | SOP 2 / 3 — why generic gauges don't fit | `GisProfileChainSection.tsx` |
| **GIS profile chain over sprocket** (with INWARD weld highlight) | SOP 3 — orientation rule | `GisProfileWeldsDiagram.tsx` |
| **Geared limit switch transmission selector** (4 colour-coded options) | SOP 7 — commissioning | `GisLimitTransmissionSelector.tsx` |
| **Geared limit switch cam mechanism** (rocker + control wheels) | SOP 7 — setting procedure | `GisLimitCamSetup.tsx` |
| **Suspension types: top hook / lug / eyebolt / trolley** | Hook tab — eyebolt is GIS-specific | `GisSuspensionTypes.tsx` |
| **Eyebolt suspension** | Hook tab — h dimension diagram | `GisEyeboltDiagram.tsx` |
| **Inspection pass template** | Documentation reference | `GisInspectionPassTemplate.tsx` |
| **k1 / k2 safety suspension measurements** | SOP 3 — chain installation | `GisK1K2Diagram.tsx` |
| **Brake coating + disc set** (replaced together) | SOP 5 — replacement | `GisBrakeSetExploded.tsx` |
| **1Ph inching warning visual** | SOP 11 — operator education | `Gis1PhInchingWarning.tsx` |

---

## Photographs to source

| Photo | Use case | Suggested filename |
|---|---|---|
| GP nameplate (worked example showing model + duty + FEM) | Variant identification | `gis-gp-nameplate.jpg` |
| 1Ph nameplate (single-phase variant) | Variant identification | `gis-gp-1ph-nameplate.jpg` |
| Profile chain section (vs round-section comparison) | Chain education | `gis-profile-chain-cross-section.jpg` |
| Profile chain — close-up of welded link | Chain authenticity | `gis-profile-chain-weld.jpg` |
| Profile chain on sprocket — INWARD orientation | SOP 3 procedure | `gis-chain-inward-orientation.jpg` |
| Profile chain on sprocket — OUTWARD (wrong, educational) | SOP 3 — what NOT to do | `gis-chain-wrong-orientation.jpg` |
| Geared limit switch transmission gear (showing colour-coded variants) | SOP 7 reference | `gis-limit-transmission-gear.jpg` |
| Limit switch cam wheels (red / green) | SOP 7 procedure | `gis-limit-cam-wheels.jpg` |
| Rocker switch (1) for limit disable | SOP 3 / 7 | `gis-rocker-switch.jpg` |
| k1 measurement (safety suspension) on 1-fall | SOP 3 procedure | `gis-k1-measurement.jpg` |
| k2 measurement on 2-fall | SOP 3 procedure | `gis-k2-measurement.jpg` |
| Eyebolt suspension fitted | Hook tab reference | `gis-eyebolt-suspension.jpg` |
| Load hook with calliper measuring h | SOP 8 procedure | `gis-load-hook-h-measure.jpg` |
| Hook opening l measurement | SOP 8 procedure | `gis-hook-l-measure.jpg` |
| Brake coil + disc set (replaced together) | SOP 5 procedure | `gis-brake-set.jpg` |
| Feeler gauge measuring brake air gap | SOP 4 procedure | `gis-brake-air-gap.jpg` |
| Slipping clutch test setup | SOP 6 procedure | `gis-clutch-test.jpg` |
| Inspection pass — completed entry example | Documentation reference | `gis-inspection-pass-entry.jpg` |
| 1Ph variant motor with capacitor | SOP 11 reference | `gis-1ph-motor-capacitor.jpg` |
| GP push trolley | Suspension reference | `gis-gp-push-trolley.jpg` |
| GP motorised trolley | Suspension reference | `gis-gp-motorised-trolley.jpg` |

---

## OEM canonical sources

| Resource | URL |
|---|---|
| GIS GP product page | https://gis-ag.ch/en/industry/products/electric-chain-hoists/18-electric-chain-hoist-gp/ |
| GIS GP technical data sheet 9500_9105_1 | https://gis-ag.ch/gis%20ag/mediathek/pdf/englisch/01-elektrokettenzug/modell%20gp/9500_9105_1%20Technical%20data%20sheet%20GP%20-%20trolleys.pdf |
| GIS GP series Instruction Manual (ManualsLib) | https://www.manualslib.com/manual/1979661/Gis-Gp-Series.html |
| Hydramach mirror of technical data sheet | https://www.hydramachcrane.com/assets/product-chainhoist/gp-series/technical_data_sheet_gp-trolleys_Hydramach.pdf |

Already wired into the app via `model.references[]`.

---

## Image storage strategy

```
/app/public/images/gis/
   nameplate/                # GP + 1Ph examples
   chain/                    # profile chain cross-section, weld orientation
   limit-switch/             # transmission gears, cam wheels, rocker switch
   brake/                    # coating + disc set, air gap measurement
   clutch/                   # adjustment + test setup
   hooks/                    # h / l measurements + eyebolt
   suspension/               # k1 / k2 measurements
   inspection-pass/          # template + completed example
   trolley/                  # push + motorised
```

Use `images: ProductImage[]` field on Model.

---

## Diagram priority

For first wave of GIS-specific diagrams, prioritise:

1. **Profile chain cross-section** — single most distinctive feature
2. **Welded seam INWARD** — most common error mode for technicians coming from STAHL/etc
3. **Limit switch transmission selector** — colour-coded; commissioning-critical
4. **k1 / k2 measurements** — chain installation safety

These four address the GIS-specific tasks that don't share visualisation with other brands' diagrams.
