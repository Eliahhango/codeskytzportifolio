"use client"
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function Ads() {
  const [ads, setAds] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    async function loadAds() {
      setLoading(true)
      try {
        const res = await fetch('/api/ads')
        const data = await res.json()
        if (mounted) {
          // Filter only active ads
          const activeAds = Array.isArray(data) ? data.filter(ad => ad.active) : []
          setAds(activeAds.slice(0, 3)) // Show max 3 ads
        }
      } catch (error) {
        console.error('Error loading ads:', error)
        if (mounted) setAds([])
      } finally {
        if (mounted) setLoading(false)
      }
    }
    loadAds()
    return () => { mounted = false }
  }, [])

  if (loading) {
    return (
      <section className="py-8 bg-gray-50 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-center py-8">
            <FontAwesomeIcon icon="gears" className="animate-spin text-2xl text-cyan" />
          </div>
        </div>
      </section>
    )
  }

  if (ads.length === 0) {
    return null // Don't show section if no active ads
  }

  return (
    <section className="py-8 bg-gray-50 dark:bg-slate-800">
      <div className="w-full max-w-none mx-auto px-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Featured</h2>
          <p className="text-gray-600 dark:text-gray-300">Check out our latest offerings and updates</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ads.map(ad => (
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
              </div>

              {/* Ad Content */}
              <div className="p-4">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                  {ad.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                  {ad.description}
                </p>

                {ad.link_url && (
                  <a
                    href={ad.link_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 text-sm font-medium"
                  >
                    Learn More
                    <FontAwesomeIcon icon="arrow-right" className="ml-2 text-xs" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}