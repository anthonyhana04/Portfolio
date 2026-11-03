// src/components/pageloader.jsx
import React, { useState, useEffect } from 'react';

function PageLoader() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  useEffect(() => {
    // disable body scroll
    document.body.style.overflow = 'hidden';

    // after 1.4s, start slide-up
    const exitTimer = setTimeout(() => {
      setIsAnimatingOut(true);
    }, 1400);

    // after 2.3s total, remove loader
    const removeTimer = setTimeout(() => {
      setIsLoading(false);
      document.body.style.overflow = '';
    }, 2300);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(removeTimer);
      document.body.style.overflow = '';
    };
  }, []);

  if (!isLoading) return null;

  return (
    <div
      className={`page-loader-circle fixed inset-0 flex items-center justify-center
                  bg-gray-500 z-[9999]
                  ${isAnimatingOut ? 'slide-up' : ''}`}
    >
      <div className="relative z-10 text-white">
        <div className="loader-text text-6xl font-bold tracking-widest font-satoshi">
          AH
        </div>
      </div>
    </div>
  );
}

export default PageLoader;