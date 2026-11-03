import React, { useEffect } from 'react';
import './App.css';

import Navigation from './components/navigation';
import Hero from './components/hero';
import About from './components/about';
import Projects from './components/projects';
import TechStack from './components/techstack';
import Footer from './components/footer';
import PageLoader from './components/pageloader';


function App() {
  useEffect(() => {
    // disable browser scroll restoration (force top of page on refresh)
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    // always start at top on load
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="App relative">
      <>
      {/* Navigation - Fixed at top */}
        <PageLoader />
        <Navigation />

      {/* Hero Section - Landing page content */}
        <Hero />
      {/* Intro Scroll Animation - Transition between hero and main content */}
      {/* Main Content Sections */}
        <About />
        <Projects />
        <TechStack />
      
      {/* Footer */}
        <Footer />
      </>
    </div>
  );
}

export default App;