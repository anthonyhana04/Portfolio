import KoiPond from './components/KoiPond'
import PhotoStrip from './components/PhotoStrip'
import Reveal from './components/Reveal'
import { ProjectCard, RoleList, SectionLabel, SocialChips } from './components/Sections'
import { profile } from './data/profile'

export default function App() {
  return (
    <>
      <KoiPond />

      <main className="mx-auto w-full max-w-5xl px-4 [text-shadow:0_0_12px_#0a0a0a,0_0_4px_#0a0a0a] pt-12 pb-24 md:pt-24 lg:pt-32">
        <Reveal index={0}>
          <header className="flex items-center gap-4">
            <img
              src={profile.photo}
              alt={profile.name}
              className="h-24 w-24 rounded-lg object-cover md:h-32 md:w-32"
            />
            <div className="flex flex-col gap-1">
              <h1 className="text-3xl leading-tight font-medium md:text-5xl">{profile.name}</h1>
              <div className="flex items-baseline justify-between gap-6">
                <p className="text-base text-muted md:text-xl">{profile.title}</p>
                <a
                  href={profile.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs text-muted underline-offset-4 hover:text-fg hover:underline md:text-sm"
                >
                  resume ↗
                </a>
              </div>
              <div className="mt-1">
                <SocialChips socials={profile.socials} />
              </div>
            </div>
          </header>
        </Reveal>

        <div className="mt-8 flex flex-col gap-8">
          <Reveal index={1}>
            <SectionLabel>Now</SectionLabel>
            <RoleList roles={profile.now} />
          </Reveal>
          <Reveal index={2}>
            <SectionLabel>Previously</SectionLabel>
            <RoleList roles={profile.previously} />
          </Reveal>
        </div>

        <section className="mt-16">
          <Reveal index={3}>
            <h2 className="text-xl font-medium">Engineering</h2>
            <p className="mb-6 text-sm text-muted">Where I&apos;ve been and things I&apos;ve shipped.</p>
          </Reveal>
          <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2">
            {profile.projects.map((p, i) => (
              <Reveal key={p.name} index={4 + i}>
                <ProjectCard p={p} />
              </Reveal>
            ))}
          </div>
        </section>

        <Reveal index={4 + profile.projects.length}>
          <section aria-label="Photos" className="mt-16">
            <PhotoStrip photos={profile.photos} />
            <p className="mt-4 text-center font-mono text-xs text-muted">
              {profile.photoCaption}
            </p>
          </section>
        </Reveal>

        <Reveal index={5 + profile.projects.length}>
          <footer className="mt-12 flex flex-col items-start gap-2 border-t border-line pt-8">
            <p className="text-muted">Want to say hi?</p>
            <a href={`mailto:${profile.email}`} className="group text-lg font-medium">
              Let&apos;s chat <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
            </a>
            <p className="mt-6 font-mono text-[11px] text-muted/70">psst, click the water ~</p>
          </footer>
        </Reveal>
      </main>
    </>
  )
}
