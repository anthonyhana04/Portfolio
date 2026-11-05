import profilePhoto from '../assets/images/profile-photo-copy.jpg'
import ltvLogo from '../assets/images/ltvai_logo.jpeg'
import mscLogo from '../assets/images/msc_logo-web.jpg'
import mcmasterImg from '../assets/images/university-hall-web.jpg'
import macpadImg from '../assets/images/macpad-web.jpg'
import resumePdf from '../assets/resume.pdf'
import krollLogo from '../assets/images/kroll_logo.jpeg'
import ltvBanner from '../assets/images/ltvai_banner-web.jpg'
import krollBanner from '../assets/images/kroll_banner-web.jpg'
import lavalockBanner from '../assets/images/lavalock_logo.png'
import textitBanner from '../assets/images/texIt_logo.png'
import textitLogo from '../assets/images/texIt_logo_centered.png'
import mscBanner from '../assets/images/msc_banner-web.jpg'
import frame1 from '../assets/images/frame1-web.jpg'
import frame2 from '../assets/images/frame2-web.jpg'
import frame3 from '../assets/images/frame3-web.jpg'
import frame4 from '../assets/images/frame4-web.jpg'
import frame5 from '../assets/images/frame5-web.jpg'
import { siDiscord, siGithub } from 'simple-icons'
import instagramClassic from '../assets/icons/instagram-classic.svg'

export interface Social {
  label: string
  /** SVG path (24×24 viewBox). If absent, `glyph` text is shown instead. */
  icon?: string
  /** Full-bleed image used as the whole chip (takes priority over `icon`/`glyph`). */
  image?: string
  /** Short text shown inside the icon chip when there's no icon. */
  glyph?: string
  href: string
  /** Any CSS background (solid colour or gradient). */
  color: string
}

/** A photo in the strip near the bottom of the page. */
export interface Photo {
  src: string
  alt: string
}

/** Rendered as: ↳ {title} [logo] {org} - {detail} */
export interface Role {
  title: string
  org: string
  detail: string
  logo: string
  href?: string
}

export interface Project {
  name: string
  role: string
  year: string
  description: string
  tech: string[]
  href: string
  image: string
  /** CSS object-position for the preview image, e.g. 'top' to keep the top edge. Default: center. */
  imagePosition?: string
  /** CSS background shown behind the preview image (useful for transparent PNGs), e.g. '#fff'. */
  imageBackground?: string
  /** 'contain' shows the whole preview image (gaps show `imageBackground`); 'cover' fills and crops. Default: cover. */
  imageFit?: 'cover' | 'contain'
  /** Small square logo next to the title. Falls back to the project's initial. */
  logo?: string
  award?: string
}

export const profile = {
  name: 'Anthony Hana',
  title: 'Software Engineer',
  photo: profilePhoto,
  email: 'anthonyhana04@gmail.com',
  resume: resumePdf,

  socials: [
    { label: 'LinkedIn', glyph: 'in', href: 'https://linkedin.com/in/anthony-hana-797a3a208/', color: '#0A66C2' },
    { label: 'GitHub', icon: siGithub.path, href: 'https://github.com/anthonyhana04', color: '#000000' },
    { label: 'Discord', icon: siDiscord.path, href: 'https://discord.com/users/an.1', color: '#5865F2' },
    { label: 'Instagram', image: instagramClassic, href: 'https://instagram.com/anthony.hana', color: '#6b4429' },
  ] satisfies Social[],

  now: [
    { title: 'VP Software Architecture', org: 'McMaster Start Coding', detail: 'Scalable programming outreach initiative', logo: mscLogo, href: 'https://stablfoundation.org/' },
    { title: 'Honours Math & Computer Science', org: 'McMaster University', detail: 'Class of 2027', logo: mcmasterImg },
  ] satisfies Role[],

  previously: [
    { title: 'Software Engineer Intern', org: 'LTV.ai', logo: ltvLogo, href: 'https://ltv.ai/', detail: 'Wearing many hats; Founding Product' },
    { title: 'Data Engineer Intern', org: 'Kroll', logo: krollLogo, href: 'https://www.kroll.com/', detail: 'Data Platforms'},
  ] satisfies Role[],

  // Photo strip above the footer. To add one: put a web-sized copy in src/assets/images/
  // (e.g. `sips -Z 1200 -s format jpeg photo.JPG --out photo-web.jpg`),
  // import it at the top of this file, and add it to the list below.
  photoCaption: "a few frames from places i've wandered ✿",
  photos: [frame1, frame2, frame3, frame4, frame5].map((src) => ({ src, alt: 'Photo by Anthony Hana' })) satisfies Photo[],

  projects: [
    {
      name: 'Kroll',
      role: 'Data Engineer Intern',
      year: '2026',
      description:
        "Early engineer on Kroll's data platform team, building the pipelines and observability behind its Databricks and Azure lakehouse.",
      tech: [],
      href: 'https://www.kroll.com/',
      image: krollBanner,
      imagePosition: 'top',
      logo: krollLogo,
    },
    {
      name: 'LTV.ai',
      role: 'Software Engineer Intern',
      year: '2025',
      description:
        'Founding engineer wearing every hat across AI/ML, data and full-stack, shipping whatever the product needed next.',
      tech: ['TypeScript', 'PostgreSQL', 'AWS', 'LLMOps'],
      href: 'https://ltv.ai/',
      image: ltvBanner,
      imagePosition: 'top',
      logo: ltvLogo,
    },
    {
      name: 'McMaster Start Coding',
      role: 'VP Software Architecture',
      year: '2026',
      description:
        'Leading the software team behind the Stabl.Rocks platform, shipping improvements used by 80,000+ students learning to code.',
      tech: [],
      href: 'https://stablfoundation.org/',
      logo: mscLogo,
      image: mscBanner,
      imageFit: 'contain',
      imageBackground: '#fff',
    },
    {
      name: 'LavaLock',
      role: 'Hackathon',
      year: '2026',
      description:
        'Turns the chaos of lava lamps into cryptographic entropy, powering a native MFA app and password vault.',
      tech: ['Go', 'C++', 'Swift', 'AWS', 'PostgreSQL'],
      href: 'https://github.com/anthonyhana04/LavaLock_DH_XII',
      award: 'DeltaHacks XII Winner',
      logo: lavalockBanner,
      image: lavalockBanner,
      imageBackground: '#fff',
    },
    {
      name: 'TeX-it',
      role: 'Hackathon',
      year: '2026',
      description:
        'Agentic LaTeX IDE that turns voice, handwriting and plain English into compile-ready LaTeX with 96% accuracy.',
      tech: ['TypeScript', 'React', 'Electron', 'Go', 'Gemini', 'Deepgram'],
      href: 'https://github.com/anthonyhana04/TeX-it',
      logo: textitLogo,
      image: textitBanner,
    },
    {
      name: 'MacPad',
      role: 'Solo Project',
      year: '2025',
      description:
        'Feather-light native macOS editor with inline AI writing assistance, built from scratch in Swift.',
      tech: ['Swift', 'SwiftUI', 'AppKit'],
      href: 'https://github.com/anthonyhana04/MacPad',
      image: macpadImg,
    },
  ] satisfies Project[],
}
