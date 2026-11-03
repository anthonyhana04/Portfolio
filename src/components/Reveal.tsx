import type { ReactNode } from 'react'

/** Fades + lifts its children into place once `show` is true, staggered by `index`. */
export default function Reveal({ show, index = 0, children }: { show: boolean; index?: number; children: ReactNode }) {
  return (
    <div
      className={`transition-all duration-700 ease-out ${show ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
      style={{ transitionDelay: show ? `${index * 90}ms` : '0ms' }}
    >
      {children}
    </div>
  )
}
