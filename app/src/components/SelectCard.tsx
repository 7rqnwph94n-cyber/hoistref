import type { ReactNode } from 'react'

interface SelectCardProps {
  code: string
  range?: string
  detail?: string | ReactNode
  wide?: boolean
  onClick: () => void
  disabled?: boolean
}

export function SelectCard({ code, range, detail, wide, onClick, disabled }: SelectCardProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        bg-bg-elev border border-border rounded-sm p-4 text-left w-full
        active:bg-bg-hi active:border-accent transition-all
        hover:border-border-hi
        disabled:opacity-40 disabled:cursor-not-allowed
        ${wide ? 'col-span-2' : ''}
      `}
    >
      <span className="font-mono text-lg font-semibold text-accent tracking-wide block mb-1.5">
        {code}
      </span>
      {range && (
        <span className="font-mono text-[13px] text-text-dim block mb-1">
          {range}
        </span>
      )}
      {detail && (
        <span className="text-[12px] text-text-muted leading-snug block">
          {detail}
        </span>
      )}
    </button>
  )
}
