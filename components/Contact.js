'use client'

import { useState, useEffect } from 'react'
import { FiMail, FiPhone, FiMapPin, FiSend } from 'react-icons/fi'
import { getContactInfo } from '@/lib/services/contactService'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [contactInfo, setContactInfo] = useState({
    email: 'contact@codeskytz.com',
    phone: '+1 (555) 123-4567',
    address: '123 Tech Street, Digital City, DC 12345',
    socialLinks: {
      facebook: '',
      twitter: '',
      instagram: '',
      linkedin: '',
      github: '',
      youtube: '',
    },
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const result = await getContactInfo()
        if (result.success && result.data) {
          setContactInfo(result.data)
        }
      } catch (error) {
        console.error('Error fetching contact info:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchContactInfo()
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission here
    console.log('Form submitted:', formData)
    alert('Thank you for your message! We will get back to you soon.')
    setFormData({ name: '', email: '', message: '' })
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <section id="contact" className="w-full bg-white/80 dark:bg-gray-900/90 dark:backdrop-blur-md backdrop-blur-sm py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Get In Touch
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Have a project in mind? Let's discuss how we can help bring it to life.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Contact Information
              </h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-ocean-blue dark:bg-blue-600 text-white p-3 rounded-lg">
                    <FiMail size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Email</h4>
                    <p className="text-gray-600 dark:text-gray-300">{loading ? 'Loading...' : contactInfo.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-ocean-blue dark:bg-blue-600 text-white p-3 rounded-lg">
                    <FiPhone size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Phone</h4>
                    <p className="text-gray-600 dark:text-gray-300">{loading ? 'Loading...' : contactInfo.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-ocean-blue dark:bg-blue-600 text-white p-3 rounded-lg">
                    <FiMapPin size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Address</h4>
                    <p className="text-gray-600 dark:text-gray-300">{loading ? 'Loading...' : contactInfo.address}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-gray-900 dark:text-white font-medium mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-ocean-blue focus:border-transparent outline-none"
                    placeholder="Your Name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-gray-900 dark:text-white font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-ocean-blue focus:border-transparent outline-none"
                    placeholder="your.email@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-gray-900 dark:text-white font-medium mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-ocean-blue focus:border-transparent outline-none resize-none"
                    placeholder="Tell us about your project..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-ocean-blue dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold hover:bg-ocean-blue-dark transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  Send Message
                  <FiSend />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

