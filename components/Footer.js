'use client'

import { useState, useEffect } from 'react'
import { FiGithub, FiTwitter, FiLinkedin, FiMail, FiFacebook, FiInstagram, FiYoutube } from 'react-icons/fi'
import { getContactInfo } from '@/lib/services/contactService'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const [socialLinks, setSocialLinks] = useState([])

  useEffect(() => {
    const fetchSocialLinks = async () => {
      try {
        const result = await getContactInfo()
        if (result.success && result.data?.socialLinks) {
          const links = []
          const { socialLinks: sl } = result.data
          
          if (sl.facebook) links.push({ icon: FiFacebook, href: sl.facebook, label: 'Facebook' })
          if (sl.twitter) links.push({ icon: FiTwitter, href: sl.twitter, label: 'Twitter' })
          if (sl.instagram) links.push({ icon: FiInstagram, href: sl.instagram, label: 'Instagram' })
          if (sl.linkedin) links.push({ icon: FiLinkedin, href: sl.linkedin, label: 'LinkedIn' })
          if (sl.github) links.push({ icon: FiGithub, href: sl.github, label: 'GitHub' })
          if (sl.youtube) links.push({ icon: FiYoutube, href: sl.youtube, label: 'YouTube' })
          
          setSocialLinks(links)
        }
      } catch (error) {
        console.error('Error fetching social links:', error)
      }
    }

    fetchSocialLinks()
  }, [])

  return (
    <footer className="w-full bg-gray-900 dark:bg-gray-950 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">CODESKYTZ</h3>
            <p className="text-gray-400">
              Building exceptional software solutions for businesses worldwide.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#home" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Services</a></li>
              <li><a href="#portfolio" className="hover:text-white transition-colors">Portfolio</a></li>
              <li><a href="#about" className="hover:text-white transition-colors">About</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Connect With Us</h4>
            <div className="flex gap-4 flex-wrap">
              {socialLinks.length > 0 ? (
                socialLinks.map((social, index) => {
                  const IconComponent = social.icon
                  return (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="bg-gray-800 p-3 rounded-lg hover:bg-ocean-blue transition-colors duration-200"
                    >
                      <IconComponent size={20} />
                    </a>
                  )
                })
              ) : (
                <p className="text-gray-400 text-sm">No social links available</p>
              )}
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>&copy; {currentYear} CODESKYTZ. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

