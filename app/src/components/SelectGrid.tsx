import type { ReactNode } from 'react'

interface SelectGridProps {
  children: ReactNode
}

export function SelectGrid({ children }: SelectGridProps) {
  return (
    <div className="grid grid-cols-2 gap-2.5 max-[380px]:grid-cols-1">
      {children}
    </div>
  )
}
