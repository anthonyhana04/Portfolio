import React, { useState } from 'react';
import useFadeOnScroll from '../hooks/useFadeOnScroll';
import { LANGUAGES_BG_ASCII, FRAMEWORKS_BG_ASCII, INFRASTRUCTURE_BG_ASCII, TOOLS_BG_ASCII, TECH_STACK_BG_ASCII } from '../assets/data/ascii';
import { TerminalIcon } from '../assets/data/icons';

const techItems = [
  { category: "LANGUAGES", items: ["Typescript", "Haskell", "Python", "Go", "C++", "Swift"] },
  { category: "FRAMEWORKS", items: ["React", "Next.js", "Tailwind", "Pandas", "Angular", "TensorFlow", "PyTorch"] },
  { category: "INFRASTRUCTURE", items: ["Docker", "Kubernetes", "AWS", "Terraform", "PostgreSQL", "ClickHouse", "Redis"] },
  { category: "TOOLS", items: ["Git", "Postman", "Antigravity", "Docker", "Kafka", "DBeaver"] }
];

const TechStack = () => {
  useFadeOnScroll('.tech-category', {
    threshold: 0.1,
  });

  const [isGridHovered, setIsGridHovered] = useState(false);

  return (
    <section id="techstack" className="relative bg-white text-black py-0 overflow-hidden">
      {/* Background ASCII Art */}
      <div className="absolute top-0 left-0 w-[150%] h-full pointer-events-none select-none opacity-[0.10] overflow-hidden flex flex-wrap content-start z-0">
        {Array.from({ length: 150 }).map((_, i) => (
          <pre key={i} className="text-[10px] leading-[1.0] font-mono whitespace-pre text-black">
            {TECH_STACK_BG_ASCII}
          </pre>
        ))}
      </div>

      <div className="container max-w-7xl mx-auto px-6 relative z-10">

        {/* Header */}
        <div className="mb-16 border-b border-black pb-6">
          <div className="flex justify-between items-end">
            <div>
              <span className="font-crimson text-lg italic text-gray-500 mb-2 block">
                03 - system_capabilities
              </span>
              <h2 className="text-5xl md:text-6xl font-bold font-crimson lowercase tracking-tight">
                tech<span className="hidden md:inline">_</span>stack
              </h2>
            </div>
            <div className={`hidden md:block transition-all duration-300 ${isGridHovered ? 'text-green-500 drop-shadow-[0_0_15px_rgba(34,197,94,0.6)]' : 'text-black'}`}>
              <TerminalIcon />
            </div>
          </div>
        </div>

        {/* Tech Grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-l border-t border-black"
          onMouseEnter={() => setIsGridHovered(true)}
          onMouseLeave={() => setIsGridHovered(false)}
        >
          {techItems.map((group, idx) => (
            <div
              key={group.category}
              className="tech-category relative border-r border-b border-black p-8 hover:bg-black hover:text-white transition-colors duration-300 group min-h-[300px] flex flex-col overflow-hidden"
            >
              {/* ASCII Art Background for LANGUAGES */}
              {group.category === "LANGUAGES" && (
                <div className="absolute inset-0 overflow-hidden opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none select-none">
                  <div className="absolute -top-10 -left-10 w-[150%] h-[150%] flex flex-wrap content-start">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <pre key={i} className="text-[10px] leading-[1.0] font-mono text-white whitespace-pre">
                        {LANGUAGES_BG_ASCII}
                      </pre>
                    ))}
                  </div>
                </div>
              )}

              {/* ASCII Art Background for FRAMEWORKS */}
              {group.category === "FRAMEWORKS" && (
                <div className="absolute inset-0 overflow-hidden opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none select-none">
                  <div className="absolute -top-10 -left-10 w-[150%] h-[150%] flex flex-wrap content-start">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <pre key={i} className="text-[10px] leading-[1.0] font-mono text-white whitespace-pre">
                        {FRAMEWORKS_BG_ASCII}
                      </pre>
                    ))}
                  </div>
                </div>
              )}

              {/* ASCII Art Background for INFRASTRUCTURE */}
              {group.category === "INFRASTRUCTURE" && (
                <div className="absolute inset-0 overflow-hidden opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none select-none">
                  <div className="absolute -top-10 -left-10 w-[150%] h-[150%] flex flex-wrap content-start">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <pre key={i} className="text-[10px] leading-[1.0] font-mono text-white whitespace-pre">
                        {INFRASTRUCTURE_BG_ASCII}
                      </pre>
                    ))}
                  </div>
                </div>
              )}

              {/* ASCII Art Background for TOOLS */}
              {group.category === "TOOLS" && (
                <div className="absolute inset-0 overflow-hidden opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none select-none">
                  <div className="absolute -top-10 -left-10 w-[150%] h-[150%] flex flex-wrap content-start">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <pre key={i} className="text-[10px] leading-[1.0] font-mono text-white whitespace-pre">
                        {TOOLS_BG_ASCII}
                      </pre>
                    ))}
                  </div>
                </div>
              )}

              <h3 className="relative z-10 font-mono text-sm font-bold mb-8 uppercase tracking-widest border-b border-black group-hover:border-white pb-2">
                [{idx + 1}] {group.category}
              </h3>

              <ul className="relative z-10 flex-grow flex flex-col gap-4">
                {group.items.map((item) => (
                  <li key={item} className="font-mono text-lg flex items-center">
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="relative z-10 mt-8 pt-4 border-t border-dashed border-gray-400 group-hover:border-white/30 text-[10px] font-mono opacity-50">
                MODULE_LOADED
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStack;
