import type { ReactNode } from 'react'
import type { Verified } from '@/data/types'
import { VerifyBadge } from './VerifyBadge'

interface SpecRowProps {
  label: string
  value: ReactNode
  unit?: string
  verified?: Verified<unknown>
  critical?: boolean
  note?: string
}

export function SpecRow({ label, value, unit, verified, critical, note }: SpecRowProps) {
  return (
    <div className={`flex justify-between items-baseline gap-3 py-2.5 border-b border-border last:border-0 ${critical ? 'border-l-2 border-l-danger pl-3 -ml-3' : ''}`}>
      <span className="label-mono flex-shrink-0">{label}</span>
      <span className="font-mono text-[13px] font-semibold text-text text-right leading-snug">
        {value}
        {unit && <span className="text-text-dim font-normal ml-1">{unit}</span>}
        {verified?.verify && <VerifyBadge note={verified.note} />}
      </span>
      {note && (
        <span className="text-[11px] text-text-muted w-full block mt-1 col-span-2">{note}</span>
      )}
    </div>
  )
}

interface SpecCardProps {
  title: string
  children: ReactNode
}

export function SpecCard({ title, children }: SpecCardProps) {
  return (
    <div className="bg-bg-elev border border-border rounded-sm mb-4">
      <div className="px-4 pt-3 pb-1">
        <span className="label-mono text-accent">{title}</span>
      </div>
      <div className="px-4 pb-3">
        {children}
      </div>
    </div>
  )
}
