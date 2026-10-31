# YALE — Diagrams & Image Roadmap

---

## Already implemented (shared diagram components)

| Diagram | Component | Behaviour for Yale |
|---|---|---|
| Chain 11-link strip | `ChainDiagram` | Renders DAT chain dimensions per variant |
| Chain weld orientation | `ChainWeldsDiagram` | Yale = OUTWARD |
| Hook profile | `HookDiagram` | Generic hook (Yale specifies 10% / 5% rule rather than per-model) |
| Brake — air gap | `BrakeDiagram variant="air-gap"` | 0.15-0.30 mm nominal, max per Yale Table 5 |
| Clutch — cover-screw | `ClutchDiagram variant="cover-screw"` | Externally adjustable via fan guard removal |
| Trolley wheel | `TrolleyWheelDiagram` | Standard wear table |

---

## Diagrams to add (Yale-specific)

| Diagram | Use case | Suggested component |
|---|---|---|
| **C-link replacement step-by-step** | SOP 3 chain replacement (1-strand) | `YaleCLinkProcedure.tsx` |
| **Pre-coated single-use anchor screw** detail | SOP 3 (2-strand) — never reuse | `YaleSingleUseScrew.tsx` |
| **DAT chain marking** | SOP 2 / chain authenticity | `YaleDATMark.tsx` |
| **Slip clutch adjustment (fan guard removal)** | SOP 5 — sequence | `YaleClutchAdjustment.tsx` |
| **Force-limit factor formula** display | SOP 5 — verification | `YaleForceLimitFormula.tsx` |
| **Brake removal sequence** | SOP 8 — hood + transformer plate + brake | `YaleBrakeRemoval.tsx` |
| **Cold-start procedure** (below 0 °C) | SOP 11 | `YaleColdStart.tsx` |
| **Hook discard 10%/5% rule** | SOP 6 visualisation | `YaleHookDiscard.tsx` |

---

## Photographs to source

| Photo | Use case | Suggested filename |
|---|---|---|
| CPV nameplate (worked example) | Variant identification | `yale-cpv-nameplate.jpg` |
| CPVF nameplate (two-speed reference) | Variant identification | `yale-cpvf-nameplate.jpg` |
| 230V single-phase nameplate | Reduced-duty variant | `yale-cpv-230v-1ph.jpg` |
| DAT chain stamping | SOP 2 procedure | `yale-dat-chain-mark.jpg` |
| C-link cut into second-to-last link | SOP 3 procedure | `yale-c-link.jpg` |
| C-link suspended in old chain ready to draw new through | SOP 3 procedure | `yale-c-link-draw.jpg` |
| Pre-coated single-use anchor screws (new) | SOP 3 — 2-strand | `yale-single-use-screws.jpg` |
| Anchor with single-use screws fitted | SOP 3 procedure | `yale-anchor-fitted.jpg` |
| Fan guard removed showing slip clutch adjusting nut | SOP 5 procedure | `yale-clutch-fan-removed.jpg` |
| Two-hole nut turner (DIN 3116) | SOP 5 tool reference | `yale-nut-turner-din3116.jpg` |
| Test load suspended at 125% | SOP 5 procedure | `yale-clutch-test-load.jpg` |
| Feeler gauge between anchor disc and magnet section | SOP 7 brake air gap | `yale-air-gap-feeler.jpg` |
| Hoist hood (4 cylinder bolts) before removal | SOP 8 procedure | `yale-hood-bolts.jpg` |
| Transformer / contactor control plate (CPV/F 2-20 to 20-4) | SOP 8 procedure | `yale-transformer-plate.jpg` |
| Brake assembly removed | SOP 8 procedure | `yale-brake-removed.jpg` |
| Hook wear check — calliper at mouth | SOP 6 procedure | `yale-hook-mouth-measure.jpg` |
| Hook wear check — calliper at section | SOP 6 procedure | `yale-hook-section-measure.jpg` |
| Cold-start: lift small load below 0 °C | SOP 11 | `yale-cold-start-load.jpg` |

---

## OEM canonical sources

| Resource | URL |
|---|---|
| Yale CPV electric chain hoist (CMCO product page) | https://www.cmco.com/en-us/products/hoisting-lifting-equipment/electric-air-hoists/electric-chain-hoists/yale-cpv-electric-chain-hoist/ |
| Yale CPV/CPVF Operating Instructions (CMCO 2018) | https://portalimages.blob.core.windows.net/products/pdfs/cvsgjmfa_Yale-CPV-CPVF-Manual.pdf |
| Yale CPV datasheet (Hawk Lifting) | https://www.hawklifting.co.uk/wp-content/uploads/2015/08/Yale-CPV-Electric-Chain-Hoist-Datasheet.pdf |

Already wired into the app via `model.references[]`.

---

## Image storage strategy

```
/app/public/images/yale/
   nameplate/
   chain/                  # DAT mark + C-link procedure
   anchor/                 # single-use screws
   clutch/                 # adjustment sequence
   brake/                  # removal sequence
   hooks/                  # measurement
   cold-start/             # below 0 °C procedure
```

Use `images: ProductImage[]` field on Model.
