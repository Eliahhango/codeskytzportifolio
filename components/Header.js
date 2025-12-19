'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { FiMenu, FiX, FiSettings } from 'react-icons/fi'
import { onAuthChange, getCurrentUser } from '@/lib/services/authService'
import { useTheme } from '@/contexts/ThemeContext'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const pathname = usePathname()
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    // Check if user is authenticated (admin)
    const unsubscribe = onAuthChange((user) => {
      setIsAdmin(!!user)
    })

    return () => unsubscribe()
  }, [])

  const navItems = [
    { name: 'Home', href: '/#home' },
    { name: 'Services', href: '/#services' },
    { name: 'Portfolio', href: '/#portfolio' },
    { name: 'About', href: '/#about' },
    { name: 'Contact', href: '/#contact' },
  ]

  // Don't show header on admin pages
  if (pathname?.startsWith('/admin')) {
    return null
  }

  return (
    <header className="w-full bg-ocean-blue shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl md:text-3xl font-bold text-white tracking-wide hover:text-blue-200 transition-colors">
            CODESKYTZ
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-white hover:text-blue-200 dark:hover:text-blue-300 transition-colors duration-200 font-medium"
              >
                {item.name}
              </a>
            ))}
            {/* Theme Toggle Switch - Desktop */}
            <label htmlFor="theme-switch" className="switch" title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}>
              <input 
                id="theme-switch" 
                type="checkbox" 
                checked={theme === 'dark'}
                onChange={toggleTheme}
                aria-label="Toggle theme"
              />
              <span className="slider"></span>
              <span className="decoration"></span>
            </label>
            {isAdmin && (
              <Link
                href="/admin"
                className="text-white hover:text-blue-200 dark:hover:text-blue-300 transition-colors duration-200 font-medium flex items-center gap-2"
              >
                <FiSettings />
                Admin
              </Link>
            )}
          </nav>

          {/* Mobile Header Actions */}
          <div className="flex items-center gap-4 md:hidden">
            {/* Theme Toggle Switch - Mobile (visible in header) */}
            <label htmlFor="theme-switch-mobile" className="switch" title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}>
              <input 
                id="theme-switch-mobile" 
                type="checkbox" 
                checked={theme === 'dark'}
                onChange={toggleTheme}
                aria-label="Toggle theme"
              />
              <span className="slider"></span>
              <span className="decoration"></span>
            </label>
            {/* Mobile Menu Button */}
            <button
              className="text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-white hover:text-blue-200 dark:hover:text-blue-300 transition-colors duration-200 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              {isAdmin && (
                <Link
                  href="/admin"
                  className="text-white hover:text-blue-200 dark:hover:text-blue-300 transition-colors duration-200 font-medium flex items-center gap-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FiSettings />
                  Admin
                </Link>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}

