import type { ReactNode } from 'react'

/** Fades + lifts its children into place on load, staggered by `index`. */
export default function Reveal({ index = 0, children }: { index?: number; children: ReactNode }) {
  return (
    <div className="motion-safe:animate-reveal" style={{ animationDelay: `${index * 90}ms` }}>
      {children}
    </div>
  )
}
