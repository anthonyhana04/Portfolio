import type { Scene } from '../lib/ascii'
import { bez, bezAngle, clamp, easeOut, lerp, prog, rng, smoothstep, TAU } from '../lib/math'
import type { Bezier, Pt } from '../lib/math'
import { createVines } from './vines'

/**
 * Intro bouquet: stems rise from the bottom of the screen, leaves unfurl,
 * buds swell and then open one after another, while vines (./vines.ts)
 * creep in from the left and right edges. After a short hold the whole
 * thing dissolves glyph-by-glyph to reveal the site underneath.
 */

// Timeline (seconds)
const STEM_DUR = 1.5
const LEAF_DUR = 0.6
const BUD_DUR = 0.5
const OPEN_START = 2.1
const OPEN_GAP = 0.22
const OPEN_DUR = 1.3
const FADE_START = 5.4
const FADE_DUR = 1.1

const WORLD = 1000

type Kind = 'rose' | 'daisy' | 'tulip' | 'sprig'

interface Stem {
  pts: Bezier
  start: number
  width: number
}
interface Leaf {
  stem: Stem
  at: number
  side: 1 | -1
  len: number
  w: number
  spread: number
  start: number
  tint: number
}
interface Flower {
  stem: Stem
  kind: Kind
  color: string
  inner: string
  size: number
  spin: number
  budAt: number
  openAt: number
  rnd: number[]
}

const STEM = '#4f8f3a'
const LEAVES = ['#4f9a3c', '#5fae4a', '#3f7f33']
const PETALS: Record<Exclude<Kind, 'sprig'>, [string, string][]> = {
  rose: [['#ff3d6e', '#c8103e'], ['#ff7eb3', '#e0306f'], ['#ff8a3d', '#e04a12']],
  daisy: [['#fff6e0', '#ffc21a'], ['#b388ff', '#ffc21a'], ['#ffffff', '#ff9f1a']],
  tulip: [['#ff4d6d', '#d00f3a'], ['#ffc933', '#ff7a00'], ['#ff8fc0', '#e8336f']],
}

function buildScene() {
  const r = rng(42)
  const stems: Stem[] = []
  const leaves: Leaf[] = []
  const flowers: Flower[] = []

  // [tip x, tip y, kind]
  const tips: [number, number, Kind][] = [
    [500, 250, 'rose'],
    [385, 310, 'daisy'],
    [625, 300, 'tulip'],
    [290, 430, 'tulip'],
    [715, 420, 'daisy'],
    [445, 430, 'daisy'],
    [565, 410, 'rose'],
    [215, 560, 'sprig'],
    [790, 545, 'sprig'],
    [340, 590, 'rose'],
    [660, 585, 'tulip'],
    [500, 520, 'sprig'],
  ]

  tips.forEach(([tx, ty, kind]) => {
    const bx = 470 + r() * 60
    const stem: Stem = {
      pts: [
        { x: bx, y: WORLD },
        { x: bx + (tx - bx) * 0.15, y: 800 },
        { x: lerp(bx, tx, 0.8), y: ty + 200 },
        { x: tx, y: ty },
      ],
      start: 0.1 + r() * 0.5,
      width: kind === 'sprig' ? 3 : 6,
    }
    stems.push(stem)

    const nLeaves = kind === 'sprig' ? 0 : 1 + Math.floor(r() * 2)
    for (let i = 0; i < nLeaves; i++) {
      const at = 0.5 + (i / nLeaves) * 0.3 + r() * 0.06
      leaves.push({
        stem,
        at,
        side: i % 2 ? 1 : -1,
        len: 60 + r() * 35,
        w: 13 + r() * 6,
        spread: 0.5 + r() * 0.4,
        start: stem.start + at * STEM_DUR,
        tint: Math.floor(r() * LEAVES.length),
      })
    }

    const [color, inner] =
      kind === 'sprig' ? ['#f5f2ea', '#ffffff'] : PETALS[kind][Math.floor(r() * PETALS[kind].length)]
    flowers.push({
      stem,
      kind,
      color,
      inner,
      size: kind === 'sprig' ? 1.15 : 1.1 + r() * 0.4,
      spin: r() * TAU,
      budAt: stem.start + STEM_DUR * 0.9,
      openAt: 0,
      rnd: Array.from({ length: 16 }, r),
    })
  })

  // open in a shuffled order so the bloom ripples across the bunch
  flowers
    .map((f) => ({ f, k: r() }))
    .sort((a, b) => a.k - b.k)
    .forEach(({ f }, rank) => {
      f.openAt = OPEN_START + rank * OPEN_GAP + f.rnd[0] * 0.15
    })

  return { stems, leaves, flowers }
}

// ---------- drawing helpers ----------

let T = 0
/** Gentle breeze: higher points drift further, so the whole bunch bends together. */
function sway(p: Pt): Pt {
  const lift = clamp((WORLD - p.y) / 750, 0, 1)
  return { x: p.x + Math.sin(T * 1.1 + p.y * 0.006) * 9 * lift + Math.sin(T * 0.5 + p.x * 0.004) * 4 * lift, y: p.y }
}

function strokeCurve(g: CanvasRenderingContext2D, pts: Bezier, upTo: number, width: number, color: string) {
  if (upTo <= 0) return
  g.strokeStyle = color
  g.lineWidth = width
  g.lineCap = 'round'
  g.beginPath()
  const steps = 28
  for (let i = 0; i <= steps; i++) {
    const p = sway(bez(pts, (i / steps) * upTo))
    if (i === 0) g.moveTo(p.x, p.y)
    else g.lineTo(p.x, p.y)
  }
  g.stroke()
}

function petal(g: CanvasRenderingContext2D, x: number, y: number, ang: number, len: number, w: number, color: string) {
  if (len <= 0.5) return
  g.fillStyle = color
  g.beginPath()
  g.ellipse(x + Math.cos(ang) * len * 0.5, y + Math.sin(ang) * len * 0.5, len * 0.5, w, ang, 0, TAU)
  g.fill()
}

function circle(g: CanvasRenderingContext2D, x: number, y: number, r: number, color: string) {
  if (r <= 0.3) return
  g.fillStyle = color
  g.beginPath()
  g.arc(x, y, r, 0, TAU)
  g.fill()
}

function drawLeaf(g: CanvasRenderingContext2D, lf: Leaf) {
  const k = easeOut(prog(T, lf.start, LEAF_DUR))
  if (!k) return
  const base = sway(bez(lf.stem.pts, lf.at))
  const ang = bezAngle(lf.stem.pts, lf.at) + Math.PI + lf.side * lf.spread + Math.sin(T * 1.4 + lf.at * 9) * 0.06
  petal(g, base.x, base.y, ang, lf.len * k, lf.w * k, LEAVES[lf.tint])
}

function drawFlower(g: CanvasRenderingContext2D, f: Flower) {
  const bud = easeOut(prog(T, f.budAt, BUD_DUR))
  if (!bud) return
  const open = easeOut(prog(T, f.openAt, OPEN_DUR))
  const tip = sway(f.stem.pts[3])
  const up = bezAngle(f.stem.pts, 1)
  const s = f.size
  const { x, y } = tip

  if (f.kind === 'sprig') {
    // baby's breath: tiny white puffs on short branches
    for (let i = 0; i < 7; i++) {
      const a = up + (i / 6 - 0.5) * 2.2
      const d = (14 + f.rnd[i] * 26) * bud
      const k = easeOut(clamp((open - i * 0.08) / 0.5, 0, 1))
      const px = x + Math.cos(a) * d, py = y + Math.sin(a) * d
      g.strokeStyle = STEM
      g.lineWidth = 2
      g.beginPath()
      g.moveTo(x, y)
      g.lineTo(px, py)
      g.stroke()
      circle(g, px, py, lerp(2, 7, k), k > 0 ? f.color : '#8fbf6a')
    }
    return
  }

  // closed bud: a green teardrop that blushes towards the petal colour before opening
  if (open < 0.15) {
    const blush = smoothstep(f.openAt - 0.6, f.openAt, T)
    const c = blush > 0.5 ? f.color : '#6aa84f'
    petal(g, x, y, up, 34 * s * bud, 11 * s * bud, c)
    if (open <= 0) return
  }

  if (f.kind === 'daisy') {
    const n = 14
    for (let i = 0; i < n; i++) {
      const a = f.spin + (i / n) * TAU + Math.sin(T * 2 + i) * 0.03
      petal(g, x, y, a, lerp(10, 46, open) * s, lerp(3, 8, open) * s, f.color)
    }
    circle(g, x, y, lerp(5, 13, open) * s, f.inner)
    circle(g, x, y, lerp(2, 6, open) * s, '#c97b2a')
  } else if (f.kind === 'rose') {
    // three rings of overlapping round petals, darker towards the centre
    const rings: [number, number, number, string][] = [
      [5, 26, 22, f.color],
      [4, 13, 15, mixHex(f.color, f.inner, 0.5)],
      [3, 5, 8, f.inner],
    ]
    rings.forEach(([n, dist, rad], ri) => {
      const k = easeOut(clamp(open * 1.4 - ri * 0.2, 0, 1))
      for (let i = 0; i < n; i++) {
        const a = f.spin + ri * 0.7 + (i / n) * TAU
        circle(g, x + Math.cos(a) * dist * k * s, y + Math.sin(a) * dist * k * s, lerp(6, rad, k) * s, rings[ri][3])
      }
    })
    circle(g, x, y, 4 * s, f.inner)
  } else {
    // tulip: a cup of three petals that loosens as it opens
    const splay = lerp(0.12, 0.55, open)
    const len = lerp(34, 58, open) * s
    const w = lerp(11, 17, open) * s
    petal(g, x, y, up - splay, len, w, mixHex(f.color, f.inner, 0.4))
    petal(g, x, y, up + splay, len, w, mixHex(f.color, f.inner, 0.4))
    petal(g, x, y, up, len * 1.05, w * 1.05, f.color)
  }
}

function mixHex(a: string, b: string, t: number) {
  const A = parseInt(a.slice(1), 16), B = parseInt(b.slice(1), 16)
  const ch = (s: number) => Math.round(lerp((A >> s) & 255, (B >> s) & 255, t))
  return `rgb(${ch(16)},${ch(8)},${ch(0)})`
}

// ---------- scene ----------

export interface BouquetScene extends Scene {
  /** Jump straight to the dissolve. */
  skip(): void
}

export function createBouquet(handlers: { onFadeStart(): void; onDone(): void }): BouquetScene {
  const S = buildScene()
  const vines = createVines()
  let now = 0
  let fadeAt = FADE_START
  let fadeFired = false
  let doneFired = false

  return {
    skip() {
      if (now < fadeAt) fadeAt = now
    },
    resize(w, h) {
      vines.resize(w, h)
    },
    draw(g, { t, w, h }) {
      now = t
      T = t

      // vines creep in from both edges, behind the bouquet
      vines.draw(g, T)

      // fit the 1000×1000 world to the viewport, anchored to the bottom edge
      const s = Math.min(w / (WORLD * 0.75), h / WORLD) * 0.98
      g.save()
      g.translate((w - WORLD * s) / 2, h - WORLD * s)
      g.scale(s, s)

      for (const st of S.stems) strokeCurve(g, st.pts, easeOut(prog(T, st.start, STEM_DUR)), st.width, STEM)
      for (const lf of S.leaves) drawLeaf(g, lf)
      // flowers that opened later sit on top
      const order = S.flowers.slice().sort((a, b) => a.openAt - b.openAt)
      for (const f of order) drawFlower(g, f)
      g.restore()

      if (t >= fadeAt && !fadeFired) {
        fadeFired = true
        handlers.onFadeStart()
      }
      if (t >= fadeAt + FADE_DUR && !doneFired) {
        doneFired = true
        handlers.onDone()
      }
      return { dissolve: smoothstep(fadeAt, fadeAt + FADE_DUR, t) }
    },
  }
}

export const BLOOM_FADE_DURATION = FADE_DUR
