"use client"

import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState, useEffect } from 'react'

export default function Footer(){
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const currentYear = new Date().getFullYear()

  const footerLinks = {
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Our Team', href: '/founders' },
      { name: 'Careers', href: '/careers' },
      { name: 'Contact', href: '/contact' }
    ],
    services: [
      { name: 'Web Development', href: '/services/web' },
      { name: 'AI Solutions', href: '/services/ai' },
      { name: 'Security Services', href: '/services/security' },
      { name: 'Consulting', href: '/services/consulting' }
    ],
    resources: [
      { name: 'Portfolio', href: '/portfolio' },
      { name: 'Reviews', href: '/reviews' },
      { name: 'Blog', href: '/blog' },
      { name: 'Documentation', href: '/docs' }
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Cookie Policy', href: '/cookies' },
      { name: 'GDPR', href: '/gdpr' }
    ]
  }

  const socialLinks = [
    { name: 'GitHub', icon: 'github', href: 'https://github.com/codeskytz' },
    { name: 'LinkedIn', icon: 'linkedin', href: 'https://linkedin.com/company/codeskytz' },
    { name: 'Twitter', icon: 'twitter', href: 'https://twitter.com/codeskytz' },
    { name: 'Email', icon: 'envelope', href: 'mailto:contact@codeskytz.com' }
  ]

  return (
    <footer className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-800 border-t border-gray-200 dark:border-gray-700">
      <div className="w-full mx-auto px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className={`py-16 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} transition-all duration-700`}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-cyan rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">CS</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Codeskytz</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Innovation With No Limit</p>
                </div>
              </div>

              <p className="text-gray-600 dark:text-gray-300 leading-relaxed max-w-md">
                We build secure, scalable web applications, AI-powered solutions, and comprehensive digital experiences that drive business growth and technological advancement.
              </p>

              {/* Social Links */}
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-white dark:bg-slate-800 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gradient-to-r hover:from-primary hover:to-cyan hover:text-white transition-all duration-200 shadow-sm hover:shadow-md"
                    aria-label={social.name}
                  >
                    <FontAwesomeIcon icon={social.icon} />
                  </a>
                ))}
              </div>
            </div>

            {/* Footer Links */}
            <div className="space-y-8">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Company</h4>
                <ul className="space-y-3">
                  {footerLinks.company.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-cyan transition-colors duration-200"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Services</h4>
                <ul className="space-y-3">
                  {footerLinks.services.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-cyan transition-colors duration-200"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Resources</h4>
                <ul className="space-y-3">
                  {footerLinks.resources.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-cyan transition-colors duration-200"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Legal</h4>
                <ul className="space-y-3">
                  {footerLinks.legal.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-cyan transition-colors duration-200"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className={`py-8 border-t border-gray-200 dark:border-gray-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} transition-all duration-700 delay-200`}>
          <div className="max-w-md mx-auto text-center">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Stay Updated</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Subscribe to our newsletter for the latest updates and insights.
            </p>
            <div className="flex gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan focus:border-transparent transition-all duration-200"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-primary to-cyan text-white font-semibold rounded-lg hover:from-primary/90 hover:to-cyan/90 focus:ring-2 focus:ring-cyan focus:ring-offset-2 transition-all duration-200 shadow-lg">
                <FontAwesomeIcon icon="paper-plane" className="text-sm" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={`py-6 border-t border-gray-200 dark:border-gray-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} transition-all duration-700 delay-300`}>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-600 dark:text-gray-400 text-center md:text-left">
              © {currentYear} Codeskytz. All rights reserved. Built with ❤️ using Next.js & Tailwind CSS.
            </div>

            {/* Back to Top */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-primary hover:to-cyan hover:text-white rounded-lg transition-all duration-200"
            >
              <FontAwesomeIcon icon="arrow-up" className="mr-2" />
              <span className="text-sm font-medium">Back to Top</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
