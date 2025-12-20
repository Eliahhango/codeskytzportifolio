'use client'

import { useState, useEffect } from 'react'
import { FiExternalLink, FiGithub } from 'react-icons/fi'
import { getProjects } from '@/lib/services/projectsService'

export default function Portfolio() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const result = await getProjects()
        if (result.success) {
          setProjects(result.data)
        } else {
          setProjects([])
        }
      } catch (error) {
        console.error('Error fetching projects:', error)
        setProjects([])
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])
  return (
    <section id="portfolio" className="w-full bg-white/80 dark:bg-gray-900/90 dark:backdrop-blur-md backdrop-blur-sm py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Our Portfolio
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Showcasing our latest projects and successful implementations
          </p>
        </div>
        
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-lg">Loading projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-lg">No projects available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => {
              // Check if image is a URL or a Tailwind class
              const isImageUrl = project.image && (
                project.image.startsWith('http://') ||
                project.image.startsWith('https://') ||
                project.image.startsWith('/')
              )
              const imageClass = !isImageUrl ? (project.image || 'bg-blue-200') : ''
              const imageUrl = isImageUrl ? project.image : null

              return (
                <div
                  key={project.id || index}
                  className="bg-white dark:bg-gray-800/95 dark:border-gray-600/50 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-xl dark:hover:shadow-blue-500/20 transition-shadow duration-200"
                >
                  <div
                    className={`${imageClass} h-48 flex items-center justify-center relative`}
                    style={
                      imageUrl
                        ? {
                            backgroundImage: `url(${imageUrl})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                          }
                        : {}
                    }
                  >
                    {imageUrl && (
                      <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                    )}
                    <div className="text-6xl font-bold text-gray-700 dark:text-gray-500 opacity-30 dark:opacity-20 relative z-10">
                      {project.title.charAt(0)}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {project.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {(project.tech || []).map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="bg-ocean-blue dark:bg-blue-600 dark:text-blue-100 text-white text-sm px-3 py-1 rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-4">
                      {project.link && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-ocean-blue dark:text-blue-400 hover:text-ocean-blue-dark dark:hover:text-blue-300 flex items-center gap-2 font-medium"
                        >
                          <FiExternalLink />
                          View Project
                        </a>
                      )}
                      {project.codeLink && (
                        <a
                          href={project.codeLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 flex items-center gap-2 font-medium"
                        >
                          <FiGithub />
                          Code
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

