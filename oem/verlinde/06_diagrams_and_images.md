# VERLINDE — Diagrams & Image Roadmap

⚠ **Verlinde is currently the lowest-data-depth pack.** OEM PDFs cited at top of [00_models.md](00_models.md) contain the figures needed for full-fidelity diagrams. They were not retrievable via search alone in the current research pass.

---

## Already implemented (shared diagram components)

The shared SVG components in `app/src/components/diagrams/` will render correctly for Verlinde once the data file is populated. Generic application:

| Diagram | Component | Behaviour for Verlinde |
|---|---|---|
| Chain 11-link strip | `ChainDiagram` | Renders chain dimensions per variant (once chain values are confirmed from OEM PDF) |
| Chain weld orientation | `ChainWeldsDiagram` | **Direction NOT YET CONFIRMED for Verlinde** — do not deploy until verified |
| Hook profile | `HookDiagram` | Generic; specific h/z values per OEM PDF |
| Brake — air gap | `BrakeDiagram variant="air-gap"` | Generic; air gap values NOT FOUND |
| Clutch — externally accessible | `ClutchDiagram variant="cover-screw"` is closest visual | Verlinde clutch is externally accessible on VR — diagram approximate |
| Trolley wheel | `TrolleyWheelDiagram` | Standard |

---

## Diagrams to add (Verlinde-specific)

| Diagram | Use case | Suggested component |
|---|---|---|
| **VL legacy vs VR current sprocket comparison** | Variant identification | `VerlindeVLvsVRSprocket.tsx` |
| **VR 5-pocket sprocket with intermediate teeth** (architectural innovation) | Component education / VR vs older sprocket | `VerlindeVRSprocket.tsx` |
| **Brake & clutch separate load paths** (Verlinde-distinctive) | Component education | `VerlindeBrakeClutchPaths.tsx` |
| **VR Phase 2 lifting nut** (tilted design) | Phase 2 identification | `VerlindeVRPhase2Nut.tsx` |
| **Geared limit switch — 2-step / 4-step** | Limit switch reference | `VerlindeGearedLimitSwitch.tsx` |
| **230V 1-phase variant warning** (no electric limit switch) | Safety education | `Verlinde1PhNoLimit.tsx` |
| **Suffix codification** (VL5 504 B2 = …) | Variant identification | `VerlindeSuffixDecoder.tsx` |
| **Eurobloc Variator VTN vs Eurochain VL/VR** | Cross-product confusion (wire rope vs chain) | `VerlindeProductFamilyMap.tsx` |
| **Konecranes vs CMCO group** | Service routing education | `VerlindeGroupMap.tsx` |

---

## Photographs to source

| Photo | Use case | Suggested filename |
|---|---|---|
| VL nameplate (worked example) | Variant identification | `verlinde-vl-nameplate.jpg` |
| VR nameplate | Variant identification | `verlinde-vr-nameplate.jpg` |
| VR Phase 2 nameplate | Phase 2 identification | `verlinde-vr-phase2-nameplate.jpg` |
| 1Ph variant nameplate | 1-phase variant identification | `verlinde-vl-1ph-nameplate.jpg` |
| VR sprocket close-up showing intermediate teeth | Architectural reference | `verlinde-vr-sprocket-teeth.jpg` |
| VR Phase 2 tilted lifting nut | Phase 2 identification | `verlinde-vr-phase2-nut.jpg` |
| Brake disc with two friction linings | Component reference | `verlinde-brake-disc.jpg` |
| Slip clutch externally accessible (VR) | SOP 5 procedure | `verlinde-vr-clutch-external.jpg` |
| Geared limit switch (showing 2- or 4-step variants) | SOP 7 reference | `verlinde-geared-limit-switch.jpg` |
| Eurochain VL series hoist | Brand reference | `verlinde-vl-hoist.jpg` |
| Eurochain VR series hoist | Brand reference | `verlinde-vr-hoist.jpg` |
| Eurosystem motorised trolley | Suspension reference | `verlinde-eurosystem-trolley.jpg` |
| Eurobloc Variator VTN (for cross-reference, NOT a chain hoist) | "Don't confuse" reference | `verlinde-vtn-wire-rope.jpg` |

---

## OEM canonical sources

### Primary

| Resource | URL |
|---|---|
| Eurochain VR product page (current) | https://www.verlinde.com/en/eurochain-vr-the-new-generation-of-verlinde-electric-chain-hoists-for-loads-from-63-to-5-000-kg/ |
| Verlinde Group / Konecranes careers | https://konecranes.careers/verlinde |

### Datasheets / Technical Guides

| Resource | URL |
|---|---|
| Eurochain VR Technical Guide 2016 GB (verlinde.co.za mirror) | https://verlinde.co.za/wp-content/uploads/2020/06/Technical-Guide-EUROCHAIN-VR-GB-2016.pdf |
| Eurochain VR Technical Guide GB (Hoist UK mirror) | https://www.hoistuk.com/wp-content/uploads/VR-Technical-Guide.pdf |
| Eurochain VR Phase 2 EN datasheet (2021) | https://www.verlinde.com/wp-content/uploads/2021/02/EurochainVR_phase2_GB.pdf |
| Eurochain VR FR technical guide | https://www.verlinde.com/wp-content/uploads/2021/02/Technical-guide-Eurochain-VR-FR.pdf |
| Eurochain VL EN catalogue (Scribd) | https://www.scribd.com/document/55316003/Eurochain-VL-GB |
| Eurochain VL FR 8-page brochure (Europont distributor) | https://www.europont.fr/DOCS/EUROCHAIN_VL_8P_FR.pdf |
| Eurochain VL series brochure (Issuu, distributor) | https://issuu.com/fyns-kran/docs/verlinde_eurochain_vl_series |

### Service Manuals

| Resource | URL |
|---|---|
| **VL Operating Manual (37 p, ManualsLib FR)** — best candidate for SOPs and discard limits | https://www.manualslib.fr/manual/489055/Verlinde-Eurochain-Vl-Serie.html |
| Pre-2003 VL2 / VL5 spare parts manual | https://expertcranecomponents.com.au/Information/PDF/VL2-VL5-XC1-Pre-June-2003-Electric-Chain-Hoist-Spare-Parts-Manual.pdf |
| Eurobloc Variator VTN warning + fault codes (ManualsLib) — for cross-reference | https://www.manualslib.com/manual/1952402/Verlinde-Eurobloc-Variator-Vtn.html?page=61 |

---

## Image storage strategy

```
/app/public/images/verlinde/
   nameplate/                # VL + VR + VR Phase 2 + 1Ph
   sprocket/                 # VR intermediate-tooth design
   brake/                    # 2-friction-lining disc
   clutch/                   # external access on VR
   limit-switch/             # 2-step / 4-step
   product-range/            # VL vs VR vs VTN comparison
   trolley/                  # Eurosystem motorised
```

Use `images: ProductImage[]` field on Model.

---

## Diagram priority (after data depth improves)

Once the OEM PDFs are extracted and Verlinde-specific values are populated:

1. **VR sprocket with intermediate teeth** — the headline architectural feature
2. **Suffix decoder** (`VL5 504 B2` → meaning) — variant identification on site
3. **VL legacy vs VR current** — service path differentiation
4. **Brake & clutch separate load paths** — Verlinde-distinctive vs other brands
5. **Konecranes vs CMCO group** — service routing

Until OEM PDF data is in, these would be schematic / architectural diagrams — useful for technician orientation but not for actual measurement reference.

---

## Bottom-line note for HoistRef integration

Verlinde is currently a **partial pack**. To make it field-ready at the depth of the other 5:

1. Retrieve the 3 priority PDFs (VR Technical Guide 2016, VR Phase 2 datasheet, VL Operating Manual)
2. Table-extract:
   - Per-variant motor power (kW)
   - Chain dimensions per variant (current claim is LOW confidence)
   - Chain wear discard limits (Verlinde-specific, NOT Yale)
   - Hook discard rule (Verlinde-specific, NOT Yale, NOT Kito)
   - Brake air gap nominal AND maximum
   - Slip clutch factory % (single number)
   - Operating temperature range
   - Torque table per fastener
   - Daily / 3-monthly / annual specific procedures
   - Welded seam orientation rule (outward or inward — NOT YET CONFIRMED)
3. Populate the manufacturer data file in `app/src/data/manufacturers/verlinde.ts` (does not yet exist; would need scaffolding from existing pattern)
4. Add Verlinde to `app/src/data/manufacturers/index.ts` and `manufacturerMeta`
5. Update [01_measurements.md](01_measurements.md) and [04_sops.md](04_sops.md) with confirmed values

Until that's done, the app should NOT include Verlinde as a brand selection — including a half-populated brand in a safety-critical app is worse than excluding it.
