"use client"
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAdmin } from '../../../lib/adminContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function AdminSettings() {
  const { isAdmin, isLoading } = useAdmin()
  const [settings, setSettings] = useState({
    siteName: 'Codesky',
    siteDescription: 'Professional portfolio and business website',
    contactEmail: 'contact@codesky.com',
    phoneNumber: '+1 (555) 123-4567',
    address: '123 Business Ave, Tech City, TC 12345',
    socialLinks: {
      twitter: '',
      linkedin: '',
      github: '',
      facebook: ''
    },
    seoSettings: {
      metaTitle: 'Codesky - Professional Portfolio',
      metaDescription: 'Professional portfolio showcasing web development and digital solutions',
      keywords: 'web development, portfolio, digital solutions, technology'
    },
    maintenanceMode: false,
    allowRegistrations: true,
    emailNotifications: true
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!isAdmin) return

    // Load current settings (this would typically come from an API)
    const loadSettings = async () => {
      try {
        // const response = await fetch('/api/settings')
        // if (response.ok) {
        //   const data = await response.json()
        //   setSettings({ ...settings, ...data })
        // }
      } catch (error) {
        console.error('Error loading settings:', error)
      }
    }

    loadSettings()
  }, [isAdmin])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      // const response = await fetch('/api/settings', {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(settings)
      // })

      // if (response.ok) {
      //   setMessage('Settings saved successfully!')
      // } else {
      //   setMessage('Failed to save settings')
      // }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setMessage('Settings saved successfully!')
    } catch (error) {
      console.error('Error saving settings:', error)
      setMessage('Error saving settings')
    } finally {
      setLoading(false)
    }
  }

  const updateSetting = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const updateNestedSetting = (parent, key, value) => {
    setSettings(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [key]: value
      }
    }))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FontAwesomeIcon icon="gears" className="animate-spin text-4xl text-cyan mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-white dark:bg-slate-900 rounded-lg shadow">
          <FontAwesomeIcon icon="exclamation-triangle" className="text-red-500 text-6xl mb-4" />
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Site Settings</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Configure your website settings and preferences</p>
        </div>
      </div>

      {/* Settings Form */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes('success')
              ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
              : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
          }`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* General Settings */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">General Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Site Name
                </label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) => updateSetting('siteName', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan focus:border-transparent dark:bg-slate-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Contact Email
                </label>
                <input
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => updateSetting('contactEmail', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan focus:border-transparent dark:bg-slate-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={settings.phoneNumber}
                  onChange={(e) => updateSetting('phoneNumber', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan focus:border-transparent dark:bg-slate-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Site Description
                </label>
                <textarea
                  rows={3}
                  value={settings.siteDescription}
                  onChange={(e) => updateSetting('siteDescription', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan focus:border-transparent dark:bg-slate-700 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* SEO Settings */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">SEO Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Meta Title
                </label>
                <input
                  type="text"
                  value={settings.seoSettings.metaTitle}
                  onChange={(e) => updateNestedSetting('seoSettings', 'metaTitle', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan focus:border-transparent dark:bg-slate-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Meta Description
                </label>
                <textarea
                  rows={3}
                  value={settings.seoSettings.metaDescription}
                  onChange={(e) => updateNestedSetting('seoSettings', 'metaDescription', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan focus:border-transparent dark:bg-slate-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Keywords (comma-separated)
                </label>
                <input
                  type="text"
                  value={settings.seoSettings.keywords}
                  onChange={(e) => updateNestedSetting('seoSettings', 'keywords', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan focus:border-transparent dark:bg-slate-700 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Social Media Links</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Twitter
                </label>
                <input
                  type="url"
                  value={settings.socialLinks.twitter}
                  onChange={(e) => updateNestedSetting('socialLinks', 'twitter', e.target.value)}
                  placeholder="https://twitter.com/username"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan focus:border-transparent dark:bg-slate-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  LinkedIn
                </label>
                <input
                  type="url"
                  value={settings.socialLinks.linkedin}
                  onChange={(e) => updateNestedSetting('socialLinks', 'linkedin', e.target.value)}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan focus:border-transparent dark:bg-slate-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  GitHub
                </label>
                <input
                  type="url"
                  value={settings.socialLinks.github}
                  onChange={(e) => updateNestedSetting('socialLinks', 'github', e.target.value)}
                  placeholder="https://github.com/username"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan focus:border-transparent dark:bg-slate-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Facebook
                </label>
                <input
                  type="url"
                  value={settings.socialLinks.facebook}
                  onChange={(e) => updateNestedSetting('socialLinks', 'facebook', e.target.value)}
                  placeholder="https://facebook.com/username"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan focus:border-transparent dark:bg-slate-700 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* System Settings */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">System Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Maintenance Mode
                  </label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Enable to show maintenance page to visitors
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => updateSetting('maintenanceMode', !settings.maintenanceMode)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.maintenanceMode ? 'bg-red-600' : 'bg-gray-200 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Allow User Registrations
                  </label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Enable user registration functionality
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => updateSetting('allowRegistrations', !settings.allowRegistrations)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.allowRegistrations ? 'bg-green-600' : 'bg-gray-200 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.allowRegistrations ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email Notifications
                  </label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Receive email notifications for new contacts and comments
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => updateSetting('emailNotifications', !settings.emailNotifications)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.emailNotifications ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-cyan to-blue-600 text-white rounded-lg hover:from-cyan/90 hover:to-blue-600/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading && <FontAwesomeIcon icon="gears" className="animate-spin h-4 w-4" />}
              <span>{loading ? 'Saving...' : 'Save Settings'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}