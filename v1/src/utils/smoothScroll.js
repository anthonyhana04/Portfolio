// utils/smoothScroll.js
export const smoothScrollTo = (target, duration = 800, offset = 80) => {
  const startPosition = window.pageYOffset;
  const targetPosition = target.offsetTop - offset;
  const distance = targetPosition - startPosition;
  let startTime = null;

  const easeInOutCubic = (t) => {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
  };
  
  const animation = (currentTime) => {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    
    const ease = easeInOutCubic(progress);
    window.scrollTo(0, startPosition + distance * ease);
    
    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    } else {
      
      window.scrollTo(0, targetPosition);

      if (target.id) {
        updateURLHash(target.id);
      }
    }
  };
  
  requestAnimationFrame(animation);
};

const updateURLHash = (hash) => {
  if (window.history && window.history.pushState) { // forgot how to use global history
    window.history.pushState(null, null, `#${hash}`);
  } else {
    // fallback for older browsers
    const scrollPosition = window.pageYOffset;
    window.location.hash = hash;
    window.scrollTo(0, scrollPosition);
  }
};

export const scrollToTop = (duration = 600) => {
  const startPosition = window.pageYOffset;
  const startTime = performance.now();
  
  const animateScroll = (currentTime) => {
    const elapsedTime = currentTime - startTime;
    const progress = Math.min(elapsedTime / duration, 1);
    const easeOutQuad = 1 - (1 - progress) * (1 - progress);
    
    window.scrollTo(0, startPosition * (1 - easeOutQuad));
    
    if (progress < 1) {
      requestAnimationFrame(animateScroll);
    }
  };
  
  requestAnimationFrame(animateScroll);
};
