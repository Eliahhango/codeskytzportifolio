"use client"
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAdmin } from '../../../lib/adminContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

async function fetchAds() {
  const response = await fetch('/api/ads')
  if (!response.ok) return []
  const data = await response.json()
  return data || []
}

export default function AdminAds() {
  const { isAdmin, isLoading } = useAdmin()
  const [ads, setAds] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (!isAdmin) return

    const loadAds = async () => {
      setLoading(true)
      try {
        const adsData = await fetchAds()
        setAds(adsData)
      } catch (error) {
        console.error('Error loading ads:', error)
      } finally {
        setLoading(false)
      }
    }

    loadAds()
  }, [isAdmin])

  const filteredAds = ads.filter(ad =>
    ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ad.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (ad.position && ad.position.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  async function deleteAd(id) {
    if (!confirm('Are you sure you want to delete this ad? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/ads/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setAds(ads => ads.filter(a => a.id !== id))
      } else {
        alert('Failed to delete ad')
      }
    } catch (error) {
      console.error('Error deleting ad:', error)
      alert('Error deleting ad')
    }
  }

  async function toggleAdStatus(id, currentStatus) {
    try {
      const response = await fetch(`/api/ads/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          active: !currentStatus
        })
      })

      if (response.ok) {
        setAds(ads => ads.map(ad =>
          ad.id === id ? { ...ad, active: !currentStatus } : ad
        ))
      } else {
        alert('Failed to update ad status')
      }
    } catch (error) {
      console.error('Error updating ad status:', error)
      alert('Error updating ad status')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FontAwesomeIcon icon="cog" className="animate-spin text-4xl text-cyan mx-auto mb-4" />
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Ads Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage advertisements and promotions</p>
        </div>
        <Link
          href="/admin/ads/new"
          className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2"
        >
          <span>➕</span>
          <span>Add Ad</span>
        </Link>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search ads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan focus:border-transparent dark:bg-slate-700 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Ads List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <FontAwesomeIcon icon="cog" className="animate-spin text-2xl text-cyan" />
        </div>
      ) : (
        <>
          {filteredAds.length === 0 ? (
            <div className="text-center py-12">
              <FontAwesomeIcon icon="bullhorn" className="text-gray-400 text-6xl mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No ads found</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating your first advertisement.'}
              </p>
              {!searchTerm && (
                <Link
                  href="/admin/ads/new"
                  className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
                >
                  Create First Ad
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAds.map(ad => (
                <div key={ad.id} className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200">
                  {/* Ad Image */}
                  <div className="relative w-full h-48 bg-gray-200 dark:bg-slate-700">
                    {ad.image_url ? (
                      <img
                        src={ad.image_url}
                        alt={ad.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-purple-600">
                        <FontAwesomeIcon icon="bullhorn" className="text-white text-4xl" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        ad.active
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                          : 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400'
                      }`}>
                        {ad.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>

                  {/* Ad Content */}
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 line-clamp-1">
                      {ad.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                      {ad.description}
                    </p>

                    <div className="mb-3">
                      <span className="inline-block px-2 py-1 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded">
                        {ad.position || 'General'}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleAdStatus(ad.id, ad.active)}
                        className={`flex-1 px-3 py-2 text-sm rounded transition-colors text-center ${
                          ad.active
                            ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-200 dark:hover:bg-yellow-900/50'
                            : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50'
                        }`}
                      >
                        {ad.active ? 'Deactivate' : 'Activate'}
                      </button>
                      <Link
                        href={`/admin/ads/edit/${ad.id}`}
                        className="flex-1 px-3 py-2 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors text-center"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => deleteAd(ad.id)}
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
          <span>Total Ads: {ads.length}</span>
          <span>Active: {ads.filter(a => a.active).length}</span>
          <span>Showing: {filteredAds.length}</span>
        </div>
      </div>
    </div>
  )
}