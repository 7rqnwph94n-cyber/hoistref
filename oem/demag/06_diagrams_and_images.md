# DEMAG — Diagrams & Image Roadmap

---

## Already implemented (shared diagram components)

The data-driven SVG diagrams in `app/src/components/diagrams/` render correctly for DC-Pro using brand-aware logic:

| Diagram | Component | Behaviour for DEMAG |
|---|---|---|
| Chain 11-link strip | `ChainDiagram` | Renders DC-Pro chain dimensions per variant |
| Chain weld orientation | `ChainWeldsDiagram` | DEMAG = OUTWARD (correct) |
| Hook profile | `HookDiagram` | Renders f / e dimensions where present |
| Brake — air gap | `BrakeDiagram variant="air-gap"` | Wear difference > 0.45 mm = replace; spec text uses model's check interval |
| Clutch — factory-set | `ClutchDiagram variant="factory-set"` | Tamper-seal callout — DEMAG policy "do not adjust" |
| Trolley wheel | `TrolleyWheelDiagram` | Standard wear table |

---

## Diagrams to add (DEMAG-specific)

| Diagram | Use case | Suggested component | Notes |
|---|---|---|---|
| 7-segment display states | Identifying normal vs fault | `Demag7SegDisplay.tsx` | Renders all states: operating hrs, LIFTING V1/V2, SLIP LIFTING, E1–E7 |
| DC-Pro vs DC-Com nameplate comparison | Variant identification on site | `DemagNameplateCompare.tsx` | Side-by-side nameplate examples |
| Chain set — exploded view | SOP 4 (whole-chain replacement) | `DemagChainSet.tsx` | Sprocket + guide + plates + buffers + anchorage + chain |
| Brake exploded view (3 × M5) | SOP 2 (wear check) | `DemagBrakeExploded.tsx` | Brake disc + retaining screws + V-ring |
| Slip clutch — chain limit stop test setup | SOP 5 (annual function test) | `DemagClutchTestSetup.tsx` | Hoist + chain + relocated stop above hook fittings |
| Limit-switch cam positions | SOP 8 + LOLER | `DemagLimitCam.tsx` | Cam wheel showing upper/lower position settings |

---

## Photographs to source

Manufacturer hero photos at the OEM links below. **For technician imagery, Rich's own field photographs are preferred** — Demag marketing imagery is not licensed for app embedding without explicit agreement.

| Photo | Use case | Suggested filename |
|---|---|---|
| DC-Pro nameplate (worked example) | Variant identification | `demag-dc-pro-nameplate.jpg` |
| DC-Com nameplate (for comparison) | Identifying current-gen units | `demag-dc-com-nameplate.jpg` |
| 7-segment display showing operating hours | Normal display reference | `demag-display-operating-hrs.jpg` |
| 7-segment display showing E1–E7 examples | Fault diagnosis SOP | `demag-display-e-codes.jpg` |
| Stamped DEMAG mark on chain (every 12th link) | Chain authenticity check | `demag-chain-mark.jpg` |
| Demag chain gauge 836 025 44 in use | SOP 3 procedure | `demag-chain-gauge-in-use.jpg` |
| Brake assembly with 3 × M5 visible | SOP 2 procedure | `demag-brake-assembly.jpg` |
| Brake disc — non-actuated reference points | SOP 2 measurement | `demag-brake-non-actuated.jpg` |
| Brake disc — actuated (G-clamp pressing springs) | SOP 2 measurement | `demag-brake-actuated.jpg` |
| Friction force checking device 836 708 44 | SOP 5 procedure | `demag-friction-force-836-708-44.jpg` |
| Chain limit stop relocated above hook fittings (test position) | SOP 5 setup | `demag-chain-limit-test-setup.jpg` |
| Hook f-dimension measurement | SOP 6 procedure | `demag-hook-f-dimension.jpg` |
| Suspension bracket short vs long e-dimension | SOP 6 reference | `demag-bracket-short-vs-long.jpg` |
| Pendant: DSC vs DSE-C comparison | Variant identification | `demag-pendants-dsc-dse-c.jpg` |
| KBK monorail attachment | Suspension reference | `demag-kbk-monorail.jpg` |

---

## OEM canonical sources

| Resource | URL |
|---|---|
| DC-Pro chain hoist product page | https://www.demagcranes.com/en-us/products/hoist-units/chain-hoists/dc-pro-chain-hoist |
| DC-Com chain hoist product page (current gen) | https://www.demagcranes.com/en-us/products/hoist-units/chain-hoists/dc-com-chain-hoist |
| DCM-Pro Manulift product page | https://www.demagcranes.com/en-us/products/hoist-units/chain-hoists/dcm-pro-manulift |
| DC-Pro / DCM-Pro brochure 22930949 | https://www.demagcranes.com/sites/default/files/media/documents/22930949%20DC-Pro_DCM-Pro_brochure_4.pdf |
| DC-Pro IS 817 technical data 203 571 44 | https://www.demagcranes.com/sites/default/files/media/documents/20357144_131219_0.pdf |

Already wired into the app via `model.references[]`.

---

## Image storage strategy

```
/app/public/images/demag/
   nameplate/
   display/
   chain/
   brake/
   clutch/
   hooks/
   pendant/
   suspension/
```

Use `images: ProductImage[]` field on Model (already in types.ts).
