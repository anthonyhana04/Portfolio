import type { Scene } from '../lib/ascii'
import { angleDiff, clamp, lerp, TAU } from '../lib/math'
import type { Pt } from '../lib/math'
import { drawContours } from './contours'

/**
 * Background koi pond. Each fish is a chain of spine points that follows its
 * head (so turns bend the whole body), with a travelling tail-beat wave added
 * on top. Fish wander, keep away from the edges and each other, dart away
 * from the cursor, and scatter when you click near them.
 */

const SEGMENTS = 16
const RIM_WIDTH = 9
const DOT_AT = 0.3 // where the yin-yang dot sits along the body (0 = nose, 1 = tail base)

interface Variety {
  body: string
  dot: string
  fin: string
  /** Outline drawn around the body. */
  rim?: string
}

interface Koi extends Pt {
  heading: number
  speed: number
  cruise: number
  len: number
  width: number
  seg: number
  spine: Pt[]
  phase: number
  seed: number
  fright: number
  variety: Variety
}

interface Ripple extends Pt {
  born: number
  strength: number
}

const rand = (a: number, b: number) => a + Math.random() * (b - a)

// Yin and yang: each fish carries a single dot of the other's colour. The ASCII
// renderer leaves black pixels empty, so the black koi needs a rim to be seen
// against the dark page.
const WHITE_KOI: Variety = { body: '#ece8e0', dot: '#000000', fin: 'rgba(235,232,225,0.62)' }
const BLACK_KOI: Variety = { body: '#000000', dot: '#ece8e0', fin: 'rgba(150,150,150,0.7)', rim: '#a8a8a8' }

function spawn(w: number, h: number, variety: Variety): Koi {
  const len = clamp(Math.min(w, h) * 0.3, 150, 300) * rand(0.8, 1.1)
  const heading = rand(0, TAU)
  const x = rand(w * 0.15, w * 0.85)
  const y = rand(h * 0.15, h * 0.85)
  const seg = len / SEGMENTS
  const spine = Array.from({ length: SEGMENTS }, (_, i) => ({
    x: x - Math.cos(heading) * seg * i,
    y: y - Math.sin(heading) * seg * i,
  }))
  const cruise = rand(28, 44)
  return {
    x, y, heading, len, seg, spine, cruise,
    speed: cruise,
    width: len * 0.13,
    phase: rand(0, TAU),
    seed: rand(0, 100),
    fright: 0,
    variety,
  }
}

/** Half-width of the body at fraction f along it (0 = nose). */
function bodyWidth(f: number) {
  if (f < 0.22) return 0.62 + 0.38 * Math.sin((f / 0.22) * (Math.PI / 2))
  return 1 - Math.pow((f - 0.22) / 0.78, 1.6) * 0.82
}

/** 1 when p is right on top of k, falling to 0 at `radius` and beyond. */
const closeness = (k: Koi, p: Pt, radius: number) => Math.max(0, 1 - Math.hypot(k.x - p.x, k.y - p.y) / radius)

/** The turn that would point k directly away from p. */
const turnAway = (k: Koi, p: Pt) => angleDiff(Math.atan2(k.y - p.y, k.x - p.x), k.heading)

/** Spine point i with the swimming undulation applied, plus the local direction. */
function bodyPoint(k: Koi, i: number) {
  const a = k.spine[Math.max(0, i - 1)]
  const b = k.spine[Math.min(SEGMENTS - 1, i + 1)]
  const ang = Math.atan2(a.y - b.y, a.x - b.x)
  const f = i / (SEGMENTS - 1)
  const amp = k.width * 0.55 * Math.pow(f, 1.6) * (1 + k.fright * 0.6)
  const off = Math.sin(k.phase - f * 4.2) * amp
  const p = k.spine[i]
  return { x: p.x - Math.sin(ang) * off, y: p.y + Math.cos(ang) * off, ang }
}

function fin(g: CanvasRenderingContext2D, x: number, y: number, ang: number, rx: number, ry: number) {
  g.beginPath()
  g.ellipse(x + Math.cos(ang) * rx * 0.8, y + Math.sin(ang) * rx * 0.8, rx, ry, ang, 0, TAU)
  g.fill()
}

function drawKoi(g: CanvasRenderingContext2D, k: Koi) {
  const pts = Array.from({ length: SEGMENTS }, (_, i) => bodyPoint(k, i))

  // pectoral + pelvic fins (paddle gently, faster when frightened)
  g.fillStyle = k.variety.fin
  const paddle = Math.sin(k.phase * 0.5) * 0.35
  for (const [i, size, base] of [[3, 1.1, 1.0], [8, 0.6, 1.2]] as const) {
    const p = pts[i]
    for (const side of [-1, 1]) {
      // angle measured from "pointing backwards", splayed out to each side
      const ang = p.ang + Math.PI - side * (base + paddle)
      const nx = p.x + Math.cos(p.ang + side * Math.PI / 2) * k.width * 0.7
      const ny = p.y + Math.sin(p.ang + side * Math.PI / 2) * k.width * 0.7
      fin(g, nx, ny, ang, k.width * size, k.width * size * 0.38)
    }
  }

  // tail: two flowing lobes that lag the body wave
  const tail = pts[SEGMENTS - 1]
  const flick = Math.sin(k.phase - 4.6) * 0.45
  for (const side of [-1, 1]) {
    fin(g, tail.x, tail.y, tail.ang + Math.PI + side * 0.42 + flick, k.width * 1.5, k.width * 0.5)
  }

  /** A filled circle on the spine, at fraction f along the body. */
  const disc = (f: number, r: number) => {
    const at = f * (SEGMENTS - 1)
    const i = Math.floor(at)
    const a = pts[i], b = pts[i + 1]
    g.beginPath()
    g.arc(lerp(a.x, b.x, at - i), lerp(a.y, b.y, at - i), r, 0, TAU)
    g.fill()
  }

  // body: overlapping discs along the spine (two per segment for smoothness)
  const fillBody = (color: string, grow: number) => {
    const count = (SEGMENTS - 1) * 2
    g.fillStyle = color
    for (let s = 0; s < count; s++) disc(s / count, k.width * bodyWidth(s / count) + grow)
  }
  if (k.variety.rim) fillBody(k.variety.rim, RIM_WIDTH)
  fillBody(k.variety.body, 0)

  g.fillStyle = k.variety.dot
  disc(DOT_AT, k.width * bodyWidth(DOT_AT) * 0.5)
}

interface KoiScene extends Scene {
  pointer(x: number, y: number): void
  splash(x: number, y: number): void
}

export function createKoiPond(speedScale: number): KoiScene {
  let fish: Koi[] = []
  let ripples: Ripple[] = []
  let W = 0, H = 0, now = 0
  let mouse: Pt | null = null
  let nextSurface = 3
  let nextDrop = 2

  function step(k: Koi, dt: number, t: number) {
    // smooth wander made from two slow sines, unique per fish
    let turn = (Math.sin(t * 0.31 + k.seed) * 0.6 + Math.sin(t * 0.13 + k.seed * 2.3) * 0.4) * 0.55

    // keep within the pond: steer back towards the middle near the edges
    const margin = Math.min(W, H) * 0.18
    const edgeDist = Math.min(k.x, W - k.x, k.y, H - k.y)
    if (edgeDist < margin) {
      const toCentre = Math.atan2(H / 2 - k.y, W / 2 - k.x)
      turn += angleDiff(toCentre, k.heading) * (1 - edgeDist / margin) * 2.2
    }

    // personal space
    for (const o of fish) {
      if (o !== k) turn += turnAway(k, o) * closeness(k, o, k.len * 0.7) * 0.8
    }

    // dart away from the cursor
    if (mouse) {
      const near = closeness(k, mouse, 170)
      turn += turnAway(k, mouse) * near * 3
      k.fright = Math.max(k.fright, near * 0.8)
    }

    k.fright = Math.max(0, k.fright - dt * 0.6)
    const target = k.cruise * (1 + k.fright * 3) * speedScale
    k.speed = lerp(k.speed, target, clamp(dt * 2, 0, 1))
    k.heading += clamp(turn, -2.5, 2.5) * dt * (0.6 + k.fright)
    k.x += Math.cos(k.heading) * k.speed * dt
    k.y += Math.sin(k.heading) * k.speed * dt
    k.phase += dt * (2.4 + (k.speed / k.cruise) * 2.6)

    // spine follows the head like a chain
    k.spine[0] = { x: k.x, y: k.y }
    for (let i = 1; i < SEGMENTS; i++) {
      const a = k.spine[i - 1], b = k.spine[i]
      const dx = b.x - a.x, dy = b.y - a.y
      const d = Math.hypot(dx, dy) || 1
      k.spine[i] = { x: a.x + (dx / d) * k.seg, y: a.y + (dy / d) * k.seg }
    }
  }

  function drawRipples(g: CanvasRenderingContext2D) {
    ripples = ripples.filter((r) => now - r.born < 2.4)
    for (const r of ripples) {
      const age = now - r.born
      for (let ring = 0; ring < 3; ring++) {
        const a = age - ring * 0.25
        if (a <= 0) continue
        g.strokeStyle = `rgba(120,200,255,${(1 - a / 2.4) * 0.5 * r.strength})`
        g.lineWidth = 3
        g.beginPath()
        g.arc(r.x, r.y, a * 110 * r.strength, 0, TAU)
        g.stroke()
      }
    }
  }

  return {
    resize(w, h) {
      W = w
      H = h
      if (!fish.length) fish = [spawn(w, h, WHITE_KOI), spawn(w, h, BLACK_KOI)]
      for (const k of fish) {
        k.x = clamp(k.x, 0, w)
        k.y = clamp(k.y, 0, h)
      }
    },
    pointer(x, y) {
      mouse = { x, y }
    },
    splash(x, y) {
      ripples.push({ x, y, born: now, strength: 1 })
      for (const k of fish) {
        const d = Math.hypot(k.x - x, k.y - y)
        if (d < 320) {
          k.fright = 1
          k.heading = Math.atan2(k.y - y, k.x - x) + rand(-0.3, 0.3)
        }
      }
    },
    draw(g, { t, dt, w, h }) {
      now = t
      for (const k of fish) step(k, dt, t)

      // now and then a fish nudges the surface
      if (t > nextSurface) {
        const k = fish[Math.floor(Math.random() * fish.length)]
        ripples.push({ x: k.x, y: k.y, born: t, strength: 0.45 })
        nextSurface = t + rand(5, 10)
      }
      // and the odd raindrop
      if (t > nextDrop) {
        ripples.push({ x: rand(0, w), y: rand(0, h), born: t, strength: rand(0.2, 0.35) })
        nextDrop = t + rand(1.5, 4)
      }

      drawContours(g, w, h, t)
      drawRipples(g)
      for (const k of fish) drawKoi(g, k)
    },
  }
}
