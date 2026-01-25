import React, { useState } from 'react';
import useFadeOnScroll from '../hooks/useFadeOnScroll';

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
    <section id="techstack" className="relative bg-white text-black py-24 border-t border-black">
      <div className="container max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="mb-16 border-b border-black pb-6">
          <div className="flex justify-between items-end">
            <div>
              <span className="font-mono text-xs tracking-widest uppercase mb-2 block text-gray-500">
                03 // SYSTEM_CAPABILITIES
              </span>
              <h2 className="text-5xl md:text-6xl font-bold tracking-tighter uppercase font-mono">
                TECH<span className="hidden md:inline">_</span>STACK
              </h2>
            </div>
            <div className={`hidden md:block transition-all duration-300 ${isGridHovered ? 'text-green-500 drop-shadow-[0_0_15px_rgba(34,197,94,0.6)]' : 'text-black'}`}>
              <svg
                className="terminal-svg"
                width="50"
                height="50"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="40" height="40" fill="white" fillOpacity="0" />
                <rect x="3.875" y="4.875" width="34.625" height="34.625" className="fill-current stroke-current" />
                <rect x="1.5" y="2.5" width="34.625" height="34.625" fill="white" className="stroke-current" />
                <rect x="35.4375" y="2" width="1.1875" height="1.1875" fill="white" />
                <rect x="34.4941" y="35.5" width="1.1875" height="1.1875" className="fill-current" />
                <rect x="1" y="2" width="1.1875" height="1.1875" fill="white" />
                <rect x="1" y="36.4375" width="1.1875" height="1.1875" fill="white" />
                <rect x="3.375" y="38.8125" width="1.1875" height="1.1875" fill="white" />
                <rect x="37.8125" y="38.8125" width="1.1875" height="1.1875" fill="white" />
                <rect x="37.8125" y="4.375" width="1.1875" height="1.1875" fill="white" />
                <rect x="15.8213" y="26.2188" width="12.3845" height="1.25" className="fill-current" />
                <rect x="19.415" y="17.5156" width="1.25" height="1.8911" transform="rotate(90 19.415 17.5156)" className="fill-current" />
                <rect x="18.0645" y="16.6211" width="1.25" height="1.8911" transform="rotate(90 18.0645 16.6211)" className="fill-current" />
                <rect x="16.7129" y="15.7266" width="1.25" height="1.8911" transform="rotate(90 16.7129 15.7266)" className="fill-current" />
                <rect x="15.3623" y="14.8359" width="1.25" height="1.8911" transform="rotate(90 15.3623 14.8359)" className="fill-current" />
                <rect x="15.3623" y="20.1953" width="1.25" height="1.8911" transform="rotate(90 15.3623 20.1953)" className="fill-current" />
                <rect x="14.0107" y="21.0859" width="1.25" height="1.8911" transform="rotate(90 14.0107 21.0859)" className="fill-current" />
                <rect x="12.6602" y="21.9805" width="1.25" height="1.8911" transform="rotate(90 12.6602 21.9805)" className="fill-current" />
                <rect x="14.0107" y="13.9414" width="1.25" height="1.8911" transform="rotate(90 14.0107 13.9414)" className="fill-current" />
                <rect x="12.6602" y="13.0508" width="1.25" height="1.8911" transform="rotate(90 12.6602 13.0508)" className="fill-current" />
                <rect x="11.3086" y="12.1562" width="1.25" height="1.8911" transform="rotate(90 11.3086 12.1562)" className="fill-current" />
                <rect x="11.3086" y="22.8711" width="1.25" height="1.8911" transform="rotate(90 11.3086 22.8711)" className="fill-current" />
                <rect x="16.7129" y="19.3008" width="1.25" height="1.8911" transform="rotate(90 16.7129 19.3008)" className="fill-current" />
                <rect x="18.0645" y="18.4062" width="1.25" height="1.8911" transform="rotate(90 18.0645 18.4062)" className="fill-current" />
              </svg>
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
              className="tech-category border-r border-b border-black p-8 hover:bg-black hover:text-white transition-colors duration-300 group min-h-[300px] flex flex-col"
            >
              <h3 className="font-mono text-sm font-bold mb-8 uppercase tracking-widest border-b border-black group-hover:border-white pb-2">
                [{idx + 1}] {group.category}
              </h3>

              <ul className="flex-grow flex flex-col gap-4">
                {group.items.map((item) => (
                  <li key={item} className="font-mono text-lg flex items-center justify-between">
                    <span>{item}</span>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-xs">
                      OK
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 pt-4 border-t border-dashed border-gray-400 group-hover:border-white/30 text-[10px] font-mono opacity-50">
                MODULE_LOADED
              </div>
            </div>
          ))}
        </div>

        {/* CTA / Connection Block */}
        <div className="mt-24 border border-black p-8 md:p-12 text-center bg-gray-50">
          <h3 className="font-mono text-2xl md:text-3xl font-bold uppercase mb-4">
            INITIATE_COLLABORATION
          </h3>
          <p className="font-mono text-sm text-gray-600 mb-8 max-w-xl mx-auto">
            Ready to deploy high-performance solutions? Establish a connection.
          </p>
          <a
            href="mailto:anthonyhana04@gmail.com"
            className="inline-block bg-black text-white font-mono px-8 py-4 text-sm hover:bg-white hover:text-black border border-black transition-all duration-300 uppercase tracking-wider"
          >
            [ SEND_TRANSMISSION ]
          </a>
        </div>

      </div>
    </section>
  );
};

export default TechStack;
