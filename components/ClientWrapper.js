"use client"
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import { AdminProvider } from '../lib/adminContext'

export default function ClientWrapper({ children }) {
  const [isClient, setIsClient] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return <main>{children}</main>
  }

  const isAdminPage = pathname?.startsWith('/admin')

  if (isAdminPage) {
    return (
      <AdminProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
          {children}
        </div>
      </AdminProvider>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  )
}