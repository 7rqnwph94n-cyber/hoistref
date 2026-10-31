import type { Manufacturer, ManufacturerId } from '@/data/types'
import { stahl } from './stahl'
import { demag } from './demag'
import { yale } from './yale'
import { kito } from './kito'
import { gis } from './gis'
import { verlinde } from './verlinde'
import { kone } from './kone'
import { abus } from './abus'
import { swf } from './swf'

export const manufacturers: Manufacturer[] = [stahl, demag, yale, kito, gis, verlinde, kone, abus, swf]

export const manufacturerMeta: Record<ManufacturerId, { tagline: string; ready: boolean }> = {
  stahl:    { tagline: '125 kg – 6.3 t · ST05–ST60',                ready: true },
  demag:    { tagline: '125 kg – 3.2 t · DC-Pro + DC-Com',           ready: true },
  yale:     { tagline: 'CPV / CPVF · up to 2 t · DAT chain',         ready: true },
  kito:     { tagline: 'ER2 · 125 kg – 5 t · double safety',         ready: true },
  gis:      { tagline: 'GP 250–1000 · profile chain · IP65',         ready: true },
  verlinde: { tagline: 'Eurochain VR/VL · Euroblock VS/VT · 60 kg – 80 t · Konecranes', ready: true },
  kone:     { tagline: 'XN25 · 1.6–7.5 t · heavy industrial',        ready: true },
  abus:     { tagline: 'GM2/GM4/GM6/GM8 · up to 5 t · HEP roller chain', ready: true },
  swf:      { tagline: 'CHAINster CA–CE · 63–5000 kg · Grade 80 · M5', ready: true },
}

export function getManufacturer(id: string): Manufacturer | undefined {
  return manufacturers.find(m => m.id === id)
}
