export type Pt = { x: number; y: number }

export const TAU = Math.PI * 2

export const clamp = (v: number, lo: number, hi: number) => (v < lo ? lo : v > hi ? hi : v)
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t

/** Shortest signed angle from `from` to `to`, in (-π, π]. */
export const angleDiff = (to: number, from: number) => {
  let d = (to - from) % TAU
  if (d > Math.PI) d -= TAU
  if (d < -Math.PI) d += TAU
  return d
}

/** Integer hash of a grid cell + time bucket, used for glyph shimmer. */
export const hash3 = (x: number, y: number, z: number) =>
  ((x * 73856093) ^ (y * 19349663) ^ (z * 83492791)) >>> 0
