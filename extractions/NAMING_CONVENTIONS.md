# HoistRef v2 — Naming Conventions

## Manual IDs

Format: `{manufacturer}-{family}-{doc-type}-{doc-no}-{yyyymm}`

- `{doc-no}`: Demag docs use the numeric doc number (e.g. `211273-44`). For docs without a number, use `unknown`.
- `{yyyymm}`: Revision date. If only year known, use `{yyyy}00`.

| Manual | ID |
|---|---|
| Demag DC-Pro 1-15 / DC-Com 1-10 OI (211 273 44, Aug 2023) | `demag-dc-chain-oi-211273-44-202308` |
| Demag DC-ProDC/CC/FC / DC-ComDC OI (211 191 44, Aug 2023) | `demag-dc-chain-oi-211191-44-202308` |
| Demag DC-Pro 16-25 Technical Data | `demag-dc-chain-td-unknown-202300` |
| Demag DBC Technical Data (20383344, Sep 2023) | `demag-dbc-td-20383344-202309` |
| Demag DBC Operating Instructions (21387944, May 2023) | `demag-dbc-oi-21387944-202305` |
| Demag DC Friction Force Checking (20697444, 2005) | `demag-dc-chain-proc-20697444-200500` |
| Stahl ST OI (unknown doc no, Dec 2020) | `stahl-st-oi-unknown-202012` |
| Stahl ST Product Information (Jul 2018, Rev Sep 2019) | `stahl-st-pi-unknown-201909` |
| Verlinde VL General Overhaul Instructions (2017) | `verlinde-vl-svc-unknown-201700` |
| Verlinde Eurochain VL brochure (2008) | `verlinde-vl-pi-unknown-200800` |

---

## Manufacturer Family IDs

Format: `{manufacturer}-{family-code}`

| Family | ID |
|---|---|
| Demag DC-Pro, DC-Com, DC-ProDC/CC/FC (all DC chain hoists) | `demag-dc-chain` |
| Demag DBC (Basic Chain Hoist) | `demag-dbc` |
| Demag DK chain hoist (legacy) | `demag-dk` |
| Demag PK chain hoist (legacy) | `demag-pk` |
| Stahl ST chain hoist | `stahl-st` |
| Stahl T4 (legacy) | `stahl-t4` |
| Stahl T5 (legacy) | `stahl-t5` |
| Verlinde Eurochain VL | `verlinde-vl` |

---

## Model IDs

Format: `{manufacturer}-{family-code}-{size-designator}`

Size designator = manufacturer's size number (not capacity). Use whatever the manufacturer uses as the primary distinguishing identifier in the model code.

| Model | ID |
|---|---|
| Demag DC-Pro 1 (125/250 kg) | `demag-dc-pro-1` |
| Demag DC-Pro 2 (250/500 kg) | `demag-dc-pro-2` |
| Demag DC-Pro 5 (500/1000 kg) | `demag-dc-pro-5` |
| Demag DC-Pro 10 (1000/2000 kg) | `demag-dc-pro-10` |
| Demag DC-Pro 15 (1500/3000 kg) | `demag-dc-pro-15` |
| Demag DC-Pro 16 (1600/3200 kg) | `demag-dc-pro-16` |
| Demag DC-Pro 20 (2000/4000 kg) | `demag-dc-pro-20` |
| Demag DC-Pro 25 (2500/5000 kg) | `demag-dc-pro-25` |
| Demag DC-Com 1 | `demag-dc-com-1` |
| Demag DC-Com 2 | `demag-dc-com-2` |
| Demag DC-Com 5 | `demag-dc-com-5` |
| Demag DC-Com 10 | `demag-dc-com-10` |
| Demag DBC 1 | `demag-dbc-1` |
| Demag DBC 2 | `demag-dbc-2` |
| Stahl ST05 | `stahl-st05` |
| Stahl ST10 | `stahl-st10` |
| Stahl ST20 | `stahl-st20` |
| Stahl ST30 | `stahl-st30` |
| Stahl ST32 | `stahl-st32` |
| Stahl ST50 | `stahl-st50` |
| Stahl ST60 | `stahl-st60` |
| Verlinde VL02 | `verlinde-vl02` |
| Verlinde VL05 | `verlinde-vl05` |
| Verlinde VL10 | `verlinde-vl10` |
| Verlinde VL20 | `verlinde-vl20` |

---

## Component IDs

Format: `{manufacturer}-{kind}-{spec-distinguisher}`

Spec distinguisher should capture the key dimension that differentiates the component, using the actual spec value so IDs are self-documenting.

**Chain:**
`{manufacturer}-chain-{diameter}x{pitch}[-{grade}]`

| Component | ID |
|---|---|
| Demag 4.2×12.2 mm round-link chain (DC-Pro 1/2, DC-Com 1) | `demag-chain-4.2x12.2` |
| Demag 5.3×15.2 mm round-link chain (DC-Pro 5, DC-Com 2/5) | `demag-chain-5.3x15.2` |
| Demag 7.4×21.2 mm (DC-Pro 10, DC-Com 10) | `demag-chain-7.4x21.2` |
| Demag 8.7×24.2 mm (DC-Pro 15/16) | `demag-chain-8.7x24.2` |
| Stahl 4×12 mm (ST05 1/1) | `stahl-chain-4x12` |
| Verlinde 6.3×19.05 mm | `verlinde-chain-6.3x19.05` |

> **Note (2026-05-10):** Previous IDs `demag-chain-4x12.2`, `demag-chain-5x15.1`, and
> `demag-chain-6.3x19.1` were based on web research and do not match the manual.
> The 5×15.1 and 6.3×19.1 values appear to be Verlinde chain dimensions that were
> conflated with DEMAG during web research. Corrected from Tab. 59 (p.86) of
> `demag-dc-chain-oi-211273-44-202308`. Any existing app data referencing old IDs
> must be updated — see Delta 1 in that extraction's `notes.md`.

**Cross-manufacturer component sharing is prohibited.** A `demag-chain-4x12.2` and a `kito-chain-4x12.2` are not the same component, even if the geometry appears identical. Manufacturers use different heat treatment, DAT designation, OEM sourcing, and authenticity marking. Cross-manufacturer chain substitution voids conformity and may void CE marking. Never assign matching component IDs across manufacturer boundaries. Component sharing is only recognised within the same manufacturer, confirmed by matching part numbers or an explicit shared-spec table in the same manual.

**Brake:**
`{manufacturer}-brake-{models}-{type}`

| Component | ID |
|---|---|
| Demag BK03 spring-applied disc brake (DC-Pro/Com 1/2/5) | `demag-brake-dc1-5-bk03` |
| Demag BK07 spring-applied disc brake (DC-Pro/Com 10/15) | `demag-brake-dc10-15-bk07` |

**Clutch:**
`{manufacturer}-clutch-{models}-{type}`

| Component | ID |
|---|---|
| Demag DC slip clutch (all DC-Pro and DC-Com models) | `demag-clutch-dc-slip` |

---

## Variant IDs

Format: `{model-id}-{capacity-kg}-{reeving}-{speed-class}`

| Variant | ID |
|---|---|
| DC-Pro 5, 1000 kg, 1/1, dual-speed | `demag-dc-pro-5-1000-1f-ds` |
| DC-Pro 5, 500 kg, 2/1, dual-speed | `demag-dc-pro-5-500-2f-ds` |
| ST10, 1000 kg, 1/1, standard | `stahl-st10-1000-1f-std` |

Speed class codes: `std` = single-speed, `ds` = dual-speed, `vfd` = variable (VFD), `low` = low-speed.

---

## Capacity Classes

Capacity class affects what component-sharing assumptions are reasonable. Use these as mental groupings during extraction — not as data fields.

| Class | Range | Notes |
|---|---|---|
| Micro | ≤ 250 kg | Often single-phase, minimal clutch, smallest chain |
| Light | 250–1000 kg | Standard 1/1 reeving models, most common in UK field service |
| Medium | 1000–3200 kg | Dual reeving common, chain size step-up |
| Heavy | 3200–10000 kg | Architecture may differ significantly — verify everything independently |
| Ultra | > 10000 kg | Unlikely to share any components with light class — treat as fresh extraction |

---

## Extraction Directory Structure

```
extractions/
├── _queue/                          ← awaiting Rich's verification
│   └── {manual-id}/
│       ├── extraction.md            ← human-readable extraction with context
│       ├── components.json          ← shared component specs
│       ├── models.json              ← model definitions
│       ├── verification.csv         ← one row per data point: value, source, instruction
│       ├── diagrams.md              ← diagrams to crop, with page refs
│       └── notes.md                 ← ambiguities, gaps, flagged items
├── self-verified/                   ← Rich confirmed
├── peer-verified/                   ← second engineer confirmed
└── superseded/                      ← old extractions kept for audit
```

Only peer-verified data from `peer-verified/` is merged into `src/data/`.
