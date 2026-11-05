import { hash3, lerp } from '../lib/math'

/**
 * Contour lines: marching squares over a slowly drifting noise field, so the
 * background reads like a topographic map of the pond floor.
 */

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
        const edge = (e: number) => {
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
