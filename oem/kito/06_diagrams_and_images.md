# KITO — Diagrams & Image Roadmap

---

## Already implemented (shared diagram components)

| Diagram | Component | Behaviour for Kito |
|---|---|---|
| Chain 11-link strip | `ChainDiagram` | Renders ER2 chain dimensions per variant chain code |
| Chain weld orientation | `ChainWeldsDiagram` | Default OUTWARD (per Kito service manual) |
| Hook profile | `HookDiagram` | Renders nominal a/b/c values with note: "compare to recorded initial value" |
| Brake | `BrakeDiagram variant="air-gap"` | Generic — Kito ER2 has body-size-specific spec |
| Clutch — factory-set | `ClutchDiagram variant="factory-set"` | Tamper seal — friction clutch is fault-stop only |
| Trolley wheel | `TrolleyWheelDiagram` | Standard wear table |

---

## Diagrams to add (Kito-specific)

| Diagram | Use case | Suggested component |
|---|---|---|
| **Chain mark detail** (RH-DAT / FT-DAT + Lot No. + KITO + heat code) | SOP 2 chain authenticity check | `KitoChainMarkDetail.tsx` |
| **Mark pitch by chain size** (visual table) | SOP 2 reference | `KitoChainMarkPitchTable.tsx` |
| **Hook a/b/c dimensions with embossed marks** | SOP 4 procedure | `KitoHookABCDiagram.tsx` |
| **"Record of the Initial Value" template** | Commissioning + LOLER documentation | `KitoInitialValueRecord.tsx` |
| **Cushion rubber + chain spring** (location + role) | Daily inspection | `KitoCushionSpring.tsx` |
| **Double safety mechanism** (clutch + limit switches as 2 layers) | Component education | `KitoDoubleSafety.tsx` |
| **Body-size codes B/C/D/E/F** (visual size comparison) | Variant identification | `KitoBodySizeCompare.tsx` |
| **CH Meter display** (operating hours + start count) | Frequent inspection | `KitoCHMeterDisplay.tsx` |
| **VFD controller cover + plug locations** (5-min wait, 30-min cool zones) | VFD safety preamble | `KitoVFDSafetyZones.tsx` |
| **Mechanical-brake-clutch pawl** (audible click variant) | Variant identification | `KitoPawlClutch.tsx` |

---

## Photographs to source

| Photo | Use case | Suggested filename |
|---|---|---|
| ER2 nameplate (worked example showing body code, FEM class, year) | Variant identification | `kito-er2-nameplate.jpg` |
| RH-DAT chain mark — close-up | SOP 2 procedure | `kito-rh-dat-mark.jpg` |
| FT-DAT chain mark — close-up | SOP 2 procedure (4.3 mm chain) | `kito-ft-dat-mark.jpg` |
| Counterfeit / unmarked chain example (educational) | SOP 2 — "what to reject" | `kito-non-genuine-chain.jpg` |
| Hook with embossed marks for `a` measurement | SOP 4 procedure | `kito-hook-a-marks.jpg` |
| Hook with calliper measuring `b` | SOP 4 procedure | `kito-hook-b-measure.jpg` |
| Hook with calliper measuring `c` | SOP 4 procedure | `kito-hook-c-measure.jpg` |
| Cushion rubber visible in chain feed area | Daily inspection / fault diagnosis | `kito-cushion-rubber.jpg` |
| Chain spring | Daily inspection | `kito-chain-spring.jpg` |
| CH Meter readout | Frequent inspection / SOP 8 | `kito-ch-meter.jpg` |
| VFD controller cover with capacitor wait sticker | SOP 5 — VFD preamble | `kito-vfd-cover.jpg` |
| Friction clutch external OLL | Component identification | `kito-external-oll.jpg` |
| Pawl clutch detail (mechanical-brake variant) | Variant identification | `kito-pawl-clutch.jpg` |
| MR2 motorised trolley | Trolley reference | `kito-mr2-motorised.jpg` |
| TSP push trolley | Trolley reference | `kito-tsp-push.jpg` |
| TSG geared trolley | Trolley reference | `kito-tsg-geared.jpg` |
| ER vs ER2 chain comparison | "Don't mix" educational | `kito-er-vs-er2.jpg` |

---

## OEM canonical sources

| Resource | URL |
|---|---|
| Kito ER2 product page | https://www.kito.net/en/products/er2-electric-chain-hoist/ |
| Kito ER2 Owner's Manual 125 kg–5 t | https://kito.net/files/downloads/er2/er2/manuals/en/ER2-Manual-125kg--5t-_-04.pdf |
| Kito ER2 catalog (ER2CE0805_04) | https://kito.com.br/download/2021/05/12/1dy0g3ml9n_Cat_logo_NO._ER2CE0805_04_.pdf |
| Kito ER2 inverter manual | https://kito.ca/download/2014/05/17/84p17ky5nd_ER2_Inverter_Manual_rev._0804_MC_02_.pdf |

For body-size-specific brake, gear oil, and torque values: contact Kito distributor for the **ER2 Disassembly/Reassembly Manual** appropriate to the body code.

Already wired into the app via `model.references[]`.

---

## Image storage strategy

```
/app/public/images/kito/
   nameplate/
   chain/                    # mark photos and ER vs ER2 reference
   hooks/                    # a/b/c measurement photos
   safety/                   # cushion rubber, chain spring
   ch-meter/
   vfd/
   clutch/
   trolley/                  # MR2, TSP, TSG
```

Use `images: ProductImage[]` field on Model.
