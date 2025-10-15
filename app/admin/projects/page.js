"use client"
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAdmin } from '../../../lib/adminContext'

async function fetchProjects() {
  const response = await fetch('/api/projects')
  if (!response.ok) return []
  const data = await response.json()
  return data || []
}

export default function AdminProjects() {
  const { isAdmin, isLoading } = useAdmin()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (!isAdmin) return

    const loadProjects = async () => {
      setLoading(true)
      try {
        const projectsData = await fetchProjects()
        setProjects(projectsData)
      } catch (error) {
        console.error('Error loading projects:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProjects()
  }, [isAdmin])

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (project.category && project.category.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  async function deleteProject(id) {
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setProjects(projects => projects.filter(p => p.id !== id))
      } else {
        alert('Failed to delete project')
      }
    } catch (error) {
      console.error('Error deleting project:', error)
      alert('Error deleting project')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-white dark:bg-slate-900 rounded-lg shadow">
          <div className="text-red-500 text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Access Denied</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">You need administrator privileges to access this page.</p>
          <Link href="/admin" className="px-4 py-2 bg-cyan text-white rounded hover:bg-cyan/90 transition-colors">
            Go to Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Projects Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your portfolio projects</p>
        </div>
        <Link
          href="/admin/projects/new"
          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center space-x-2"
        >
          <span>➕</span>
          <span>Add Project</span>
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan focus:border-transparent dark:bg-slate-700 dark:text-white"
            />
          </div>
          <div className="flex gap-2">
            <select className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan focus:border-transparent dark:bg-slate-700 dark:text-white">
              <option value="">All Categories</option>
              <option value="web">Web Development</option>
              <option value="mobile">Mobile App</option>
              <option value="ai">AI Solutions</option>
              <option value="security">Security</option>
            </select>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan"></div>
        </div>
      ) : (
        <>
          {filteredProjects.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🚀</div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No projects found</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating your first project.'}
              </p>
              {!searchTerm && (
                <Link
                  href="/admin/projects/new"
                  className="px-4 py-2 bg-cyan text-white rounded hover:bg-cyan/90 transition-colors"
                >
                  Create First Project
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map(project => (
                <div key={project.id} className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200">
                  {/* Project Image */}
                  <div className="relative w-full h-48 bg-gray-200 dark:bg-slate-700">
                    {project.front_image ? (
                      <img
                        src={project.front_image}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary to-cyan">
                        <span className="text-white text-4xl">🚀</span>
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        project.live_url
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                          : 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400'
                      }`}>
                        {project.live_url ? 'Live' : 'Draft'}
                      </span>
                    </div>
                  </div>

                  {/* Project Content */}
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 line-clamp-1">
                      {project.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                      {project.summary}
                    </p>

                    {project.category && (
                      <div className="mb-3">
                        <span className="inline-block px-2 py-1 text-xs bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded">
                          {project.category}
                        </span>
                      </div>
                    )}

                    {/* Tags */}
                    {project.tags && project.tags.length > 0 && (
                      <div className="mb-4 flex flex-wrap gap-1">
                        {project.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="px-2 py-1 text-xs bg-cyan/10 text-cyan rounded">
                            {tag}
                          </span>
                        ))}
                        {project.tags.length > 3 && (
                          <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 rounded">
                            +{project.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Link
                        href={`/portfolio/${project.id}`}
                        className="flex-1 px-3 py-2 text-sm bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors text-center"
                      >
                        View
                      </Link>
                      <Link
                        href={`/admin/projects/edit/${project.id}`}
                        className="flex-1 px-3 py-2 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors text-center"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => deleteProject(project.id)}
                        className="px-3 py-2 text-sm bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Stats Footer */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4">
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>Total Projects: {projects.length}</span>
          <span>Showing: {filteredProjects.length}</span>
        </div>
      </div>
    </div>
  )
}