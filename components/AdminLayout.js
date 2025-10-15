"use client"
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AdminProvider, useAdmin } from '../lib/adminContext'

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: '📊' },
  { name: 'Projects', href: '/admin/projects', icon: '🚀' },
  { name: 'Founders', href: '/admin/founders', icon: '👥' },
  { name: 'Comments', href: '/admin/comments', icon: '💬' },
  { name: 'Contact Forms', href: '/admin/contacts', icon: '📧' },
  { name: 'Ads Management', href: '/admin/ads', icon: '🎯' },
  { name: 'Settings', href: '/admin/settings', icon: '⚙️' },
]

function AdminLayoutContent({ children }) {
  const [isClient, setIsClient] = useState(false)
  const { isAdmin, isLoading } = useAdmin()
  const pathname = usePathname()

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Show loading only for authenticated pages
  if (!isClient || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  // If not authenticated and not on login page, show access denied
  if (!isAdmin && pathname !== '/admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
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

  // For login page, don't show navigation
  if (pathname === '/admin') {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Main content - full width */}
      <div className="min-h-screen">
        {/* Page content */}
        <main>
          {children}
        </main>
      </div>
    </div>
  )
}

export default function AdminLayout({ children }) {
  return (
    <AdminProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AdminProvider>
  )
}