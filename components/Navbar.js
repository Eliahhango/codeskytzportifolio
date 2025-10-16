"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faSun, faMoon, faCog, faTimes, faBars, faHome, faUsers,
  faProjectDiagram, faComments, faUserTie, faEnvelope
} from '@fortawesome/free-solid-svg-icons'

export default function Navbar(){
  const [isAdmin, setIsAdmin] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)

    // Check for admin token
    const checkAdminStatus = () => {
      if (typeof window !== 'undefined') {
        const token = sessionStorage.getItem('admin_token')
        if (token) {
          try {
            const payload = JSON.parse(atob(token))
            if (payload.exp > Date.now() && payload.admin) {
              setIsAdmin(true)
            }
          } catch (error) {
            setIsAdmin(false)
          }
        } else {
          setIsAdmin(false)
        }
      }
    }

    checkAdminStatus()

    // Check for saved dark mode preference
    const savedDarkMode = localStorage.getItem('darkMode') === 'true'
    setDarkMode(savedDarkMode)
    if (savedDarkMode) {
      document.documentElement.classList.add('dark')
    }

    // Add scroll listener
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)

    // Listen for admin auth changes
    const handleAdminAuthChange = () => {
      checkAdminStatus()
    }
    window.addEventListener('admin-auth-update', handleAdminAuthChange)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('admin-auth-update', handleAdminAuthChange)
    }
  }, [])
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    localStorage.setItem('darkMode', newDarkMode.toString())
    if (newDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const scrollToSection = (sectionId) => {
    if (pathname !== '/') {
      window.location.href = `/#${sectionId}`
      return
    }

    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setOpen(false)
  }

  const navItems = [
    { name: 'Home', href: '/', id: 'home' },
    { name: 'About', href: '/about', id: 'about-us' },
    { name: 'Services', href: '/services', id: 'services' },
    { name: 'Portfolio', href: '/portfolio', id: 'portfolio' },
    { name: 'Reviews', href: '/reviews', id: 'reviews' },
    { name: 'Founders', href: '/founders', id: 'founders' },
    { name: 'Contact', href: '/contact', id: 'contact' }
  ]

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg shadow-lg'
        : 'bg-white/60 dark:bg-slate-900/60 backdrop-blur-md'
    } border-b border-gray-200 dark:border-gray-700`}>
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link
            href="/"
            className={`flex items-center gap-3 font-bold text-xl transition-all duration-200 hover:scale-105 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-primary to-cyan rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg lg:text-xl">CS</span>
            </div>
            <span className="text-gray-900 dark:text-white">Codeskytz</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className={`hidden lg:flex items-center space-x-1 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} transition-all duration-700 delay-200`}>
            {navItems.map((item, index) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={(e) => {
                    if (item.id && pathname === '/') {
                      e.preventDefault()
                      scrollToSection(item.id)
                    }
                  }}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-primary bg-primary/10'
                      : 'text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-primary/5'
                  }`}
                >
                  {item.name}
                  {isActive && (
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-gradient-to-r from-primary to-cyan rounded-full"></div>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Right Section */}
          <div className={`flex items-center space-x-4 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} transition-all duration-700 delay-300`}>
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700 transition-all duration-200"
              aria-label="Toggle dark mode"
            >
              <FontAwesomeIcon icon={darkMode ? faSun : faMoon} className="text-lg" />
            </button>

            {/* Admin Link - Only show if user is admin */}
            {isAdmin && (
              <Link
                href="/admin"
                className="hidden sm:inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary to-cyan text-white font-semibold rounded-lg hover:from-primary/90 hover:to-cyan/90 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <FontAwesomeIcon icon={faCog} className="mr-2" />
                <span>Admin</span>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setOpen(!open)}
              className="lg:hidden p-2 rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700 transition-all duration-200"
              aria-label="Toggle mobile menu"
            >
              <FontAwesomeIcon icon={open ? faTimes : faBars} className="text-lg" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden transition-all duration-300 ${
        open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      } overflow-hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-700`}>
        <div className="px-4 py-6 space-y-4">
          {navItems.map((item, index) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={(e) => {
                  if (item.id && pathname === '/') {
                    e.preventDefault()
                    scrollToSection(item.id)
                  }
                  setOpen(false)
                }}
                className={`block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-primary to-cyan text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800'
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <FontAwesomeIcon icon={
                  item.name === 'Home' ? faHome :
                  item.name === 'About' ? faUsers :
                  item.name === 'Services' ? faCog :
                  item.name === 'Portfolio' ? faProjectDiagram :
                  item.name === 'Reviews' ? faComments :
                  item.name === 'Founders' ? faUserTie :
                  faEnvelope
                } className="mr-3" />
                {item.name}
              </Link>
            )
          })}

          {/* Mobile Admin Link - Only show if user is admin */}
          {isAdmin && (
            <Link
              href="/admin"
              className="block px-4 py-3 bg-gradient-to-r from-primary to-cyan text-white font-semibold rounded-lg hover:from-primary/90 hover:to-cyan/90 transition-all duration-200 shadow-lg text-center mt-4"
              onClick={() => setOpen(false)}
            >
              <FontAwesomeIcon icon={faCog} className="mr-2" />
              Admin Panel
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
