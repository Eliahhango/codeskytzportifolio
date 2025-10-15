"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAdmin } from '../../../../lib/adminContext'

export default function NewProject() {
  const { isAdmin, isLoading } = useAdmin()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    category: 'web',
    live_url: '',
    github_url: '',
    front_image: '',
    gallery: [],
    tags: []
  })
  const [tagInput, setTagInput] = useState('')
  const [galleryInput, setGalleryInput] = useState('')

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }))
      setTagInput('')
    }
  }

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const addGalleryImage = () => {
    if (galleryInput.trim() && !formData.gallery.includes(galleryInput.trim())) {
      setFormData(prev => ({
        ...prev,
        gallery: [...prev.gallery, galleryInput.trim()]
      }))
      setGalleryInput('')
    }
  }

  const removeGalleryImage = (imageToRemove) => {
    setFormData(prev => ({
      ...prev,
      gallery: prev.gallery.filter(img => img !== imageToRemove)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push('/admin/projects')
      } else {
        const error = await response.json()
        alert(`Error creating project: ${error.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error creating project:', error)
      alert('Error creating project')
    } finally {
      setLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan"></div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-white dark:bg-slate-900 rounded-lg shadow">
          <div className="text-red-500 text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Access Denied</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Admin access required.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <Link
            href="/admin/projects"
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            ← Back to Projects
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create New Project</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Add a new project to your portfolio</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Basic Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Project Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan focus:border-transparent dark:bg-slate-700 dark:text-white"
                placeholder="Enter project title"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Summary *
              </label>
              <textarea
                name="summary"
                value={formData.summary}
                onChange={handleInputChange}
                required
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan focus:border-transparent dark:bg-slate-700 dark:text-white"
                placeholder="Brief description of the project"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan focus:border-transparent dark:bg-slate-700 dark:text-white"
              >
                <option value="web">Web Development</option>
                <option value="mobile">Mobile App</option>
                <option value="ai">AI Solutions</option>
                <option value="security">Security</option>
                <option value="automation">Automation</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* URLs and Links */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Links & URLs</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Live URL
              </label>
              <input
                type="url"
                name="live_url"
                value={formData.live_url}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan focus:border-transparent dark:bg-slate-700 dark:text-white"
                placeholder="https://example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                GitHub URL
              </label>
              <input
                type="url"
                name="github_url"
                value={formData.github_url}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan focus:border-transparent dark:bg-slate-700 dark:text-white"
                placeholder="https://github.com/username/repo"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Featured Image URL
              </label>
              <input
                type="url"
                name="front_image"
                value={formData.front_image}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan focus:border-transparent dark:bg-slate-700 dark:text-white"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Technologies & Tags</h2>

          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan focus:border-transparent dark:bg-slate-700 dark:text-white"
                placeholder="Add technology or tag"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 bg-cyan text-white rounded-lg hover:bg-cyan/90 transition-colors"
              >
                Add
              </button>
            </div>

            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-cyan text-white"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-cyan hover:text-white"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Gallery Images */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Gallery Images</h2>

          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="url"
                value={galleryInput}
                onChange={(e) => setGalleryInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addGalleryImage())}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan focus:border-transparent dark:bg-slate-700 dark:text-white"
                placeholder="Add gallery image URL"
              />
              <button
                type="button"
                onClick={addGalleryImage}
                className="px-4 py-2 bg-cyan text-white rounded-lg hover:bg-cyan/90 transition-colors"
              >
                Add
              </button>
            </div>

            {formData.gallery.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {formData.gallery.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Gallery ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(image)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-slate-700">
          <Link
            href="/admin/projects"
            className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : 'Create Project'}
          </button>
        </div>
      </form>
    </div>
  )
}