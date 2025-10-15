"use client"
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'

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
    return <main>{children}</main>
  }

  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  )
}