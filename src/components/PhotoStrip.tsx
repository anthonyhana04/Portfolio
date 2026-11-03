import type { Photo } from '../data/profile'

const TILTS = [2, -3, 2, -3, 2, -2, 3]

/** Placeholder for a photo slot that doesn't have an image yet. */
function EmptySlot({ index }: { index: number }) {
  const art = ['  .---.  ', ' ( o o ) ', '  \\_^_/  '].join('\n')
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 rounded-lg bg-[repeating-linear-gradient(135deg,#141414_0_6px,#181818_6px_12px)] text-muted">
      <pre aria-hidden className="font-mono text-[10px] leading-tight md:text-xs">{art}</pre>
      <span className="font-mono text-[10px] tracking-widest uppercase md:text-xs">photo {index + 1}</span>
    </div>
  )
}

/** A row of overlapping, slightly tilted photo cards. */
export default function PhotoStrip({ photos }: { photos: Photo[] }) {
  return (
    <div className="flex w-full items-center justify-center overflow-hidden px-4 py-6 sm:overflow-visible">
      {photos.map((p, i) => (
        <div
          key={i}
          tabIndex={0}
          className="relative -mx-4 shrink-0 rounded-xl border border-neutral-700 bg-neutral-800 p-1 shadow-lg shadow-black/40 transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:z-10 hover:!rotate-0 hover:scale-110 focus-visible:z-10 focus-visible:!rotate-0 focus-visible:scale-110 focus-visible:outline-none"
          style={{ rotate: `${TILTS[i % TILTS.length]}deg` }}
        >
          <div className="h-36 w-24 sm:h-48 sm:w-32 md:h-60 md:w-40 lg:h-72 lg:w-48">
            {p.src ? (
              <img src={p.src} alt={p.alt} className="h-full w-full rounded-lg object-cover" />
            ) : (
              <EmptySlot index={i} />
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
