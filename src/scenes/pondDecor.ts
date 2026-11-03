import { clamp, hash3, lerp, TAU } from '../lib/math'
import type { Pt } from '../lib/math'

/**
 * Optional pond decorations, kept separate from the koi so they're easy to
 * switch off (see the flags in components/KoiPond.tsx) or delete outright.
 */

// ---------------------------------------------------------------------------
// Contour lines: marching squares over a slowly drifting noise field, so the
// background reads like a topographic map of the pond floor.
// ---------------------------------------------------------------------------

function valueNoise(x: number, y: number) {
  const xi = Math.floor(x), yi = Math.floor(y)
  const xf = x - xi, yf = y - yi
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf)
  const h = (a: number, b: number) => (hash3(a, b, 1) % 10000) / 5000 - 1
  return lerp(lerp(h(xi, yi), h(xi + 1, yi), u), lerp(h(xi, yi + 1), h(xi + 1, yi + 1), u), v)
}

const field = (x: number, y: number, t: number) =>
  valueNoise(x / 460 + t * 0.012, y / 460 + 3.1) * 0.62 +
  valueNoise(x / 200 - t * 0.018, y / 200 + 7.3) * 0.28 +
  valueNoise(x / 95 + 11.7, y / 95 + t * 0.025) * 0.1

// edges: 0 top, 1 right, 2 bottom, 3 left. Pairs of edges each case connects.
const CASES: number[][] = [
  [], [3, 2], [2, 1], [3, 1], [0, 1], [0, 3, 2, 1], [0, 2], [0, 3],
  [0, 3], [0, 2], [0, 1, 3, 2], [0, 1], [3, 1], [2, 1], [3, 2], [],
]

const STEP = 22
const LEVELS = Array.from({ length: 13 }, (_, i) => -0.6 + i * 0.1)

export function drawContours(g: CanvasRenderingContext2D, w: number, h: number, t: number) {
  const cols = Math.ceil(w / STEP) + 1
  const rows = Math.ceil(h / STEP) + 1
  const f = new Float32Array(cols * rows)
  for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) f[y * cols + x] = field(x * STEP, y * STEP, t)

  g.lineCap = 'round'
  LEVELS.forEach((L, li) => {
    const major = li % 4 === 0
    g.strokeStyle = major ? 'rgba(110,170,200,0.55)' : 'rgba(80,130,160,0.32)'
    g.lineWidth = major ? 6 : 4.5
    g.beginPath()
    for (let y = 0; y < rows - 1; y++) {
      for (let x = 0; x < cols - 1; x++) {
        const a = f[y * cols + x], b = f[y * cols + x + 1]
        const c = f[(y + 1) * cols + x + 1], d = f[(y + 1) * cols + x]
        const idx = (a > L ? 8 : 0) | (b > L ? 4 : 0) | (c > L ? 2 : 0) | (d > L ? 1 : 0)
        const segs = CASES[idx]
        if (!segs.length) continue
        const x0 = x * STEP, y0 = y * STEP
        const edge = (e: number): Pt => {
          switch (e) {
            case 0: return { x: x0 + STEP * ((L - a) / (b - a)), y: y0 }
            case 1: return { x: x0 + STEP, y: y0 + STEP * ((L - b) / (c - b)) }
            case 2: return { x: x0 + STEP * ((L - d) / (c - d)), y: y0 + STEP }
            default: return { x: x0, y: y0 + STEP * ((L - a) / (d - a)) }
          }
        }
        for (let s = 0; s < segs.length; s += 2) {
          const p = edge(segs[s]), q = edge(segs[s + 1])
          g.moveTo(p.x, p.y)
          g.lineTo(q.x, q.y)
        }
      }
    }
    g.stroke()
  })
}

// ---------------------------------------------------------------------------
// Lily pads: drift and spin slowly, bob when a ripple rolls under them, and
// get shouldered aside by koi swimming beneath.
// ---------------------------------------------------------------------------

interface Pad {
  x: number
  y: number
  r: number
  rot: number
  spin: number
  vx: number
  vy: number
  color: string
  vein: string
  flower: string | null
}

const PAD_COLORS: [string, string][] = [
  ['#3f7f45', '#2c5c32'],
  ['#4b8f4a', '#356b37'],
  ['#36703d', '#25502b'],
]
const FLOWERS = ['#f7a8c4', '#f5efe6', '#ff8fab']

const rand = (a: number, b: number) => a + Math.random() * (b - a)

export function createLilyPads() {
  let pads: Pad[] = []
  let W = 0, H = 0

  function seed(w: number, h: number) {
    const count = clamp(Math.round((w * h) / 200000), 3, 8)
    pads = Array.from({ length: count }, () => {
      const [color, vein] = PAD_COLORS[Math.floor(Math.random() * PAD_COLORS.length)]
      return {
        x: rand(0, w),
        y: rand(0, h),
        r: rand(42, 80),
        rot: rand(0, TAU),
        spin: rand(-0.04, 0.04),
        vx: rand(-4, 4),
        vy: rand(-3, 3),
        color,
        vein,
        flower: Math.random() < 0.35 ? FLOWERS[Math.floor(Math.random() * FLOWERS.length)] : null,
      }
    })
  }

  return {
    resize(w: number, h: number) {
      if (!pads.length) seed(w, h)
      W = w
      H = h
    },

    /** Koi (or anything) at `p` moving with velocity `v` nudges overlapping pads. */
    push(p: Pt, v: Pt, radius: number, dt: number) {
      for (const pad of pads) {
        const dx = pad.x - p.x, dy = pad.y - p.y
        const d = Math.hypot(dx, dy)
        const reach = pad.r + radius
        if (d < reach && d > 0.01) {
          const k = (1 - d / reach) * dt
          pad.vx += (v.x * 0.6 + (dx / d) * 30) * k
          pad.vy += (v.y * 0.6 + (dy / d) * 30) * k
          pad.spin += (Math.random() - 0.5) * k * 0.6
        }
      }
    },

    step(dt: number) {
      for (const p of pads) {
        p.x += p.vx * dt
        p.y += p.vy * dt
        p.rot += p.spin * dt
        // water drag back towards a lazy drift
        const drag = Math.exp(-dt * 0.5)
        p.vx = lerp(Math.sign(p.vx) * 2.5, p.vx, drag)
        p.vy = lerp(Math.sign(p.vy) * 1.5, p.vy, drag)
        p.spin = clamp(p.spin, -0.25, 0.25) * Math.exp(-dt * 0.1)
        // wrap around the screen
        const m = p.r + 10
        if (p.x < -m) p.x = W + m
        if (p.x > W + m) p.x = -m
        if (p.y < -m) p.y = H + m
        if (p.y > H + m) p.y = -m
      }
    },

    /** `bob(x, y)` returns how much a passing ripple lifts the pad (0..1). */
    draw(g: CanvasRenderingContext2D, bob: (x: number, y: number) => number) {
      for (const p of pads) {
        const r = p.r * (1 + bob(p.x, p.y) * 0.08)
        const notch = 0.4

        // pad: a disc with a wedge cut out
        g.fillStyle = p.color
        g.beginPath()
        g.moveTo(p.x, p.y)
        g.arc(p.x, p.y, r, p.rot + notch, p.rot + TAU - notch)
        g.closePath()
        g.fill()

        // veins radiating from the centre
        g.strokeStyle = p.vein
        g.lineWidth = 3
        g.beginPath()
        for (let i = 1; i < 8; i++) {
          const a = p.rot + notch + (i / 8) * (TAU - notch * 2)
          g.moveTo(p.x, p.y)
          g.lineTo(p.x + Math.cos(a) * r * 0.85, p.y + Math.sin(a) * r * 0.85)
        }
        g.stroke()

        if (p.flower) {
          const fx = p.x + Math.cos(p.rot + Math.PI) * r * 0.25
          const fy = p.y + Math.sin(p.rot + Math.PI) * r * 0.25
          g.fillStyle = p.flower
          for (let i = 0; i < 7; i++) {
            const a = p.rot * 2 + (i / 7) * TAU
            g.beginPath()
            g.ellipse(fx + Math.cos(a) * r * 0.16, fy + Math.sin(a) * r * 0.16, r * 0.2, r * 0.08, a, 0, TAU)
            g.fill()
          }
          g.fillStyle = '#ffd166'
          g.beginPath()
          g.arc(fx, fy, r * 0.09, 0, TAU)
          g.fill()
        }
      }
    },
  }
}

// ---------------------------------------------------------------------------
// Rubber duck: a single small one, seen from above. They float on the surface, turn to
// face the way they're drifting, bob on ripples, get bumped by koi and paddle
// off when you splash near them.
// ---------------------------------------------------------------------------

interface Duck {
  x: number
  y: number
  vx: number
  vy: number
  heading: number
  size: number
  wobble: number
}

const DUCK_BODY = '#ffd23f'
const DUCK_WING = '#f2b705'
const DUCK_BEAK = '#ff8a2a'

export function createDucks() {
  let ducks: Duck[] = []
  let W = 0, H = 0

  function seed(w: number, h: number) {
    ducks = Array.from({ length: 1 }, () => {
      const heading = rand(0, TAU)
      return {
        x: rand(w * 0.1, w * 0.9),
        y: rand(h * 0.1, h * 0.9),
        vx: Math.cos(heading) * 6,
        vy: Math.sin(heading) * 6,
        heading,
        size: rand(1.4, 1.65),
        wobble: rand(0, TAU),
      }
    })
  }

  /** Push ducks within `reach` of (x, y) away from it. */
  function shove(x: number, y: number, reach: number, force: number) {
    for (const d of ducks) {
      const dx = d.x - x, dy = d.y - y
      const dist = Math.hypot(dx, dy)
      if (dist < reach && dist > 0.01) {
        const k = (1 - dist / reach) * force
        d.vx += (dx / dist) * k
        d.vy += (dy / dist) * k
      }
    }
  }

  return {
    resize(w: number, h: number) {
      if (!ducks.length) seed(w, h)
      W = w
      H = h
    },

    /** Something at `p` moving with `v` bumps any duck it passes under. */
    push(p: Pt, v: Pt, radius: number, dt: number) {
      for (const d of ducks) {
        const dx = d.x - p.x, dy = d.y - p.y
        const dist = Math.hypot(dx, dy)
        const reach = 24 * d.size + radius
        if (dist < reach && dist > 0.01) {
          const k = (1 - dist / reach) * dt
          d.vx += (v.x * 0.8 + (dx / dist) * 40) * k
          d.vy += (v.y * 0.8 + (dy / dist) * 40) * k
        }
      }
    },

    splash(x: number, y: number) {
      shove(x, y, 280, 70)
    },

    step(dt: number, t: number) {
      for (const d of ducks) {
        // a lazy paddle so they never sit completely still
        d.vx += Math.cos(t * 0.23 + d.wobble) * 2 * dt
        d.vy += Math.sin(t * 0.19 + d.wobble * 1.7) * 2 * dt
        const drag = Math.exp(-dt * 0.6)
        d.vx *= drag
        d.vy *= drag
        d.x += d.vx * dt
        d.y += d.vy * dt

        // turn to face the drift, slowly
        const sp = Math.hypot(d.vx, d.vy)
        if (sp > 1.5) {
          const target = Math.atan2(d.vy, d.vx)
          let diff = (target - d.heading) % TAU
          if (diff > Math.PI) diff -= TAU
          if (diff < -Math.PI) diff += TAU
          d.heading += diff * clamp(dt * 1.5, 0, 1)
        }

        const m = 40
        if (d.x < -m) d.x = W + m
        if (d.x > W + m) d.x = -m
        if (d.y < -m) d.y = H + m
        if (d.y > H + m) d.y = -m
      }
    },

    draw(g: CanvasRenderingContext2D, t: number, bob: (x: number, y: number) => number) {
      for (const d of ducks) {
        const s = d.size * (1 + bob(d.x, d.y) * 0.12)
        const rock = Math.sin(t * 1.6 + d.wobble) * 0.12
        const a = d.heading + rock
        const ca = Math.cos(a), sa = Math.sin(a)
        const at = (f: number, side = 0) => ({
          x: d.x + ca * f * s - sa * side * s,
          y: d.y + sa * f * s + ca * side * s,
        })

        // tail point
        const tail = at(-17)
        g.fillStyle = DUCK_BODY
        g.beginPath()
        g.ellipse(tail.x, tail.y, 7 * s, 4 * s, a, 0, TAU)
        g.fill()

        // body
        g.beginPath()
        g.ellipse(d.x, d.y, 18 * s, 12 * s, a, 0, TAU)
        g.fill()

        // wings
        g.fillStyle = DUCK_WING
        for (const side of [-1, 1]) {
          const wp = at(-3, side * 6.5)
          g.beginPath()
          g.ellipse(wp.x, wp.y, 9 * s, 4 * s, a, 0, TAU)
          g.fill()
        }

        // head + beak
        const head = at(13)
        g.fillStyle = DUCK_BODY
        g.beginPath()
        g.arc(head.x, head.y, 8.5 * s, 0, TAU)
        g.fill()
        const beak = at(22)
        g.fillStyle = DUCK_BEAK
        g.beginPath()
        g.ellipse(beak.x, beak.y, 5 * s, 3.5 * s, a, 0, TAU)
        g.fill()
      }
    },
  }
}
