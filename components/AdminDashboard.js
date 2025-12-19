'use client'

import { useState, useEffect } from 'react'
import { FiLogOut, FiPlus, FiEdit, FiTrash2, FiImage, FiLink, FiSave, FiX, FiUpload, FiLoader } from 'react-icons/fi'
import { getAllCarouselAds, addCarouselAd, updateCarouselAd, deleteCarouselAd } from '@/lib/services/carouselService'
import { getAllProjects, addProject, updateProject, deleteProject } from '@/lib/services/projectsService'
import { getContactInfo, updateContactInfo } from '@/lib/services/contactService'
import { uploadImage, validateImageFile } from '@/lib/services/imgbbService'

export default function AdminDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('carousel')
  const [carouselAds, setCarouselAds] = useState([])
  const [projects, setProjects] = useState([])
  const [contactInfo, setContactInfo] = useState({
    email: '',
    phone: '',
    address: '',
  })
  const [loading, setLoading] = useState(true)
  const [editingItem, setEditingItem] = useState(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    loadData()
  }, [activeTab])

  const loadData = async () => {
    setLoading(true)
    try {
      if (activeTab === 'carousel') {
        const result = await getAllCarouselAds()
        if (result.success) {
          setCarouselAds(result.data)
        }
      } else if (activeTab === 'projects') {
        const result = await getAllProjects()
        if (result.success) {
          setProjects(result.data)
        }
      } else if (activeTab === 'contact') {
        const result = await getContactInfo()
        if (result.success && result.data) {
          setContactInfo(result.data)
        }
      }
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id, type) => {
    if (!confirm('Are you sure you want to delete this item?')) return

    try {
      if (type === 'carousel') {
        const result = await deleteCarouselAd(id)
        if (result.success) {
          loadData()
        }
      } else {
        const result = await deleteProject(id)
        if (result.success) {
          loadData()
        }
      }
    } catch (error) {
      console.error('Error deleting:', error)
      alert('Failed to delete item')
    }
  }

  const handleSave = async (formData, type) => {
    try {
      if (editingItem) {
        // Update existing
        if (type === 'carousel') {
          await updateCarouselAd(editingItem.id, formData)
        } else {
          await updateProject(editingItem.id, formData)
        }
      } else {
        // Add new
        if (type === 'carousel') {
          await addCarouselAd(formData)
        } else {
          await addProject(formData)
        }
      }
      setShowForm(false)
      setEditingItem(null)
      loadData()
    } catch (error) {
      console.error('Error saving:', error)
      alert('Failed to save item')
    }
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-ocean-blue text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-blue-200 text-sm">Welcome, {user?.email}</p>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 bg-white text-ocean-blue px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors font-medium"
            >
              <FiLogOut />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8">
            <button
              onClick={() => {
                setActiveTab('carousel')
                setShowForm(false)
                setEditingItem(null)
              }}
              className={`py-4 px-2 border-b-2 font-medium transition-colors ${
                activeTab === 'carousel'
                  ? 'border-ocean-blue text-ocean-blue'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Carousel Ads
            </button>
            <button
              onClick={() => {
                setActiveTab('projects')
                setShowForm(false)
                setEditingItem(null)
              }}
              className={`py-4 px-2 border-b-2 font-medium transition-colors ${
                activeTab === 'projects'
                  ? 'border-ocean-blue text-ocean-blue'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Projects
            </button>
            <button
              onClick={() => {
                setActiveTab('contact')
                setShowForm(false)
                setEditingItem(null)
              }}
              className={`py-4 px-2 border-b-2 font-medium transition-colors ${
                activeTab === 'contact'
                  ? 'border-ocean-blue text-ocean-blue'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Contact Info
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-ocean-blue"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        ) : (
          <>
            {activeTab === 'contact' ? (
              <ContactInfoForm
                contactInfo={contactInfo}
                onSave={async (data) => {
                  const result = await updateContactInfo(data)
                  if (result.success) {
                    alert('Contact information updated successfully!')
                    loadData()
                  } else {
                    alert('Failed to update contact information: ' + result.error)
                  }
                }}
              />
            ) : (
              <>
                {/* Add Button */}
                <div className="mb-6 flex justify-end">
                  <button
                    onClick={() => {
                      setEditingItem(null)
                      setShowForm(true)
                    }}
                    className="flex items-center gap-2 bg-ocean-blue text-white px-6 py-3 rounded-lg hover:bg-ocean-blue-dark transition-colors font-medium"
                  >
                    <FiPlus />
                    Add {activeTab === 'carousel' ? 'Carousel Ad' : 'Project'}
                  </button>
                </div>

                {/* Form Modal */}
                {showForm && (
                  <ItemForm
                    item={editingItem}
                    type={activeTab}
                    onSave={handleSave}
                    onCancel={() => {
                      setShowForm(false)
                      setEditingItem(null)
                    }}
                  />
                )}

                {/* List */}
                {activeTab === 'carousel' ? (
                  <CarouselList
                    ads={carouselAds}
                    onEdit={(ad) => {
                      setEditingItem(ad)
                      setShowForm(true)
                    }}
                    onDelete={(id) => handleDelete(id, 'carousel')}
                  />
                ) : (
                  <ProjectsList
                    projects={projects}
                    onEdit={(project) => {
                      setEditingItem(project)
                      setShowForm(true)
                    }}
                    onDelete={(id) => handleDelete(id, 'projects')}
                  />
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}

// Contact Info Form Component
function ContactInfoForm({ contactInfo, onSave }) {
  const [formData, setFormData] = useState({
    email: contactInfo.email || '',
    phone: contactInfo.phone || '',
    address: contactInfo.address || '',
    socialLinks: {
      facebook: contactInfo.socialLinks?.facebook || '',
      twitter: contactInfo.socialLinks?.twitter || '',
      instagram: contactInfo.socialLinks?.instagram || '',
      linkedin: contactInfo.socialLinks?.linkedin || '',
      github: contactInfo.socialLinks?.github || '',
      youtube: contactInfo.socialLinks?.youtube || '',
    },
  })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await onSave(formData)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-ocean-blue focus:border-ocean-blue"
              placeholder="contact@codeskytz.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="text"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-ocean-blue focus:border-ocean-blue"
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <textarea
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-ocean-blue focus:border-ocean-blue"
              placeholder="123 Tech Street, Digital City, DC 12345"
            />
          </div>

          {/* Social Links Section */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Media Links</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Facebook URL
                </label>
                <input
                  type="url"
                  value={formData.socialLinks.facebook}
                  onChange={(e) => setFormData({
                    ...formData,
                    socialLinks: { ...formData.socialLinks, facebook: e.target.value }
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-ocean-blue focus:border-ocean-blue"
                  placeholder="https://facebook.com/yourpage"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Twitter URL
                </label>
                <input
                  type="url"
                  value={formData.socialLinks.twitter}
                  onChange={(e) => setFormData({
                    ...formData,
                    socialLinks: { ...formData.socialLinks, twitter: e.target.value }
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-ocean-blue focus:border-ocean-blue"
                  placeholder="https://twitter.com/yourhandle"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instagram URL
                </label>
                <input
                  type="url"
                  value={formData.socialLinks.instagram}
                  onChange={(e) => setFormData({
                    ...formData,
                    socialLinks: { ...formData.socialLinks, instagram: e.target.value }
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-ocean-blue focus:border-ocean-blue"
                  placeholder="https://instagram.com/yourhandle"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  LinkedIn URL
                </label>
                <input
                  type="url"
                  value={formData.socialLinks.linkedin}
                  onChange={(e) => setFormData({
                    ...formData,
                    socialLinks: { ...formData.socialLinks, linkedin: e.target.value }
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-ocean-blue focus:border-ocean-blue"
                  placeholder="https://linkedin.com/company/yourcompany"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  GitHub URL
                </label>
                <input
                  type="url"
                  value={formData.socialLinks.github}
                  onChange={(e) => setFormData({
                    ...formData,
                    socialLinks: { ...formData.socialLinks, github: e.target.value }
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-ocean-blue focus:border-ocean-blue"
                  placeholder="https://github.com/yourusername"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  YouTube URL
                </label>
                <input
                  type="url"
                  value={formData.socialLinks.youtube}
                  onChange={(e) => setFormData({
                    ...formData,
                    socialLinks: { ...formData.socialLinks, youtube: e.target.value }
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-ocean-blue focus:border-ocean-blue"
                  placeholder="https://youtube.com/@yourchannel"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 bg-ocean-blue text-white px-6 py-3 rounded-lg hover:bg-ocean-blue-dark transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <FiLoader className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <FiSave />
                  Save Contact Info
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Carousel List Component
function CarouselList({ ads, onEdit, onDelete }) {
  if (ads.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
        <p className="text-gray-600">No carousel ads found. Add one to get started.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {ads.map((ad) => (
        <div key={ad.id} className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{ad.title}</h3>
            <p className="text-gray-600 text-sm mb-2">{ad.description}</p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className={`px-2 py-1 rounded ${ad.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                {ad.isActive ? 'Active' : 'Inactive'}
              </span>
              <span>Order: {ad.order || 0}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(ad)}
              className="flex-1 flex items-center justify-center gap-2 bg-ocean-blue text-white px-4 py-2 rounded-lg hover:bg-ocean-blue-dark transition-colors"
            >
              <FiEdit />
              Edit
            </button>
            <button
              onClick={() => onDelete(ad.id)}
              className="flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              <FiTrash2 />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

// Projects List Component
function ProjectsList({ projects, onEdit, onDelete }) {
  if (projects.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
        <p className="text-gray-600">No projects found. Add one to get started.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <div key={project.id} className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h3>
            <p className="text-gray-600 text-sm mb-2">{project.description}</p>
            <div className="flex flex-wrap gap-1 mb-2">
              {(project.tech || []).slice(0, 3).map((tech, i) => (
                <span key={i} className="bg-ocean-blue text-white text-xs px-2 py-1 rounded">
                  {tech}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className={`px-2 py-1 rounded ${project.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                {project.isActive ? 'Active' : 'Inactive'}
              </span>
              <span>Order: {project.order || 0}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(project)}
              className="flex-1 flex items-center justify-center gap-2 bg-ocean-blue text-white px-4 py-2 rounded-lg hover:bg-ocean-blue-dark transition-colors"
            >
              <FiEdit />
              Edit
            </button>
            <button
              onClick={() => onDelete(project.id)}
              className="flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              <FiTrash2 />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

// Form Component
function ItemForm({ item, type, onSave, onCancel }) {
  const [formData, setFormData] = useState(
    item || {
      title: '',
      description: '',
      image: '',
      link: '',
      order: 0,
      isActive: true,
      ...(type === 'projects' ? { tech: [], codeLink: '' } : {}),
    }
  )
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [imagePreview, setImagePreview] = useState(formData.image || '')

  const handleFileSelect = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validate file
    const validation = validateImageFile(file)
    if (!validation.valid) {
      setUploadError(validation.error)
      return
    }

    setUploadError('')
    setUploading(true)

    try {
      const result = await uploadImage(file)
      if (result.success) {
        setFormData({ ...formData, image: result.url })
        setImagePreview(result.url)
        setUploadError('')
      } else {
        setUploadError(result.error || 'Failed to upload image')
      }
    } catch (error) {
      setUploadError(error.message || 'Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData, type)
  }

  // Update preview when image URL changes manually
  useEffect(() => {
    setImagePreview(formData.image || '')
  }, [formData.image])

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {item ? 'Edit' : 'Add'} {type === 'carousel' ? 'Carousel Ad' : 'Project'}
            </h2>
            <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
              <FiX size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-ocean-blue focus:border-ocean-blue"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-ocean-blue focus:border-ocean-blue"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image
              </label>
              
              {/* Image Preview */}
              {imagePreview && (
                <div className="mb-4">
                  {imagePreview.startsWith('http://') || imagePreview.startsWith('https://') || imagePreview.startsWith('/') ? (
                    <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-300">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={() => setImagePreview('')}
                      />
                    </div>
                  ) : (
                    <div className={`w-full h-48 rounded-lg border border-gray-300 flex items-center justify-center ${imagePreview}`}>
                      <span className="text-gray-500 text-sm">Background Color Preview</span>
                    </div>
                  )}
                </div>
              )}

              {/* Upload Button */}
              <div className="mb-2">
                <label className="flex items-center justify-center gap-2 bg-ocean-blue text-white px-4 py-2 rounded-lg hover:bg-ocean-blue-dark transition-colors cursor-pointer font-medium">
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    onChange={handleFileSelect}
                    disabled={uploading}
                    className="hidden"
                  />
                  {uploading ? (
                    <>
                      <FiLoader className="animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <FiUpload />
                      Upload Image
                    </>
                  )}
                </label>
              </div>

              {/* Error Message */}
              {uploadError && (
                <div className="mb-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  {uploadError}
                </div>
              )}

              {/* Manual URL Input */}
              <div className="text-xs text-gray-500 mb-2 text-center">OR</div>
              <input
                type="text"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="Enter image URL or Tailwind class (e.g., bg-ocean-blue)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-ocean-blue focus:border-ocean-blue"
              />
              <p className="mt-1 text-xs text-gray-500">
                Upload an image or enter a URL/image link. You can also use Tailwind classes like 'bg-ocean-blue'
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Link</label>
              <input
                type="text"
                value={formData.link || ''}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                placeholder="https://example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-ocean-blue focus:border-ocean-blue"
              />
            </div>

            {type === 'projects' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Code Link</label>
                <input
                  type="text"
                  value={formData.codeLink || ''}
                  onChange={(e) => setFormData({ ...formData, codeLink: e.target.value })}
                  placeholder="https://github.com/..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-ocean-blue focus:border-ocean-blue"
                />
              </div>
            )}

            {type === 'projects' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Technologies (comma-separated)
                </label>
                <input
                  type="text"
                  value={(formData.tech || []).join(', ')}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tech: e.target.value.split(',').map((t) => t.trim()).filter(Boolean),
                    })
                  }
                  placeholder="React, Node.js, MongoDB"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-ocean-blue focus:border-ocean-blue"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
                <input
                  type="number"
                  value={formData.order || 0}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-ocean-blue focus:border-ocean-blue"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={formData.isActive ? 'active' : 'inactive'}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'active' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-ocean-blue focus:border-ocean-blue"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="flex-1 flex items-center justify-center gap-2 bg-ocean-blue text-white px-6 py-3 rounded-lg hover:bg-ocean-blue-dark transition-colors font-medium"
              >
                <FiSave />
                Save
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

