// src/components/footer.jsx
import React, { useState, useEffect } from 'react';
import Icon from './icon';
import { TECH_STACK_BG_ASCII } from '../assets/data/ascii';

const Footer = () => {
  const [currentTime, setCurrentTime] = useState('');
  const [isOnline, setIsOnline] = useState(true);

  // my timezone (EST)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();

      // format time for display
      const timeDisplay = now.toLocaleTimeString('en-CA', {
        timeZone: 'America/Toronto',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      setCurrentTime(timeDisplay);

      // check online status (10pm - 9am est = offline)
      const hourString = now.toLocaleTimeString('en-US', {
        timeZone: 'America/Toronto',
        hour: 'numeric',
        hour12: false
      });

      const hour = parseInt(hourString, 10);
      // Offline if hour is 22, 23, 0, 1, ... 8
      const isOffline = hour >= 22 || hour < 9;
      setIsOnline(!isOffline);
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <footer id="footer" className="bg-white text-black py-16 font-mono relative overflow-hidden">
      {/* Background ASCII Art */}
      <div className="absolute top-0 left-0 w-[150%] h-full pointer-events-none select-none opacity-[0.10] overflow-hidden flex flex-wrap content-start z-0">
        {Array.from({ length: 100 }).map((_, i) => (
          <pre key={i} className="text-[10px] leading-[1.0] font-mono whitespace-pre text-black">
            {TECH_STACK_BG_ASCII}
          </pre>
        ))}
      </div>

      <div className="container max-w-7xl mx-auto px-6 relative z-10">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          {/* Identity */}
          <div>
            <div className="font-crimson text-sm italic text-gray-500 mb-6 px-1 border-l-2 border-black">
            </div>
            <h2 className="text-2xl font-bold uppercase tracking-tight mb-2">Anthony Hana</h2>
            <p className="text-sm opacity-70 mb-1">Mathematics & Computer Science</p>
            <p className="text-sm opacity-70">McMaster University</p>
          </div>

          {/* Status */}
          <div>
            <div className="font-crimson text-sm italic text-gray-500 mb-6 px-1 border-l-2 border-black">
            </div>
            <div className="flex items-center gap-3 mb-2">
              <span className="relative flex h-3 w-3">
                {isOnline && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                )}
                <span className={`relative inline-flex rounded-full h-3 w-3 ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></span>
              </span>
              <span className="text-sm font-bold">{isOnline ? 'ONLINE' : 'OFFLINE'}</span>
            </div>
            <div className="text-3xl font-bold tracking-tighter mb-1">
              {currentTime}<span className="text-sm font-normal text-gray-400 ml-2">EST</span>
            </div>
            <div className="text-xs opacity-50 uppercase">
              LOC: Hamilton, ON, CA
            </div>
          </div>

          {/* Connect */}
          <div>
            <div className="font-crimson text-sm italic text-gray-500 mb-6 px-1 border-l-2 border-black">
            </div>
            <a
              href="mailto:anthonyhana04@gmail.com"
              className="block text-lg hover:underline decoration-1 underline-offset-4 mb-6 hover:translate-x-1 transition-transform duration-200"
            >
              anthonyhana04@gmail.com ↗
            </a>

            <div className="flex gap-6">
              {[
                { name: 'github', link: 'https://github.com/anthonyhana04' },
                { name: 'linkedin', link: 'https://linkedin.com/in/anthony-hana-797a3a208/' },
                { name: 'instagram', link: 'https://instagram.com/anthony.hana' },
                { name: 'discord', link: 'https://discord.com/users/an.1' }
              ].map((social) => (
                <a
                  key={social.name}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative items-center justify-center p-2 border border-black hover:bg-black hover:text-white transition-colors duration-300"
                  aria-label={social.name}
                >
                  <Icon name={social.name} size={20} color="currentColor" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-dashed border-gray-400 pt-8 flex flex-col md:flex-row justify-between items-center text-xs opacity-60 uppercase tracking-wider gap-4">
          <div className="hidden lowercase md:block">
            anthony_hana_portfolio
          </div>
          <div className="hidden lowercase md:block">
            {`[ end_of_page ]`}
          </div>
          <div className="hidden lowercase md:block">
            built_with_react
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
