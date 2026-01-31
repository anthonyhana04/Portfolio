import React from 'react';
import useFadeOnScroll from '../hooks/useFadeOnScroll';
import { projectsData } from '../assets/data/projectsData';
import { PROJECTS_BG_ASCII } from '../assets/data/ascii';

const Projects = () => {
  useFadeOnScroll('.project-item', {
    threshold: 0.1,
    rootMargin: '0px'
  })

  return (
    <section id="experiences" className="projects-section bg-white text-black pb-0 pt-0 relative overflow-hidden">
      {/* Background ASCII Art - Copied settings from profile_log */}
      <div className="absolute top-0 left-0 w-[150%] h-full pointer-events-none select-none opacity-[0.10] overflow-hidden flex flex-wrap content-start z-0">
        {Array.from({ length: 150 }).map((_, i) => (
          <pre key={i} className="text-[10px] leading-[1.0] font-mono whitespace-pre text-black">
            {PROJECTS_BG_ASCII}
          </pre>
        ))}
      </div>

      <div className="container max-w-7xl mx-auto px-6 relative z-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-black">
          <div>
            <span className="font-crimson text-lg italic text-gray-500 mb-2 block">
              02 - selected_work
            </span>
            <h2 className="text-5xl md:text-6xl font-bold font-crimson lowercase tracking-tight">
              featured<span className="hidden md:inline">_</span>projects
            </h2>
          </div>
          <div className="mt-4 md:mt-0 font-mono text-sm flex flex-col md:items-end gap-2">
            <div>[ {projectsData.length} ITEMS DETECTED ]</div>
            <a
              href="https://github.com/anthonyhana04?tab=repositories"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-500 hover:text-black hover:underline underline-offset-4 transition-colors lowercase flex items-center gap-1"
            >
              view_more_projects <span>↗</span>
            </a>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 border-l border-black border-t border-black">
          {projectsData.map((project, index) => (
            <a
              key={project.id}
              href={project.link || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="project-item group relative block p-8 md:p-12 border-r border-b border-black hover:bg-black hover:text-white transition-colors duration-300 h-full flex flex-col justify-between"
            >
              {/* Corner accent */}
              <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-xl">↗</span>
              </div>

              <div className="mb-8">
                <div className="flex justify-between items-start mb-6 font-mono text-xs uppercase tracking-widest">
                  <span className="opacity-60">0{project.id}</span>
                  <div className="flex flex-col md:flex-row items-end gap-2">
                    {project.award && (
                      <span className="border border-yellow-600 text-yellow-700 bg-yellow-50/50 group-hover:text-yellow-300 group-hover:border-yellow-300 group-hover:bg-transparent px-2 py-0.5 rounded-full text-[10px] font-bold transition-colors duration-300">
                        {project.award}
                      </span>
                    )}
                    <span className="border border-current px-2 py-0.5 rounded-full text-[10px]">{project.type}</span>
                  </div>
                </div>

                <h3 className="text-3xl font-bold mb-4 font-mono group-hover:translate-x-2 transition-transform duration-300">
                  {project.title}
                </h3>

                <p className="font-mono text-sm leading-relaxed opacity-70 max-w-md group-hover:opacity-90">
                  {project.description}
                </p>
              </div>

              <div className="mt-auto pt-8 border-t border-dashed border-gray-400 group-hover:border-white/30">
                <div className="flex flex-wrap gap-x-4 gap-y-2 font-mono text-xs uppercase opacity-60 group-hover:opacity-100">
                  {project.tech.map((t) => (
                    <span key={t}>
                      [ <span className="font-semibold">{t}</span> ]
                    </span>
                  ))}
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Footer / ASCII decorative area */}
        {/* End of Section Log */}
        <div className="pb-18 pt-18 font-mono text-xs opacity-40 select-none flex items-center justify-center overflow-hidden w-full">
          <div className="flex-grow whitespace-nowrap text-right overflow-hidden">
            {`"\`-._,-'`.repeat(20)}
          </div>
          <span className="mx-4 font-bold lowercase flex-shrink-0">
            [ end_of_section ]
          </span>
          <div className="flex-grow whitespace-nowrap text-left overflow-hidden">
            {`"\`-._,-'`.repeat(20)}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;