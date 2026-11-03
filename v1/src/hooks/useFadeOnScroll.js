// src/hooks/useFadeOnScroll.js
import { useEffect } from 'react';

export default function useFadeOnScroll(selector, { root = null, threshold = 0.1 } = {}) {
  useEffect(() => {
    const elements = document.querySelectorAll(selector);
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const ratio = entry.intersectionRatio;
          
          // Use different thresholds for entering vs leaving to prevent bouncing
          if (entry.isIntersecting && ratio > 0.2) {
            entry.target.classList.add('animate-fade-in-up');
            entry.target.classList.remove('animate-fade-out-up');
          } else if (!entry.isIntersecting || ratio < 0.05) {
            entry.target.classList.add('animate-fade-out-up');
            entry.target.classList.remove('animate-fade-in-up');
          }
          // Do nothing in the "dead zone" between 0.05 and 0.2
        });
      },
      { 
        root, 
        threshold: [0, 0.05, 0.2, 0.3, 0.4, 0.5], // Multiple thresholds for precise control
        rootMargin: '-10px' // Additional buffer
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => elements.forEach((el) => observer.unobserve(el));
  }, [selector, root, threshold]);
}