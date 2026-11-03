// src/components/navigation.jsx
import React, { useState, useEffect } from 'react';
import { smoothScrollTo } from '../utils/smoothScroll';
import useScrollSpy from '../hooks/useScrollSpy';
import Icon from './icon';
import assets from '../utils/assets';

const Navigation = () => {
  const activeSection = useScrollSpy(['home', 'about', 'techstack', 'experiences', 'contact']);

  const socials = [
    {
      name: "linkedin",
      link: "https://linkedin.com/in/anthony-hana-797a3a208/",
      label: "LinkedIn"
    },
    {
      name: "github",
      link: "https://github.com/anthonyhana04",
      label: "Github"
    },
    {
      name: "file",
      link: assets['resume.pdf'],
      label: "Resume"
    }
  ];

  /* smooth-scroll helper */
  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    const el = document.getElementById(targetId);
    if (el) smoothScrollTo(el);
  };

  return (
    <nav
      className="absolute top-0 w-full z-51 h-24 bg-transparent"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-8 h-full flex justify-between items-center text-black">
        {/* Socials (Left) */}
        <div className="flex items-center gap-6">
          {socials.map(social => (
            <a
              key={social.name}
              href={social.link}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              className="text-gray-400 hover:text-black transition-colors duration-300 hover:scale-110"
            >
              <Icon name={social.name} size={22} />
            </a>
          ))}
        </div>

        {/* Links (Center) - Hidden on mobile */}
        <ul className="hidden md:flex gap-12">
          {["about", "experiences", "techstack"].map(id => (
            <li key={id}>
              <a
                href={`#${id}`}
                onClick={e => handleNavClick(e, id)}
                className={`
                  relative text-xl font-crimson font-medium lowercase tracking-wide
                  transition-colors duration-300
                  ${activeSection === id ? 'text-black' : 'text-gray-500 hover:text-black'}
                `}
              >
                {/* Text Content */}
                {id === "techstack" ? "tech_stack" : id}

                {/* Hover Dot */}
                <span className={`
                  absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-black
                  transition-all duration-300
                  ${activeSection === id ? 'opacity-100 scale-100' : 'opacity-0 scale-0 group-hover:opacity-100'}
                `} />
              </a>
            </li>
          ))}
        </ul>

        {/* Contact (Right) */}
        <a
          href="#footer"
          onClick={e => handleNavClick(e, "footer")}
          className="group flex items-center gap-2 font-crimson font-bold text-xl lowercase text-black hover:opacity-60 transition-opacity"
        >
          contact
          <Icon
            name="arrowNE"
            size={22}
            className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
          />
        </a>
      </div>
    </nav>
  );
};

export default Navigation;
