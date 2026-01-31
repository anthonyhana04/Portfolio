// src/components/hero.jsx
import { useLayoutEffect, useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Icon from './icon';
import { CAT_ASCII, HERO_BG_ASCII } from '../assets/data/ascii';
gsap.registerPlugin(ScrollTrigger);

const WORDS = {
  line1: ['Code ', 'is '],
  line2: ['my ', 'canvas.'],
};


// Utility for randomness
const rand = (min, max) => Math.random() * (max - min) + min;

function LetterDisplay({ word }) {
  return word.split('').map((ch, i) => (
    <div
      key={i}
      className={`letter group relative inline-flex items-center justify-center
      font-crimson font-bold tracking-tighter
      text-[clamp(6rem,10vw,12rem)]
      sm:text-[clamp(8rem,9vw,14rem)]
      md:text-[clamp(10rem,8vw,16rem)]
      lg:text-[clamp(14rem,7vw,18rem)]
      cursor-default select-none
      `}
      // Bias rand range to favor < 1 (falling down). 
      // 0.8 to 1.15 gives ~57% chance of < 1 vs previous bias towards > 1.
      data-speed={rand(0.8, 1.03)}
    >
      {/* 
        We set the initial stroke width here so GSAP only needs to animate the color.
        Initial state: Solid black text, Transparent stroke (invisible).
      */}
      <span
        className="letter-inner relative z-10 text-black"
        style={{ WebkitTextStroke: '1.5px transparent' }}
      >
        {ch === ' ' ? '\u00A0' : ch}
      </span>
    </div>
  ));
}

export default function Hero() {
  const box = useRef(null);
  const [showScroll, setShowScroll] = useState(true);

  useLayoutEffect(() => {
    if (!box.current) return;

    // Check if the element is actually visible in the DOM (not hidden by css)
    // If it's hidden (mobile), we don't need to animate and it might break GSAP logic if dimensions are 0.
    if (getComputedStyle(box.current).display === 'none') return;

    const ctx = gsap.context(() => {
      box.current.querySelectorAll('.letter').forEach((el) => {
        const innerSpan = el.querySelector('.letter-inner');
        const speed = parseFloat(el.dataset.speed);

        // Randomly decide if this letter should "fade to hollow" on scroll
        const shouldFade = Math.random() > 0.55; // ~45% chance

        // Calculate potential fall distance based on scroll
        let yPos = (1 - speed) * 0.5 * ScrollTrigger.maxScroll(window);

        // Limit the falling distance so they don't go past the hero bottom (relaxed to allow overlap)
        if (yPos > 280) yPos = 280;

        // Base animation (Falling + Rotation)
        const animVars = {
          y: yPos,
          rotation: rand(-12, 12),
          ease: 'power2.out',
          scrollTrigger: {
            trigger: document.documentElement,
            start: 0,
            end: window.innerHeight,
            scrub: 0.5,
            invalidateOnRefresh: true,
          }
        };

        // Apply falling/rotation to the container
        gsap.to(el, animVars);

        // Apply color fade to the inner span (separate tween to keep logic clean, simplified sync)
        if (shouldFade && innerSpan) {
          gsap.to(innerSpan, {
            color: 'transparent',
            webkitTextStrokeColor: '#000000', // Fade stroke in to black
            ease: 'power2.out',
            scrollTrigger: {
              trigger: document.documentElement,
              start: 0,
              // Syncing with fall (end: innerHeight) is good.
              end: window.innerHeight / 1.35, // Fade faster than the full fall for visibility
              scrub: 0.5,
              invalidateOnRefresh: true,
            }
          });
        }
      });

      // Animate Jiji fading out on scroll
      gsap.to('.cat-wrapper', {
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: box.current, // Trigger relative to Hero section, not whole doc
          start: 'top top',     // Start fading immediately
          end: '25% top',       // Fade out quickly (by 1/4 of hero scroll)
          scrub: true
        }
      });
    }, box);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const handler = () => setShowScroll(window.scrollY < 40);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <section
      id="home"
      ref={box}
      className="relative hidden md:flex items-start justify-center pt-[22vh]
      lg:justify-start 
      h-screen px-6 md:px-12 lg:px-24 xl:px-40 
      overflow-visible z-50 bg-white"
    >
      {/* Background ASCII Art */}
      <div className="absolute top-0 left-0 w-[150%] h-full pointer-events-none select-none opacity-[0.10] overflow-hidden flex flex-wrap content-start z-0">
        {Array.from({ length: 100 }).map((_, i) => (
          <pre key={i} className="text-[10px] leading-[1.0] font-mono whitespace-pre text-black">
            {HERO_BG_ASCII}
          </pre>
        ))}
      </div>

      <div className={`
        relative w-fit text-left leading-none
        text-[clamp(6rem,10vw,12rem)]
        sm:text-[clamp(8rem,9vw,14rem)]
        md:text-[clamp(10rem,8vw,16rem)]
        lg:text-[clamp(14rem,7vw,18rem)]
      `}>
        <div className="flex flex-wrap justify-start">
          <LetterDisplay word={WORDS.line1[0]} />
          <div className="w-10 sm:w-15" />
          <LetterDisplay word={WORDS.line1[1]} />
        </div>
        <div className="flex flex-wrap justify-start mt-0">
          <LetterDisplay word={WORDS.line2[0]} />
          <div className="w-10 sm:w-15" />
          <LetterDisplay word={WORDS.line2[1]} />
        </div>

        {/* ASCII Cat (Jiji) - Aligned to bottom right of text using ems for scaling */}
        <div className="cat-wrapper absolute bottom-[0.16em] -right-[1.80em] z-0 select-none">
          <div className="opacity-20 hover:opacity-100 transition-all duration-500 group cursor-crosshair">
            <pre className="text-[0.08em] leading-none font-mono text-gray-400 group-hover:text-black group-hover:drop-shadow-[0_0_10px_rgba(94,88,205,0.8)] transition-all duration-300">
              {CAT_ASCII}
            </pre>
          </div>
        </div>
      </div>

      {/* Modern Scroll Indicator */}
      {/* Modern Scroll Indicator */}
      <div
        className={`
          absolute bottom-12 left-1/2 -translate-x-1/2
          flex items-center gap-3
          transition-all duration-500 ease-out
          ${showScroll ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
        `}
      >
        <span className="text-xs font-mono font-bold tracking-widest text-gray-500 uppercase transition-colors">
          Scroll
        </span>
        <Icon
          name="arrowDown"
          size={16}
          className="text-gray-400 transition-colors animate-bounce"
        />
      </div>
    </section>
  );
}
