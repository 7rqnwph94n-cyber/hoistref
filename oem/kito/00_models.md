# KITO — Model & Variant Matrix

**Manufacturer:** KITO Corporation (Yamanashi 409-3853, Japan; Columbus McKinnon group since 2023)
**Series in scope:** ER2 electric chain hoist
**Capacity range:** 125 kg – 5 t (this pack covers ≤ 2 t)

References:
- [Kito ER2 product page](https://www.kito.net/en/products/er2-electric-chain-hoist/)
- [Kito ER2 Owner's Manual 125 kg – 5 t (OM-ER2ZZZ-CEE-02)](https://kito.net/files/downloads/er2/er2/manuals/en/ER2-Manual-125kg--5t-_-04.pdf)
- [Kito ER2 catalog (ER2CE0805_04)](https://kito.com.br/download/2021/05/12/1dy0g3ml9n_Cat_logo_NO._ER2CE0805_04_.pdf)
- [Kito ER2 inverter manual](https://kito.ca/download/2014/05/17/84p17ky5nd_ER2_Inverter_Manual_rev._0804_MC_02_.pdf)

## Model coding

Format: `ER2-[capacity code][speed suffix][I prefix for inverter]`

| Suffix | Meaning |
|---|---|
| `H` | High speed, single speed |
| `IH` | High speed, dual speed VFD (inverter) |
| `S` | Standard speed, single speed |
| `IS` | Standard speed, dual speed VFD |
| `L` | Low speed, single speed |
| `IL` | Low speed, dual speed VFD |

Body size codes (separate from capacity, encoded in the part number):

| Body | Capacity range |
|---|---|
| ER2-B | 125 kg (ER2-001), 250 kg high-speed (ER2-003H) |
| ER2-C | 250 kg standard (ER2-003S), 500 kg (ER2-005) |
| ER2-D | 1 t (ER2-010) |
| ER2-E | 1.6 t (ER2-016), 2 t (ER2-020), 3.2 t (ER2-032) |
| ER2-F | 2.5 t (ER2-025), 5 t (ER2-050) |

## Models in scope (≤ 2 t)

| Model | Capacity | Body | Chain (d × p) | Chain mark | FEM (single / dual) |
|---|---|---|---|---|---|
| ER2-001 | 125 kg | B | 4.3 × 12.2 | FT-DAT (every 24 links) | M5 / M6 |
| ER2-003 | 250 kg | B (H) / C (S) | 4.3 × 12.2 (H) or 6.0 × 18 (S) | FT-DAT or RH-DAT | M5 / M6 |
| ER2-005 | 500 kg | C | 6.0 × 18 (L) or 7.7 × 21.4 (S) | RH-DAT | M5 / M6 |
| ER2-010 | 1 t | D | 7.7 × 21.4 | RH-DAT (every 20 links) | M5 |
| ER2-016 | 1.6 t | E | 10.2 × 28 | RH-DAT (every 16 links) | M5 |
| ER2-020 | 2 t | E | 10.2 × 28 | RH-DAT (every 16 links) | M4 |

Confidence: HIGH — sourced from Kito ER2 catalog ER2CE0805_04.

## Variants per model

### ER2-001 (125 kg)

| Variant | Speed | Notes |
|---|---|---|
| ER2-001H | 16 m/min single | High-speed |
| ER2-001IH | 24 / 6 m/min dual VFD | Inverter — 5-min capacitor wait |

### ER2-003 (250 kg)

| Variant | Chain | Speed | FEM |
|---|---|---|---|
| ER2-003H | 4.3 mm | 16 m/min | M5 |
| ER2-003IH | 4.3 mm | 24/6 m/min VFD | M6 |
| ER2-003S | 6.0 mm | 8 m/min | M5 |
| ER2-003IS | 6.0 mm | 12/3 m/min VFD | M6 |

### ER2-005 (500 kg)

| Variant | Chain | Speed | FEM |
|---|---|---|---|
| ER2-005L | 6.0 mm | 4 m/min | M5 |
| ER2-005IL | 6.0 mm | 6/1.5 m/min VFD | M6 |
| ER2-005S | 7.7 mm | 8 m/min | M5 |
| ER2-005IS | 7.7 mm | 12/3 m/min VFD | M6 |

### ER2-010 (1 t)

| Variant | Speed | FEM |
|---|---|---|
| ER2-010L | 4 m/min | M5 |
| ER2-010IL | 6/1.5 m/min VFD | M5 |
| ER2-010S | 8 m/min | M5 |
| ER2-010IS | 12/3 m/min VFD | M5 |

### ER2-016 (1.6 t)

| Variant | Speed | FEM |
|---|---|---|
| ER2-016S | 8 m/min | M5 |
| ER2-016IS | 12/3 m/min VFD | M5 |

### ER2-020 (2 t)

| Variant | Speed | FEM |
|---|---|---|
| ER2-020L | 4 m/min | M4 |
| ER2-020IL | 6/1.5 m/min VFD | M4 |
| ER2-020S | 8 m/min | M4 |
| ER2-020IS | 12/3 m/min VFD | M4 |

## Trolley combinations

| Trolley | Combined model | Notes |
|---|---|---|
| TSP (plain push) | ER2SP | Manual push, flange 50–220 mm |
| TSG (geared) | ER2SG | Hand-chain geared traverse |
| MR2 (motorised) | ER2M | Powered, MR2-010S/-020S/-032S/-050S |

MR2 motorised duty cycle (per Kito ER2 catalog):
- Single speed: 30 min ST, **40% ED at 240 rev/h** (20 min / 30% ED for 415V 50Hz)
- Dual speed VFD: 30/10 min, **27%/13% ED**

## Predecessor series (caution)

The ER2 supersedes the older **ER** series and **ES** series. Older units may be on site.

**Critical:** load chains are NOT interchangeable between ER and ER2. Wrong chain on ER2 → not authentic, fails inspection, voids warranty.

## Special variants

- **ER2-IS / IH / IL** (inverter variants) — see VFD handling SOP. Strict 5-min capacitor wait + 30-min thermal cool before maintenance.
- **Friction clutch with mechanical brake** (optional small-cap variants) — adds mechanical fail-safe; downgrades grade by one (M6 → M5 for small-cap hoists).
- **External OLL** (Overload Load Limiter) — bolt-on accessory, adjustable 90–135% of rated, ±8% accuracy, Kito-authorised personnel only.
