# v1 → v2 Data Migration Plan

## Principle

Existing `src/data/manufacturers/*.ts` files are **not touched** until peer-verified replacement data is ready. The app continues working off v1 data throughout. Swap-in happens manufacturer by manufacturer when extraction is complete.

## v1 Data Quality Assessment

| Manufacturer | Source | Status | Action |
|---|---|---|---|
| stahl | HTML prototype + web research | Best-quality v1 data; matches commercial docs but unverified against OI | Verify against `stahl-st-oi-unknown-202012` in Phase 2 |
| demag | Research markdown file | Web research, partial; some values marked ⚠ | Verify against `demag-dc-chain-oi-211273-44-202308` |
| yale | Research markdown file | Web research; no OI in library | Cannot fully verify — flag all values as `status: 'web-research'` |
| kito | Research markdown file | Web research; **no manual in library** | Flag all values; source manual before v2 merge |
| gis | Research markdown file | Web research; **no manual in library** | Flag all values; source manual before v2 merge |
| verlinde | Research markdown file | Web research; limited service manual | Partial verify against overhaul instructions |

## Breaking Changes in types.ts

None. All v1 types compile unchanged. New fields are optional.

Changes to `ManufacturerId` union: only additive. Existing string literals retained.

## What Changes When v2 Data Ships

1. `Manufacturer.families[]` gets populated alongside existing `Manufacturer.models[]`
2. UI can detect `families` present and switch to family-grouped navigation
3. `Verified<T>.status` on each value distinguishes web-research from extracted
4. `Verified<T>.source` carries citation for extracted values
5. Display layer surfaces status badges:
   - No status / `web-research` → amber ⚠ "verify against manual"
   - `extracted` → blue "extracted from manual, check pending"
   - `self-verified` → green ✓ "verified"
   - `peer-verified` → green ✓✓ "peer verified"
   - `disputed` → red ✗ "disputed — see note"

## Step-by-step for each manufacturer

1. Read relevant extraction from `peer-verified/`
2. Create new `src/data/manufacturers/{brand}.v2.ts` alongside existing
3. Populate `families[]`, including v2 `Verified<T>` with citations
4. Update `families[]` field on Manufacturer export
5. Keep old `models[]` populated (flattened from families) for v1 compat
6. Run `tsc --noEmit` — must be clean
7. Replace old file, delete `.v2.ts`
8. Verify UI still loads and shows correct data

## Capacity Class Strategy

The existing `capacityKg: number[]` field stays. For v2 models above 2t, additional values are added to the array. For models that span a range (e.g. DC-Pro 5 = 500 kg 2/1 or 1000 kg 1/1), use:

```typescript
capacityKg: [500, 1000],         // all capacities for this model across all variants
capacityRange: { min: 500, max: 1000 },  // for filtering
```

Component sharing does NOT cross capacity classes without explicit manual confirmation. A DC-Pro 1 chain and a DC-Pro 10 chain may look similar — do not assume they share a component. Confirm part numbers match before assigning the same `componentId`.
