import type { Scene } from '../lib/ascii'
import { angleDiff, clamp, lerp, TAU } from '../lib/math'
import type { Pt } from '../lib/math'
import { createDucks, createLilyPads, drawContours } from './pondDecor'

/**
 * Background koi pond. Each fish is a chain of spine points that follows its
 * head (so turns bend the whole body), with a travelling tail-beat wave added
 * on top. Fish wander, keep away from the edges and each other, dart away
 * from the cursor, and scatter when you click near them.
 */

const SEGMENTS = 16

interface Spot {
  at: number // 0 = nose, 1 = tail base
  side: number // -1..1 across the body
  r: number // fraction of body width
}

interface Variety {
  body: string
  spot: string
  spots: Spot[]
}

interface Koi {
  x: number
  y: number
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

interface Ripple {
  x: number
  y: number
  born: number
  strength: number
}

const rand = (a: number, b: number) => a + Math.random() * (b - a)

function randomVariety(): Variety {
  const kind = Math.floor(Math.random() * 4)
  const scatter = (n: number, near = 0): Spot[] =>
    Array.from({ length: n }, () => ({ at: clamp(near + rand(0, 0.75), 0.05, 0.85), side: rand(-0.6, 0.6), r: rand(0.35, 0.65) }))
  switch (kind) {
    case 0: // kohaku: white with red-orange patches
      return { body: '#ece8e0', spot: '#f0582c', spots: scatter(5) }
    case 1: // tancho: white with a single red crown
      return { body: '#efece6', spot: '#e8402c', spots: [{ at: 0.1, side: 0, r: 0.6 }] }
    case 2: // ogon: solid metallic gold
      return { body: '#f2b04b', spot: '#ffd27a', spots: scatter(2) }
    default: // orange with white patches
      return { body: '#ff8a3d', spot: '#f5efe6', spots: scatter(4, 0.1) }
  }
}

function spawn(w: number, h: number): Koi {
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
    variety: randomVariety(),
  }
}

/** Half-width of the body at fraction f along it (0 = nose). */
function bodyWidth(f: number) {
  if (f < 0.22) return 0.62 + 0.38 * Math.sin((f / 0.22) * (Math.PI / 2))
  return 1 - Math.pow((f - 0.22) / 0.78, 1.6) * 0.82
}

export interface KoiScene extends Scene {
  pointer(x: number, y: number): void
  splash(x: number, y: number): void
}

export interface PondOptions {
  speed?: number
  /** Drifting lily pads that koi swim under. */
  lilyPads?: boolean
  /** Topographic contour lines on the pond floor. */
  contours?: boolean
  /** Occasional small raindrop ripples. */
  rain?: boolean
  /** A few small rubber ducks floating on the surface. */
  ducks?: boolean
}

export function createKoiPond(opts: PondOptions = {}): KoiScene {
  const speedScale = opts.speed ?? 1
  const pads = opts.lilyPads ? createLilyPads() : null
  const ducks = opts.ducks ? createDucks() : null
  let nextDrop = 2
  let fish: Koi[] = []
  let ripples: Ripple[] = []
  let W = 0, H = 0, now = 0
  let mouse: Pt | null = null
  let nextSurface = 3

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
      if (o === k) continue
      const dx = k.x - o.x, dy = k.y - o.y
      const d = Math.hypot(dx, dy)
      if (d < k.len * 0.7 && d > 0.01) {
        turn += angleDiff(Math.atan2(dy, dx), k.heading) * (1 - d / (k.len * 0.7)) * 0.8
      }
    }

    // dart away from the cursor
    if (mouse) {
      const dx = k.x - mouse.x, dy = k.y - mouse.y
      const d = Math.hypot(dx, dy)
      if (d < 170) {
        turn += angleDiff(Math.atan2(dy, dx), k.heading) * (1 - d / 170) * 3
        k.fright = Math.max(k.fright, (1 - d / 170) * 0.8)
      }
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

  function fin(g: CanvasRenderingContext2D, x: number, y: number, ang: number, rx: number, ry: number, color: string) {
    g.fillStyle = color
    g.beginPath()
    g.ellipse(x + Math.cos(ang) * rx * 0.8, y + Math.sin(ang) * rx * 0.8, rx, ry, ang, 0, TAU)
    g.fill()
  }

  function drawKoi(g: CanvasRenderingContext2D, k: Koi) {
    const pts = Array.from({ length: SEGMENTS }, (_, i) => bodyPoint(k, i))
    const finColor = 'rgba(235,232,225,0.62)'

    // pectoral + pelvic fins (paddle gently, faster when frightened)
    const paddle = Math.sin(k.phase * 0.5) * 0.35
    for (const [i, size, base] of [[3, 1.1, 1.0], [8, 0.6, 1.2]] as const) {
      const p = pts[i]
      for (const side of [-1, 1]) {
        // angle measured from "pointing backwards", splayed out to each side
        const ang = p.ang + Math.PI - side * (base + paddle)
        const nx = p.x + Math.cos(p.ang + side * Math.PI / 2) * k.width * 0.7
        const ny = p.y + Math.sin(p.ang + side * Math.PI / 2) * k.width * 0.7
        fin(g, nx, ny, ang, k.width * size, k.width * size * 0.38, finColor)
      }
    }

    // tail: two flowing lobes that lag the body wave
    const tail = pts[SEGMENTS - 1]
    const flick = Math.sin(k.phase - 4.6) * 0.45
    for (const side of [-1, 1]) {
      fin(g, tail.x, tail.y, tail.ang + Math.PI + side * 0.42 + flick, k.width * 1.5, k.width * 0.5, finColor)
    }

    // body: overlapping circles along the spine (two per segment for smoothness)
    g.fillStyle = k.variety.body
    for (let i = 0; i < SEGMENTS - 1; i++) {
      for (let h = 0; h < 2; h++) {
        const a = pts[i], b = pts[i + 1]
        const x = lerp(a.x, b.x, h / 2), y = lerp(a.y, b.y, h / 2)
        const r = k.width * bodyWidth((i + h / 2) / (SEGMENTS - 1))
        g.beginPath()
        g.arc(x, y, r, 0, TAU)
        g.fill()
      }
    }

    // markings
    g.fillStyle = k.variety.spot
    for (const s of k.variety.spots) {
      const fi = s.at * (SEGMENTS - 1)
      const i = Math.floor(fi)
      const a = pts[i], b = pts[Math.min(SEGMENTS - 1, i + 1)]
      const x = lerp(a.x, b.x, fi - i), y = lerp(a.y, b.y, fi - i)
      const bw = k.width * bodyWidth(s.at)
      const px = x + Math.cos(a.ang + Math.PI / 2) * s.side * bw * 0.5
      const py = y + Math.sin(a.ang + Math.PI / 2) * s.side * bw * 0.5
      g.beginPath()
      g.arc(px, py, bw * s.r, 0, TAU)
      g.fill()
    }
  }

  /** How much a ripple ring currently passing under (x, y) lifts whatever floats there (0..1). */
  function bob(x: number, y: number) {
    let lift = 0
    for (const r of ripples) {
      const ring = (now - r.born) * 110 * r.strength
      lift = Math.max(lift, Math.max(0, 1 - Math.abs(Math.hypot(x - r.x, y - r.y) - ring) / 40) * r.strength)
    }
    return lift
  }

  function drawRipples(g: CanvasRenderingContext2D) {
    ripples = ripples.filter((r) => now - r.born < 2.4)
    for (const r of ripples) {
      const age = now - r.born
      for (let ring = 0; ring < 3; ring++) {
        const a = age - ring * 0.25
        if (a <= 0) continue
        const alpha = (1 - a / 2.4) * 0.5 * r.strength
        if (alpha <= 0) continue
        g.strokeStyle = `rgba(120,200,255,${alpha})`
        g.lineWidth = 3
        g.beginPath()
        g.arc(r.x, r.y, a * 110 * r.strength, 0, TAU)
        g.stroke()
      }
    }
  }

  return {
    resize(w, h) {
      pads?.resize(w, h)
      ducks?.resize(w, h)
      const first = W === 0
      W = w
      H = h
      const count = w < 640 ? 2 : w < 1200 ? 3 : 4
      if (first) fish = Array.from({ length: count }, () => spawn(w, h))
      else {
        while (fish.length < count) fish.push(spawn(w, h))
        fish.length = Math.min(fish.length, count)
        for (const k of fish) {
          k.x = clamp(k.x, 0, w)
          k.y = clamp(k.y, 0, h)
        }
      }
    },
    pointer(x, y) {
      mouse = { x, y }
    },
    splash(x, y) {
      ripples.push({ x, y, born: now, strength: 1 })
      ducks?.splash(x, y)
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
      if (t > nextSurface && fish.length) {
        const k = fish[Math.floor(Math.random() * fish.length)]
        ripples.push({ x: k.x, y: k.y, born: t, strength: 0.45 })
        nextSurface = t + rand(5, 10)
      }
      // and the odd raindrop
      if (opts.rain && t > nextDrop) {
        ripples.push({ x: rand(0, w), y: rand(0, h), born: t, strength: rand(0.2, 0.35) })
        nextDrop = t + rand(1.5, 4)
      }

      if (opts.contours) drawContours(g, w, h, t)
      drawRipples(g)
      for (const k of fish) drawKoi(g, k)

      if (pads) {
        for (const k of fish) {
          pads.push(k, { x: Math.cos(k.heading) * k.speed, y: Math.sin(k.heading) * k.speed }, k.width, dt)
        }
        pads.step(dt)
        pads.draw(g, bob)
      }

      if (ducks) {
        for (const k of fish) {
          ducks.push(k, { x: Math.cos(k.heading) * k.speed, y: Math.sin(k.heading) * k.speed }, k.width, dt)
        }
        ducks.step(dt, t)
        ducks.draw(g, t, bob)
      }
    },
  }
}
