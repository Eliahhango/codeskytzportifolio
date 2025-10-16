"use client"

import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'

export default function Services(){
  const [mounted, setMounted] = useState(false)
  const [hoveredCard, setHoveredCard] = useState(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const services = [
    {
      id: 'web',
      title: 'Web Development',
      subtitle: 'Modern & Scalable',
      desc: 'Custom web applications, SPAs, SSR solutions, and performant frontends built with the latest technologies.',
      icon: 'laptop-code',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20',
      features: ['React/Next.js', 'TypeScript', 'Responsive Design', 'Performance Optimized']
    },
    {
      id: 'security',
      title: 'System Security',
      subtitle: 'Fortified & Protected',
      desc: 'Comprehensive security solutions including penetration testing, system hardening, and security audits.',
      icon: 'shield-alt',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
      features: ['Penetration Testing', 'Security Audits', 'Vulnerability Assessment', 'Compliance']
    },
    {
      id: 'ai',
      title: 'AI Solutions',
      subtitle: 'Intelligent & Automated',
      desc: 'Advanced AI integrations, machine learning models, and intelligent automation pipelines.',
      icon: 'robot',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20',
      features: ['Machine Learning', 'Natural Language Processing', 'Computer Vision', 'Predictive Analytics']
    }
  ]

  return (
    <section id="services" className="py-16 lg:py-24 bg-gray-50 dark:bg-slate-800/50">
      <div className="w-full mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className={`text-center mb-16 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} transition-all duration-700`}>
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-cyan/10 to-primary/10 rounded-full border border-cyan/20 mb-6">
            <FontAwesomeIcon icon="rocket" className="text-cyan mr-2" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">What We Do</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-gray-900 dark:text-white">Comprehensive </span>
            <span className="bg-gradient-to-r from-primary to-cyan bg-clip-text text-transparent">Digital Solutions</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            From concept to deployment, we deliver end-to-end solutions that drive your business forward with cutting-edge technology and innovative approaches.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={service.id}
              className={`group relative ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} transition-all duration-700`}
              style={{ transitionDelay: `${index * 200}ms` }}
              onMouseEnter={() => setHoveredCard(service.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Card Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${service.bgColor} rounded-2xl transition-all duration-300 group-hover:scale-105`}></div>

              {/* Glow Effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300 blur-xl`}></div>

              {/* Card Content */}
              <div className="relative p-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2">
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${service.color} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <FontAwesomeIcon icon={service.icon} className="text-white text-2xl" />
                </div>

                {/* Content */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{service.title}</h3>
                    <p className={`text-sm font-medium bg-gradient-to-r ${service.color} bg-clip-text text-transparent`}>
                      {service.subtitle}
                    </p>
                  </div>

                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {service.desc}
                  </p>

                  {/* Features */}
                  <div className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <FontAwesomeIcon icon="check" className="text-green-500 mr-3 text-xs" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <div className="pt-4">
                    <Link
                      href={`/services/${service.id}`}
                      className={`inline-flex items-center px-6 py-3 bg-gradient-to-r ${service.color} text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-200 group-hover:shadow-xl`}
                    >
                      <span>Learn More</span>
                      <FontAwesomeIcon icon="arrow-right" className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>

                {/* Hover Indicator */}
                <div className={`absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                  <div className={`w-2 h-2 bg-gradient-to-r ${service.color} rounded-full animate-pulse`}></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className={`text-center mt-16 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} transition-all duration-700 delay-500`}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Ready to Start Your Project?</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              Let's discuss your requirements and build something amazing together. Our team is ready to bring your vision to life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-primary to-cyan text-white font-semibold rounded-xl hover:from-primary/90 hover:to-cyan/90 focus:ring-2 focus:ring-cyan focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <FontAwesomeIcon icon="calendar" className="mr-2" />
                <span>Schedule Consultation</span>
              </Link>
              <Link
                href="#portfolio"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:border-primary hover:text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200"
              >
                <FontAwesomeIcon icon="eye" className="mr-2" />
                <span>View Our Work</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
