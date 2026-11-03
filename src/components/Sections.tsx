import { siGithub } from 'simple-icons'
import type { Project, Role, Social } from '../data/profile'

export function SocialChips({ socials }: { socials: Social[] }) {
  return (
    <div className="flex items-center gap-1">
      {socials.map((s) => (
        <a
          key={s.label}
          href={s.href}
          target={s.href.startsWith('mailto:') ? undefined : '_blank'}
          rel="noopener noreferrer"
          aria-label={s.label}
          className="group/icon relative inline-flex h-8 w-8 items-center justify-center overflow-visible rounded-lg text-white ring-1 ring-white/25 transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-0.5 hover:scale-110"
          style={{ background: s.color }}
        >
          {s.image ? (
            <img src={s.image} alt="" className="h-full w-full rounded-lg" />
          ) : s.icon ? (
            <svg viewBox="0 0 24 24" aria-hidden className="h-[18px] w-[18px] fill-current">
              <path d={s.icon} />
            </svg>
          ) : (
            <span className="text-base leading-none font-semibold">{s.glyph}</span>
          )}
          <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 rounded bg-fg px-2 py-1 text-xs whitespace-nowrap text-bg opacity-0 transition-opacity group-hover/icon:opacity-100">
            {s.label}
          </span>
        </a>
      ))}
    </div>
  )
}

export function SectionLabel({ children }: { children: string }) {
  return <h2 className="mb-2 text-lg tracking-wide uppercase md:text-xl">{children}</h2>
}

/** ↳ {title} [logo] {org} - {detail} */
export function RoleList({ roles }: { roles: Role[] }) {
  return (
    <ul className="flex flex-col gap-1.5 text-base md:text-xl">
      {roles.map((r) => {
        const org = (
          <span className="inline-flex items-baseline gap-1.5">
            {r.logo && (
              <img src={r.logo} alt="" className="h-[1.1em] w-[1.1em] translate-y-[0.15em] self-start rounded-[4px] bg-white object-cover ring-1 ring-white/30" />
            )}
            <span className="text-fg">{r.org}</span>
          </span>
        )
        return (
          <li key={`${r.org}-${r.title}`} className="flex gap-3">
            <span aria-hidden className="text-muted">↳</span>
            <span className="text-muted">
              {r.title}{' '}
              {r.href ? (
                <a href={r.href} target="_blank" rel="noopener noreferrer" className="underline-offset-4 decoration-white/30 hover:underline">
                  {org}
                </a>
              ) : (
                org
              )}
              {r.detail && <> - {r.detail}</>}
            </span>
          </li>
        )
      })}
    </ul>
  )
}

/** Placeholder art for projects without a screenshot. */
function AsciiPlaceholder({ seed }: { seed: string }) {
  const chars = ' .:-=+*#'
  let h = 0
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) | 0
  const rows = Array.from({ length: 9 }, (_, y) =>
    Array.from({ length: 48 }, (_, x) => {
      const v = Math.sin(x * 0.35 + h) + Math.cos(y * 0.9 - x * 0.12 + h * 0.5)
      return chars[Math.max(0, Math.min(chars.length - 1, Math.floor((v + 2) * 2)))]
    }).join(''),
  )
  return (
    <pre aria-hidden className="flex h-full w-full items-center justify-center overflow-hidden font-mono text-[10px] leading-[1.15] text-[#ff8a3d]/60 select-none">
      {rows.join('\n')}
    </pre>
  )
}

function LinkIcon({ href }: { href: string }) {
  if (href.includes('github.com')) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className="h-3.5 w-3.5 fill-current">
        <path d={siGithub.path} />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  )
}

export function ProjectCard({ p }: { p: Project }) {
  const Wrapper = p.href ? 'a' : 'div'
  return (
    <Wrapper
      {...(p.href ? { href: p.href, target: '_blank', rel: 'noopener noreferrer' } : {})}
      className="group flex min-w-0 flex-col gap-3"
    >
      <div
        className="aspect-[16/9] overflow-hidden rounded-xl bg-black/40 ring-1 ring-white/10"
        style={{ background: p.imageBackground }}
      >
        {p.image ? (
          <img
            src={p.image}
            alt=""
            style={{ objectPosition: p.imagePosition, objectFit: p.imageFit ?? 'cover' }}
            className="h-full w-full transition-transform duration-500 group-hover:scale-[1.02]"
          />
        ) : (
          <AsciiPlaceholder seed={p.name} />
        )}
      </div>
      <div className="flex flex-col gap-1">
        {/* wraps so the award + year drop to their own line when the title row runs out of room */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <div className="flex min-w-0 items-center gap-2">
            <span className="relative h-6 w-6 shrink-0">
              <span className={`absolute inset-0 overflow-hidden rounded-md bg-white ring-1 ring-white/20 transition-opacity duration-200 ${p.href ? 'group-hover:opacity-0' : ''}`}>
                {p.logo ? (
                  <img src={p.logo} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span className="flex h-full w-full items-center justify-center bg-surface text-xs font-medium text-fg">{p.name[0]}</span>
                )}
              </span>
              {p.href && (
                <span className="absolute inset-0 flex items-center justify-center rounded-md bg-fg text-bg opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  <LinkIcon href={p.href} />
                </span>
              )}
            </span>
            <h3 className="min-w-0 text-base">
              <span className="font-medium">{p.name}</span>
              <span className="text-muted"> - {p.role}</span>
            </h3>
          </div>
          <span className="ml-auto flex shrink-0 items-center gap-2">
            {p.award && (
              <span className="rounded-full border border-[#ffd166]/40 px-2 py-0.5 font-mono text-[11px] whitespace-nowrap text-[#ffd166]">
                ★ {p.award}
              </span>
            )}
            <span className="font-mono text-xs text-muted">{p.year}</span>
          </span>
        </div>
        <p className="text-sm leading-relaxed text-soft">{p.description}</p>
      </div>
    </Wrapper>
  )
}
