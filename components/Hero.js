"use client"

import Link from 'next/link'
import { useEffect, useState, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function Hero(){
  const [ads, setAds] = useState([])
  const [index, setIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const ivRef = useRef(null)

  useEffect(() => {
    setMounted(true)
    let mounted = true
    setLoading(true)
    fetch('/api/ads').then(r=>r.json()).then(j=>{
      if(mounted) {
        setAds(Array.isArray(j) ? j.filter(ad => ad.active) : [])
        setLoading(false)
      }
    }).catch(()=>{
      if(mounted) setLoading(false)
    })
    return ()=>{ mounted=false }
  },[])

  useEffect(()=>{
    if(ivRef.current) clearInterval(ivRef.current)
    if(ads.length>1){
      ivRef.current = setInterval(()=> setIndex(i=> (i+1) % ads.length), 5000)
    }
    return ()=>{ if(ivRef.current) clearInterval(ivRef.current) }
  },[ads])

  function prev(){
    if(ads.length > 0) {
      setIndex(i=> (i-1+ads.length)%ads.length)
    }
  }
  function next(){
    if(ads.length > 0) {
      setIndex(i=> (i+1)%ads.length)
    }
  }

  const currentAd = ads[index]

  return (
    <section id="home" className="relative py-20 lg:py-28 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-cyan/5 to-purple-500/5"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-cyan/10 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-3xl"></div>

      <div className="relative w-full mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content Section */}
          <div className={`space-y-8 ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'} transition-all duration-1000`}>
            <div className="space-y-4">
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-cyan/10 to-primary/10 rounded-full border border-cyan/20">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">✨ Welcome to Codeskytz</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="text-gray-900 dark:text-white">Innovation</span>
                <br />
                <span className="bg-gradient-to-r from-primary to-cyan bg-clip-text text-transparent">With No Limit</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl">
                We build secure, performant web apps, AI integrations, and automation systems that scale with your business.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="#portfolio"
                className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-primary to-cyan text-white font-semibold rounded-xl hover:from-primary/90 hover:to-cyan/90 focus:ring-2 focus:ring-cyan focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <span>View Our Work</span>
                <FontAwesomeIcon icon="arrow-right" className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/contact"
                className="group inline-flex items-center justify-center px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:border-primary hover:text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200"
              >
                <FontAwesomeIcon icon="envelope" className="mr-2" />
                <span>Get In Touch</span>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200 dark:border-gray-700">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary">50+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Projects</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-cyan">5+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Years</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-purple-500">100%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Satisfaction</div>
              </div>
            </div>
          </div>

          {/* Visual Section */}
          <div className={`relative ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'} transition-all duration-1000 delay-300`}>
            <div className="relative">
              {/* Main showcase area */}
              <div className="relative w-full h-80 md:h-96 lg:h-[28rem] rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-primary/20 to-cyan/20 backdrop-blur-sm border border-white/20">
                {loading ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <FontAwesomeIcon icon="gears" className="animate-spin text-4xl text-cyan" />
                      <p className="text-gray-600 dark:text-gray-400">Loading showcase...</p>
                    </div>
                  </div>
                ) : ads.length === 0 ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary to-cyan rounded-full flex items-center justify-center mx-auto">
                        <FontAwesomeIcon icon="rocket" className="text-white text-2xl" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Featured Projects</h3>
                        <p className="text-gray-600 dark:text-gray-400">Discover our latest innovations</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative w-full h-full">
                    {ads.map((ad, idx) => (
                      <div
                        key={ad.id}
                        className={`absolute inset-0 transition-all duration-700 ${
                          idx === index ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                        }`}
                      >
                        <img
                          src={ad.image_url}
                          alt={ad.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                          <h3 className="text-xl font-bold mb-2">{ad.title}</h3>
                          <p className="text-sm opacity-90">{ad.description}</p>
                          {ad.link_url && (
                            <a
                              href={ad.link_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center mt-3 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors"
                            >
                              <span className="text-sm font-medium">Learn More</span>
                              <FontAwesomeIcon icon="external-link-alt" className="ml-2 text-xs" />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Navigation dots */}
                {ads.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                    {ads.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setIndex(idx)}
                        className={`w-2 h-2 rounded-full transition-all duration-200 ${
                          idx === index ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/70'
                        }`}
                        aria-label={`Go to slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-cyan/20 to-primary/20 rounded-full backdrop-blur-sm border border-white/20 animate-pulse"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-tr from-purple-500/10 to-cyan/10 rounded-full backdrop-blur-sm border border-white/10"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
