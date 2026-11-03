export type Pt = { x: number; y: number }

export const TAU = Math.PI * 2

export const clamp = (v: number, lo: number, hi: number) => (v < lo ? lo : v > hi ? hi : v)
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t

/** 0→1 progress of `t` through the window [start, start + dur]. */
export const prog = (t: number, start: number, dur: number) => clamp((t - start) / dur, 0, 1)

export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)
export const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
export const smoothstep = (a: number, b: number, t: number) => {
  const x = clamp((t - a) / (b - a), 0, 1)
  return x * x * (3 - 2 * x)
}

/** Shortest signed angle from `from` to `to`, in (-π, π]. */
export const angleDiff = (to: number, from: number) => {
  let d = (to - from) % TAU
  if (d > Math.PI) d -= TAU
  if (d < -Math.PI) d += TAU
  return d
}

/** Small deterministic PRNG (mulberry32) so scenes look the same every load. */
export function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Integer hash of a grid cell + time bucket, used for glyph shimmer/dissolve. */
export const hash3 = (x: number, y: number, z: number) =>
  ((x * 73856093) ^ (y * 19349663) ^ (z * 83492791)) >>> 0

export type Bezier = [Pt, Pt, Pt, Pt]

export function bez(p: Bezier, t: number): Pt {
  const u = 1 - t
  const a = u * u * u, b = 3 * u * u * t, c = 3 * u * t * t, d = t * t * t
  return {
    x: a * p[0].x + b * p[1].x + c * p[2].x + d * p[3].x,
    y: a * p[0].y + b * p[1].y + c * p[2].y + d * p[3].y,
  }
}

export function bezAngle(p: Bezier, t: number) {
  const a = bez(p, Math.max(0, t - 0.01))
  const b = bez(p, Math.min(1, t + 0.01))
  return Math.atan2(b.y - a.y, b.x - a.x)
}
