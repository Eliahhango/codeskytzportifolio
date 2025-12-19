'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { onAuthChange, getCurrentUser, logout } from '@/lib/services/authService'
import AdminDashboard from '@/components/AdminDashboard'

export default function AdminPage() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check authentication state
    const unsubscribe = onAuthChange((currentUser) => {
      if (currentUser) {
        setUser(currentUser)
      } else {
        setUser(null)
        // Redirect to login if not authenticated
        router.push('/admin/login')
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [router])

  const handleLogout = async () => {
    await logout()
    router.push('/admin/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-ocean-blue"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminDashboard user={user} onLogout={handleLogout} />
    </div>
  )
}

