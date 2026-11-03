import { clamp, easeOut, lerp, prog, rng, smoothstep, TAU } from '../lib/math'
import type { Pt } from '../lib/math'

/**
 * Vines for the intro: they creep in from the left and right edges of the
 * viewport while the bouquet grows. Each side has a trunk climbing the edge
 * from the bottom corner plus a few shorter runners curling inward. Leaves
 * unfurl as the growing tip passes them, tips curl into tendrils, and a few
 * tiny blossoms open alongside the bouquet.
 *
 * Unlike the bouquet this works in screen pixels, so it hugs the real edges.
 */

const LEAF_DUR = 0.5
const BLOOM_DUR = 0.7
const VINE = '#4a8a36'
const LEAVES = ['#4f9a3c', '#5fae4a', '#3f7f33', '#6cbf52']
const BLOSSOMS = ['#ff9fb2', '#f5efe6', '#c3a6ff', '#ffd166', '#ff9f68']

interface VLeaf {
  i: number
  side: 1 | -1
  len: number
  w: number
  spread: number
  tint: number
  start: number
}
interface Blossom {
  i: number
  color: string
  size: number
  spin: number
  openAt: number
}
interface Vine {
  pts: Pt[]
  width: number
  start: number
  dur: number
  phase: number
  leaves: VLeaf[]
  blossoms: Blossom[]
}

/** Time at which a vine that eases out over [start, start+dur] reaches fraction `s` of its length. */
const reachAt = (start: number, dur: number, s: number) => start + dur * (1 - Math.cbrt(1 - s))

/**
 * A meandering path from (x0, y0) along `heading`. The step length shrinks and
 * the turn rate climbs near the end, so the tip winds into a tightening curl.
 */
function walk(r: () => number, x0: number, y0: number, heading: number, len: number, meander: number): Pt[] {
  const n = 90
  const ds = len / n
  const freq = 1.4 + r() * 1.6
  const ph = r() * TAU
  const curlDir = r() < 0.5 ? 1 : -1
  const pts: Pt[] = [{ x: x0, y: y0 }]
  let x = x0, y = y0
  for (let i = 1; i <= n; i++) {
    const s = i / n
    const tail = Math.max(0, (s - 0.78) / 0.22)
    const a = heading + meander * Math.sin(s * freq * Math.PI + ph) + curlDir * 7.5 * tail * tail
    const step = ds * (1 - 0.65 * tail)
    x += Math.cos(a) * step
    y += Math.sin(a) * step
    pts.push({ x, y })
  }
  return pts
}

function buildVines(w: number, h: number): Vine[] {
  const sc = clamp(Math.min(w, h) / 850, 0.55, 1.25)
  const vines: Vine[] = []

  for (const side of [1, -1] as const) {
    const r = rng(side === 1 ? 7 : 19)
    const specs: { x: number; y: number; heading: number; len: number; meander: number; start: number; dur: number; width: number }[] = []

    // trunk: climbs the edge from the bottom corner
    specs.push({ x: 12 * sc, y: h + 20, heading: -Math.PI / 2 + 0.08, len: h * 0.92, meander: 0.22, start: 0, dur: 3.2, width: 10 * sc })

    // runners curling in from the edge, spread over the height
    const n = h > 700 ? 4 : 3
    for (let k = 0; k < n; k++) {
      const y = h * ((k + 0.35 + r() * 0.3) / n)
      const tilt = (r() - 0.5) * 0.7 + (y < h / 2 ? 0.2 : -0.2)
      specs.push({
        x: -12,
        y,
        heading: tilt,
        len: Math.min(w * 0.4, Math.max(w * 0.2, 170 * sc)) * (0.8 + r() * 0.45),
        meander: 0.7 + r() * 0.5,
        start: 0.15 + k * 0.28 + r() * 0.25,
        dur: 2.2 + r() * 0.6,
        width: (7 + r() * 2) * sc,
      })
    }

    for (const sp of specs) {
      let pts = walk(r, sp.x, sp.y, sp.heading, sp.len, sp.meander)
      if (side === -1) pts = pts.map((p) => ({ x: w - p.x, y: p.y }))

      const leaves: VLeaf[] = []
      const gap = 0.08 + r() * 0.03
      let flip: 1 | -1 = r() < 0.5 ? 1 : -1
      for (let s = 0.06 + r() * 0.04; s < 0.8; s += gap * (0.8 + r() * 0.5)) {
        const i = Math.round(s * (pts.length - 1))
        leaves.push({
          i,
          side: flip,
          len: (30 + r() * 22) * sc,
          w: (8 + r() * 4) * sc,
          spread: 0.75 + r() * 0.45,
          tint: Math.floor(r() * LEAVES.length),
          start: reachAt(sp.start, sp.dur, s) + 0.05,
        })
        flip = flip === 1 ? -1 : 1
      }

      const blossoms: Blossom[] = []
      const nb = 1 + Math.floor(r() * 2)
      for (let b = 0; b < nb; b++) {
        const s = 0.25 + r() * 0.5
        blossoms.push({
          i: Math.round(s * (pts.length - 1)),
          color: BLOSSOMS[Math.floor(r() * BLOSSOMS.length)],
          size: (0.8 + r() * 0.5) * sc,
          spin: r() * TAU,
          openAt: Math.max(reachAt(sp.start, sp.dur, s) + 0.4, 2.3 + r() * 1.4),
        })
      }

      vines.push({ pts, width: sp.width, start: sp.start, dur: sp.dur, phase: r() * TAU, leaves, blossoms })
    }
  }
  return vines
}

/** Breeze: the free end of a vine drifts, the end rooted at the edge stays put. */
function swayed(v: Vine, i: number, T: number): Pt {
  const p = v.pts[i]
  const s = i / (v.pts.length - 1)
  const k = 5 * s
  return {
    x: p.x + Math.sin(T * 1.2 + i * 0.09 + v.phase) * k,
    y: p.y + Math.cos(T * 0.9 + i * 0.07 + v.phase) * k,
  }
}

function angleAt(v: Vine, i: number, T: number) {
  const a = swayed(v, Math.max(0, i - 1), T)
  const b = swayed(v, Math.min(v.pts.length - 1, i + 1), T)
  return Math.atan2(b.y - a.y, b.x - a.x)
}

function ellipsePetal(g: CanvasRenderingContext2D, x: number, y: number, ang: number, len: number, w: number, color: string) {
  if (len <= 0.5) return
  g.fillStyle = color
  g.beginPath()
  g.ellipse(x + Math.cos(ang) * len * 0.5, y + Math.sin(ang) * len * 0.5, len * 0.5, w, ang, 0, TAU)
  g.fill()
}

export function createVines() {
  let vines: Vine[] = []

  return {
    resize(w: number, h: number) {
      vines = buildVines(w, h)
    },
    draw(g: CanvasRenderingContext2D, T: number) {
      g.lineCap = 'round'
      g.strokeStyle = VINE
      for (const v of vines) {
        const grown = easeOut(prog(T, v.start, v.dur))
        if (!grown) continue
        const last = Math.floor(grown * (v.pts.length - 1))

        // stem, tapering towards the tip
        let prev = swayed(v, 0, T)
        for (let i = 1; i <= last; i++) {
          const p = swayed(v, i, T)
          g.lineWidth = lerp(v.width, 1.5, i / (v.pts.length - 1))
          g.beginPath()
          g.moveTo(prev.x, prev.y)
          g.lineTo(p.x, p.y)
          g.stroke()
          prev = p
        }

        for (const lf of v.leaves) {
          const k = easeOut(prog(T, lf.start, LEAF_DUR))
          if (!k || lf.i > last) continue
          const base = swayed(v, lf.i, T)
          const ang = angleAt(v, lf.i, T) + lf.side * lf.spread + Math.sin(T * 1.5 + lf.i) * 0.08
          ellipsePetal(g, base.x, base.y, ang, lf.len * k, lf.w * k, LEAVES[lf.tint])
        }

        for (const b of v.blossoms) {
          if (b.i > last) continue
          const k = easeOut(prog(T, b.openAt, BLOOM_DUR))
          const c = swayed(v, b.i, T)
          if (k <= 0) {
            // a small green bud waits on the stem until it's time to open
            const bud = smoothstep(b.openAt - 1.2, b.openAt - 0.2, T)
            if (bud > 0) {
              g.fillStyle = '#7ab85a'
              g.beginPath()
              g.arc(c.x, c.y, 4 * b.size * bud, 0, TAU)
              g.fill()
            }
            continue
          }
          for (let p = 0; p < 5; p++) {
            const a = b.spin + (p / 5) * TAU + T * 0.15
            ellipsePetal(g, c.x, c.y, a, lerp(6, 16, k) * b.size, lerp(3, 6, k) * b.size, b.color)
          }
          g.fillStyle = '#ffd166'
          g.beginPath()
          g.arc(c.x, c.y, lerp(2, 4.5, k) * b.size, 0, TAU)
          g.fill()
        }
      }
    },
  }
}
