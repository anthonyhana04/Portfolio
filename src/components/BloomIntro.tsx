import { useEffect, useRef, useState } from 'react'
import { startAscii } from '../lib/ascii'
import { BLOOM_FADE_DURATION, createBouquet } from '../scenes/bouquet'

interface Props {
  /** Fired when the bouquet starts dissolving: time to start revealing the page. */
  onReveal(): void
  /** Fired once the intro is fully gone and can be unmounted. */
  onDone(): void
}

/** Full-screen ASCII bouquet that blooms on load, then dissolves into the site. */
export default function BloomIntro({ onReveal, onDone }: Props) {
  const ref = useRef<HTMLCanvasElement>(null)
  const [fading, setFading] = useState(false)
  // keep the latest callbacks without restarting the animation
  const cb = useRef({ onReveal, onDone })
  useEffect(() => {
    cb.current = { onReveal, onDone }
  })

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const scene = createBouquet({
      onFadeStart: () => {
        setFading(true)
        cb.current.onReveal()
      },
      onDone: () => cb.current.onDone(),
    })
    // ?t=3 starts the bloom 3s in (useful for tuning the animation)
    const startAt = Number(new URLSearchParams(window.location.search).get('t')) || 0
    const stop = startAscii(canvas, scene, { glow: 0.52, startAt })

    // any interaction skips straight to the dissolve
    const skip = () => scene.skip()
    const events = ['pointerdown', 'keydown', 'wheel', 'touchmove'] as const
    events.forEach((e) => window.addEventListener(e, skip, { passive: true }))

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      stop()
      events.forEach((e) => window.removeEventListener(e, skip))
      document.body.style.overflow = prevOverflow
    }
  }, [])

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="fixed inset-0 z-50 h-full w-full transition-opacity ease-in"
      style={{ opacity: fading ? 0 : 1, transitionDuration: `${BLOOM_FADE_DURATION}s` }}
    />
  )
}
