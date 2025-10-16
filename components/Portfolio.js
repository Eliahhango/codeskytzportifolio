"use client"

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function Portfolio(){
  const [projects, setProjects] = useState([])
  const [filteredProjects, setFilteredProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [activeFilter, setActiveFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    setMounted(true)
    let mounted = true
    setLoading(true)
    fetch('/api/projects')
      .then(r=> r.json())
      .then(data=>{
        if(mounted) {
          const projectsArray = Array.isArray(data) ? data : []
          setProjects(projectsArray)
          setFilteredProjects(projectsArray)
          setLoading(false)
        }
      })
      .catch(()=>{
        if(mounted) setLoading(false)
      })
    return ()=>{ mounted = false }
  },[])

  useEffect(() => {
    let filtered = projects

    // Apply category filter
    if (activeFilter !== 'all') {
      filtered = filtered.filter(p => p.category === activeFilter)
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.tags && p.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
      )
    }

    setFilteredProjects(filtered)
  }, [projects, activeFilter, searchTerm])

  const categories = [
    { id: 'all', name: 'All Projects', icon: 'grid-2' },
    { id: 'web', name: 'Web Development', icon: 'laptop-code' },
    { id: 'mobile', name: 'Mobile Apps', icon: 'mobile-alt' },
    { id: 'ai', name: 'AI Solutions', icon: 'robot' },
    { id: 'security', name: 'Security', icon: 'shield-alt' }
  ]

  return (
    <section id="portfolio" className="py-16 lg:py-24 bg-white dark:bg-slate-900">
      <div className="w-full mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className={`text-center mb-16 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} transition-all duration-700`}>
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-cyan/10 to-primary/10 rounded-full border border-cyan/20 mb-6">
            <FontAwesomeIcon icon="rocket" className="text-cyan mr-2" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Our Portfolio</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-gray-900 dark:text-white">Featured </span>
            <span className="bg-gradient-to-r from-primary to-cyan bg-clip-text text-transparent">Projects</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Discover our latest innovations and success stories. Each project represents our commitment to excellence and cutting-edge solutions.
          </p>
        </div>

        {/* Filters and Search */}
        <div className={`mb-12 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} transition-all duration-700 delay-200`}>
          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <FontAwesomeIcon icon="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-cyan focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveFilter(category.id)}
                className={`inline-flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  activeFilter === category.id
                    ? 'bg-gradient-to-r from-primary to-cyan text-white shadow-lg scale-105'
                    : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700 hover:scale-105'
                }`}
              >
                <FontAwesomeIcon icon={category.icon} className="mr-2" />
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-4">
              <FontAwesomeIcon icon="gears" className="animate-spin text-4xl text-cyan" />
              <p className="text-gray-600 dark:text-gray-400">Loading projects...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Results Info */}
            <div className={`text-center mb-8 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} transition-all duration-700 delay-300`}>
              <p className="text-gray-600 dark:text-gray-400">
                Showing {filteredProjects.length} of {projects.length} projects
                {searchTerm && ` for "${searchTerm}"`}
              </p>
            </div>

            {/* Projects Grid */}
            {filteredProjects.length === 0 ? (
              <div className="text-center py-20">
                <div className="space-y-4">
                  <FontAwesomeIcon icon="search" className="text-6xl text-gray-300 dark:text-gray-600" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">No projects found</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {searchTerm ? 'Try adjusting your search terms or filters.' : 'No projects match the selected category.'}
                  </p>
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary to-cyan text-white font-semibold rounded-lg hover:from-primary/90 hover:to-cyan/90 transition-all duration-200"
                    >
                      <FontAwesomeIcon icon="times" className="mr-2" />
                      Clear Search
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProjects.map((project, index) => (
                  <article
                    key={project.id}
                    className={`group relative ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} transition-all duration-700`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    {/* Project Card */}
                    <div className="relative bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2 border border-gray-200 dark:border-gray-700">
                      {/* Image Container */}
                      <div className="relative w-full h-56 overflow-hidden">
                        {project.front_image ? (
                          <img
                            src={project.front_image}
                            alt={project.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary to-cyan flex items-center justify-center">
                            <FontAwesomeIcon icon="project-diagram" className="text-white text-4xl" />
                          </div>
                        )}

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                        {/* Status Badge */}
                        {project.live_url && (
                          <div className="absolute top-4 right-4 px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
                            Live
                          </div>
                        )}

                        {/* Category Badge */}
                        {project.category && (
                          <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-semibold rounded-full capitalize">
                            {project.category}
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary transition-colors duration-200">
                          {project.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">
                          {project.summary}
                        </p>

                        {/* Tags */}
                        {project.tags && project.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-6">
                            {project.tags.slice(0, 3).map((tag, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1 text-xs bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                            {project.tags.length > 3 && (
                              <span className="px-3 py-1 text-xs bg-cyan/10 text-cyan rounded-full">
                                +{project.tags.length - 3} more
                              </span>
                            )}
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-3">
                          <Link
                            href={`/portfolio/${project.id}`}
                            className="flex-1 inline-flex items-center justify-center px-4 py-3 bg-gradient-to-r from-primary to-cyan text-white font-semibold rounded-lg hover:from-primary/90 hover:to-cyan/90 transition-all duration-200 group-hover:shadow-lg"
                          >
                            <span>Explore</span>
                            <FontAwesomeIcon icon="arrow-right" className="ml-2 group-hover:translate-x-1 transition-transform" />
                          </Link>
                          {project.live_url && (
                            <a
                              href={project.live_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center px-4 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:border-primary hover:text-primary transition-all duration-200"
                            >
                              <FontAwesomeIcon icon="external-link-alt" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </>
        )}

        {/* Bottom CTA */}
        {!loading && filteredProjects.length > 0 && (
          <div className={`text-center mt-16 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} transition-all duration-700 delay-500`}>
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-700 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Ready to Start Your Project?</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
                Let's discuss your requirements and build something amazing together. Our team is ready to bring your vision to life.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary to-cyan text-white font-semibold rounded-xl hover:from-primary/90 hover:to-cyan/90 focus:ring-2 focus:ring-cyan focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <FontAwesomeIcon icon="rocket" className="mr-2" />
                <span>Start Your Project</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
