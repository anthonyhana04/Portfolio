import { clamp, hash3 } from './math'

/**
 * ASCII renderer.
 *
 * A scene paints ordinary vector shapes (in CSS-pixel coordinates) onto a tiny
 * offscreen canvas that has exactly one pixel per character cell. Every pixel
 * is then redrawn on the visible canvas as a coloured glyph whose density
 * follows the pixel's brightness. Black pixels are left empty.
 */

export interface Frame {
  /** Seconds since the renderer started. */
  t: number
  /** Seconds since the previous frame (clamped, so tab switches don't explode physics). */
  dt: number
  /** Viewport size in CSS pixels. */
  w: number
  h: number
}

export interface Scene {
  resize?(w: number, h: number): void
  draw(g: CanvasRenderingContext2D, f: Frame): void
}

export interface AsciiOptions {
  /** Glyphs from sparse to dense. Index 0 is never drawn. */
  ramp?: string
  fps?: number
  /** Font size in px for a given viewport. */
  fontSize?: (w: number, h: number) => number
  /** Opacity of the blurred colour bloom drawn under the glyphs (0 = off). */
  glow?: number
  /** Solid background colour of the visible canvas. */
  background?: string
  /** How many ramp steps a travelling wave shifts glyphs by (makes motion "shimmer"). */
  ripple?: number
  /** How often (Hz) individual glyphs randomly flicker to a neighbouring character. */
  flicker?: number
}

const DEFAULT_RAMP = ' .:-=+*cxoaX#%&@'

/** Starts rendering `scene` into `canvas`. Returns a cleanup function. */
export function startAscii(canvas: HTMLCanvasElement, scene: Scene, opts: AsciiOptions = {}): () => void {
  const ramp = opts.ramp ?? DEFAULT_RAMP
  const fps = opts.fps ?? 30
  const glow = opts.glow ?? 0.4
  const background = opts.background ?? '#0a0a0a'
  const ripple = opts.ripple ?? 0
  const flicker = opts.flicker ?? 8
  const fontFor = opts.fontSize ?? ((w, h) => clamp(Math.floor(Math.min(w / 100, h / 80)), 6, 12))

  const ctx = canvas.getContext('2d')
  const off = document.createElement('canvas')
  const g = off.getContext('2d', { willReadFrequently: true })
  if (!ctx || !g) return () => {}

  let w = 0, h = 0, cols = 0, rows = 0, cellW = 0, cellH = 0, dpr = 1
  let font = ''

  const styleCache = new Map<number, string>()
  const style = (r: number, gr: number, b: number) => {
    const key = (r << 16) | (gr << 8) | b
    let s = styleCache.get(key)
    if (!s) {
      s = `rgb(${r},${gr},${b})`
      styleCache.set(key, s)
    }
    return s
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2)
    w = window.innerWidth
    h = window.innerHeight
    const fs = fontFor(w, h)
    font = `bold ${fs}px ui-monospace, Menlo, Consolas, "DejaVu Sans Mono", monospace`
    ctx!.font = font
    cellW = ctx!.measureText('M').width || fs * 0.6
    cellH = fs
    canvas.width = Math.floor(w * dpr)
    canvas.height = Math.floor(h * dpr)
    cols = Math.ceil(w / cellW)
    rows = Math.ceil(h / cellH)
    off.width = cols
    off.height = rows
    scene.resize?.(w, h)
  }

  function render(t: number, dt: number) {
    // 1. let the scene paint in CSS pixels; the transform squashes it into cell space
    g!.setTransform(1, 0, 0, 1, 0, 0)
    g!.fillStyle = '#000'
    g!.fillRect(0, 0, cols, rows)
    g!.setTransform(1 / cellW, 0, 0, 1 / cellH, 0, 0)
    scene.draw(g!, { t, dt, w, h })
    const data = g!.getImageData(0, 0, cols, rows).data

    // 2. background + soft colour bloom
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx!.fillStyle = background
    ctx!.fillRect(0, 0, w, h)
    if (glow > 0) {
      ctx!.save()
      ctx!.globalAlpha = glow
      ctx!.globalCompositeOperation = 'lighter'
      ctx!.filter = `blur(${Math.round(cellH * 0.5)}px)`
      ctx!.imageSmoothingEnabled = true
      ctx!.drawImage(off, 0, 0, cols * cellW, rows * cellH)
      ctx!.restore()
    }

    // 3. glyphs
    ctx!.font = font
    ctx!.textBaseline = 'top'
    const n = ramp.length - 1
    const flick = Math.floor(t * flicker)
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const i = (y * cols + x) * 4
        const r = data[i], gr = data[i + 1], b = data[i + 2]
        const m = Math.max(r, gr, b)
        if (m < 14) continue

        const v = m / 255
        const hs = hash3(x, y, flick)
        const jitter = hs % 7 === 0 ? (hs & 8 ? 1 : -1) : 0
        const wave = ripple ? Math.round(Math.sin(x * 0.45 - y * 0.3 + t * 6) * ripple) : 0
        const idx = clamp(Math.round(Math.pow(v, 0.7) * n) + jitter + wave, 1, n)

        // lift dim colours so glyphs stay legible, and quantise to keep the style cache small
        const k = Math.min(1.25, (40 + 215 * v) / m)
        ctx!.fillStyle = style(
          Math.min(255, (r * k) | 0) & 0xf8,
          Math.min(255, (gr * k) | 0) & 0xf8,
          Math.min(255, (b * k) | 0) & 0xf8,
        )
        ctx!.fillText(ramp[idx], x * cellW, y * cellH)
      }
    }
  }

  let raf = 0
  let last = 0
  let prevT = 0
  const start = performance.now()
  const frame = (now: number) => {
    raf = requestAnimationFrame(frame)
    if (now - last < 1000 / fps - 1) return
    last = now
    const t = (now - start) / 1000
    render(t, clamp(t - prevT, 0, 0.1))
    prevT = t
  }

  resize()
  window.addEventListener('resize', resize)
  raf = requestAnimationFrame(frame)

  return () => {
    cancelAnimationFrame(raf)
    window.removeEventListener('resize', resize)
  }
}
