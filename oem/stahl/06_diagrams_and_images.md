# STAHL — Diagrams & Image Roadmap

What's already built into the app, what's needed, and where to source it.

---

## Already implemented (React SVG, data-driven)

These render with current variant values from the data layer. Source: `app/src/components/diagrams/`. Originally adapted from Rich's prototype `reffiles/hoistref.html`.

| Diagram | Component | Used in tab | Notes |
|---|---|---|---|
| Hook profile (load + suspension) | `HookDiagram` | Hooks | Shows h/z dimensions for actual reeving; 2/1 row appears when present |
| Chain 11-link strip | `ChainDiagram` | Chain | d, t, 11·t with limits from variant chain spec |
| Chain weld orientation over sprocket | `ChainWeldsDiagram` | Chain | STAHL = OUTWARD (correct path) |
| Brake — shim method (ST05) | `BrakeDiagram variant="shim"` | Brake | Sectional view with shim stack + S dimension |
| Brake — air gap (ST10–ST60) | `BrakeDiagram variant="air-gap"` | Brake | Feeler gauge through plug hole |
| Clutch — locking-plate (ST05) | `ClutchDiagram variant="locking-plate"` | Clutch | Bend-back plate + adjusting nut |
| Clutch — cover-screw (ST10/20/30) | `ClutchDiagram variant="cover-screw"` | Clutch | Adjusting screw under removable cover |
| Clutch — clamping-screw (ST32/50/60) | `ClutchDiagram variant="clamping-screw"` | Clutch | Clamping screw + adjusting nut |
| Trolley wheel cross-section | `TrolleyWheelDiagram` | Trolley | d / b dimensions, replacement table for Ø50–125 |
| Chain stopper + free chain X | `ChainStopperDiagram` | Chain | Per-model X minimum |

All diagrams are React SVG — themed for the dark UI, no external image dependencies.

---

## Diagrams to add (next iteration)

| Diagram | Use case | Suggested file | Notes |
|---|---|---|---|
| **Suspension bolt geometry** | Annual inspection — show the wear-critical region | `SuspensionBoltDiagram.tsx` | Side view with wear callouts (no turn-and-refit rule) |
| **Hook block exploded view (1/1 vs 2/1)** | Reeving verification | `HookBlockDiagram.tsx` | Two side-by-side blocks showing the geometry difference |
| **STAHL Cradle Mark detail** | Chain authenticity check | `CradleMarkDiagram.tsx` | Magnified link with mark callout |
| **Pendant strain wire installation** | Daily inspection | `PendantStrainDiagram.tsx` | Pendant + strain wire + cable showing correct dressing |
| **Limit switch cam mechanism** | Limit setup / re-set | `LimitCamDiagram.tsx` | Cam wheel + micro-switch + chain feed |

These would all be SVG, drawn from the STAHL ST manual figures.

---

## Photographs to source (technician imagery)

Manufacturer hero photos are © STAHL — link out to the manufacturer page rather than embed. For the in-app technician imagery, **Rich's own field photographs are preferable** to OEM marketing imagery.

| Photo | Use case | Suggested filename | Where used in app |
|---|---|---|---|
| Hoist nameplate (worked example) | Variant identification | `stahl-st-nameplate-example.jpg` | Variant picker — "How to read the nameplate" hint |
| Chain authenticity — Cradle Mark close-up | Chain inspection SOP | `stahl-cradle-mark.jpg` | Chain tab — authenticity row |
| Chain wear — gauge in use | SOP 4 procedure | `stahl-chain-gauge-14-320.jpg` | SOP 4 detail page |
| Hook throat measurement with calliper | SOP 6 procedure | `stahl-hook-h-measurement.jpg` | SOP 6 detail page |
| Hook section measurement | SOP 6 procedure | `stahl-hook-z-measurement.jpg` | SOP 6 detail page |
| Brake fan cover removed (ST05) | SOP 2 procedure | `stahl-st05-brake-cover-removed.jpg` | SOP 2 detail page |
| ST05 shim stack visible | SOP 2 procedure | `stahl-st05-shims-detail.jpg` | SOP 2 detail page |
| Feeler gauge in plug hole (ST10+) | SOP 3 procedure | `stahl-air-gap-feeler.jpg` | SOP 3 detail page |
| Combined brake/clutch unit (ST05 part 32 320 90 30 0) | SOP 2 / part identification | `stahl-st05-combined-unit.jpg` | SOP 2 detail page |
| Clutch locking plate (ST05) — bent back | SOP 8 procedure | `stahl-st05-locking-plate.jpg` | SOP 8 detail page |
| Clutch cover removed (ST10–30) showing oil bath | SOP 9 procedure | `stahl-st10-30-cover-removed.jpg` | SOP 9 detail page |
| Drain plug with magnetic tip + debris | SOP 12 procedure | `stahl-magnetic-plug.jpg` | SOP 12 detail page |
| Trolley wheel — measurement at unworn reference | SOP 13 procedure | `stahl-trolley-wheel-measure.jpg` | SOP 13 detail page |
| Trolley wheel — uneven flange wear example | Diagnostic | `stahl-trolley-canting.jpg` | SOP 13 / fault diagnosis |

**Photo licensing:** Rich's own photos = free use. Avoid embedding manufacturer marketing imagery without explicit licensing.

---

## OEM canonical image sources (link, do not embed)

For users who want to see the manufacturer's own product photography, the variant picker links to:

| Resource | URL |
|---|---|
| STAHL ST product page (hero photo + range overview) | https://www.stahlcranes.com/en/products/chain-hoists/st-chain-hoist.html |
| STAHL ST brochure 2107 (figures + photos) | https://www.stahlcranes.com/fileadmin/user_upload/Dokumente/Drucke/Broschueren/br_kz_st_en_2107_web.pdf |
| STAHL ST Series Operating & Maintenance Instructions (figures) | https://www.manualslib.com/manual/1903515/Stahl-St-Series.html |
| STAHL ST50 Operating & Installation Instructions (figures) | https://www.manualslib.com/manual/1884854/Stahl-St50.html |

Already wired into the app via `model.references[]` — see [02_components.md](02_components.md) for context.

---

## Image storage strategy

When Rich adds field photographs:

```
/app/public/images/stahl/
   nameplate/
     stahl-st-nameplate-example.jpg
   chain/
     stahl-cradle-mark.jpg
     stahl-chain-gauge-14-320.jpg
   hooks/
     stahl-hook-h-measurement.jpg
     stahl-hook-z-measurement.jpg
   brake/
     stahl-st05-brake-cover-removed.jpg
     stahl-st05-shims-detail.jpg
     stahl-air-gap-feeler.jpg
   clutch/
     stahl-st05-locking-plate.jpg
     stahl-st10-30-cover-removed.jpg
   gearbox/
     stahl-magnetic-plug.jpg
   trolley/
     stahl-trolley-wheel-measure.jpg
     stahl-trolley-canting.jpg
```

Reference in data files via the `images: ProductImage[]` field on Model (already in types.ts):

```ts
images: [
  { url: '/images/stahl/chain/stahl-cradle-mark.jpg',
    caption: 'Cradle Mark on each chain link — authenticity check',
    attribution: 'Photo: Rich Brotherton, field reference',
    kind: 'chain-mark' },
]
```

PWA precache will cover all of `app/public/` automatically — images are available offline.
