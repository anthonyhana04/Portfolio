import React from 'react'
import Icon from '../components/icon'

const ProjectCard = ({ project, isReverse = false }) => {
  const { id, title, description, image, tech, githubUrl, category, imagescale } = project

  return (
    <article
      className={`
        project-card fade-in-up mb-12
        flex flex-col md:flex-row
        items-start
        gap-y-12 md:gap-y-0 md:gap-x-24
        ${isReverse ? 'md:flex-row-reverse' : ''}
      `}
    >
      <div className="self-center w-full md:w-1/2">
        <div className={`flex justify-center ${isReverse ? 'md:mr-4' : 'md:ml-4'}`}>
          <div className="relative">
            {category && (
              <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-md text-sm font-medium text-gray-700 border border-gray-200">
                {category}
              </div>
            )}
            <img
              src={image}
              alt={`${title} preview`}
              className={`w-115 rounded-xl shadow-xl border border-gray-200 transition-transform duration-300 hover:scale-105 md:w-109 sm:w-101 ${id === 1 ? 'object-contain bg-white aspect-video' : ''}`}
            />
          </div>
        </div>
      </div>
      <div className="w-full md:w-1/2 flex flex-col justify-start">
        <h3 className="text-5xl font-semibold text-gray-900 mb-6 lg:text-4xl md:text-3xl">
          {title}
        </h3>
        <p className="text-xl text-gray-600 mb-6 lg:text-lg md:text-base">
          {description}
        </p>
        <div className="mb-8">
          <span className="block text-sm text-gray-500 font-medium uppercase tracking-wide mb-2">
            {id === 2 ? 'Tools:' : id === 1 ? 'Worked with:' : 'Built with:'}
          </span>
          <div className="flex flex-wrap gap-2">
            {tech.map((t, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium border border-gray-200 hover:bg-gray-200 transition"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
        <div className="mt-auto">
          {id === 2 ? (
            <a
              href="http://outreach.mcmaster.ca"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-gray-900 hover:text-gray-700"
            >
              <Icon name="arrowNE" size={20} />
              <span>McMaster Start Coding</span>
            </a>
          ) : id === 1 ? (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-gray-900 hover:text-gray-700"
            >
              <Icon name="arrowNE" size={20} />
              <span>Visit LTV.ai</span>
            </a>
          ) : (
            githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-gray-900 hover:text-gray-700"
              >
                <Icon name="github" size={20} />
                <span>Source</span>
              </a>
            )
          )}
        </div>
      </div>
    </article>
  )
}

export default ProjectCard
