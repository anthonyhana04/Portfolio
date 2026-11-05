import { useEffect, useRef } from 'react'
import { startAscii } from '../lib/ascii'
import { clamp } from '../lib/math'
import { createKoiPond } from '../scenes/koi'

/** Fixed full-screen ASCII koi pond that sits behind all page content. */
export default function KoiPond() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const pond = createKoiPond(reducedMotion ? 0.35 : 1)
    const stop = startAscii(canvas, pond, {
      ramp: ' .,:;~=+*xoO0#@',
      fps: reducedMotion ? 15 : 30,
      glow: 0.35,
      ripple: 2, // travelling wave that swaps characters as the koi swim through it
      fontSize: (w, h) => clamp(Math.floor(Math.min(w / 115, h / 70)), 7, 12),
    })

    const onMove = (e: PointerEvent) => pond.pointer(e.clientX, e.clientY)
    const onDown = (e: PointerEvent) => {
      // don't splash when clicking real controls
      if ((e.target as HTMLElement).closest('a, button')) return
      pond.splash(e.clientX, e.clientY)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown)
    return () => {
      stop()
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
    }
  }, [])

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full opacity-35"
    />
  )
}
