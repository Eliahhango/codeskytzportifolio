'use client'

import { useState, useEffect } from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

/**
 * Carousel component for displaying ads published by admin
 * 
 * @param {Array} ads - Array of ad objects from admin dashboard
 * @param {Object} ads[].id - Unique identifier for the ad
 * @param {String} ads[].title - Ad title/heading
 * @param {String} ads[].description - Ad description text
 * @param {String} ads[].image - Background image URL or Tailwind class (e.g., 'bg-ocean-blue' or image URL)
 * @param {String} ads[].link - Optional link URL for the CTA button
 */
export default function Carousel({ ads = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showContent, setShowContent] = useState(false)

  // If no ads provided, use placeholder data
  const defaultAds = [
    {
      id: 1,
      title: 'Welcome to CODESKYTZ',
      description: 'Building exceptional software solutions for your business',
      image: 'bg-ocean-blue',
      link: '#services',
    },
    {
      id: 2,
      title: 'Expert Development Team',
      description: 'Years of experience in modern technologies',
      image: 'bg-blue-600',
      link: '#portfolio',
    },
    {
      id: 3,
      title: 'Custom Solutions',
      description: 'Tailored software solutions for your unique needs',
      image: 'bg-blue-700',
      link: '#contact',
    },
  ]

  const displayAds = ads.length > 0 ? ads : defaultAds

  // Auto-play functionality - auto-scroll every 5 seconds if more than one ad
  useEffect(() => {
    if (displayAds.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % displayAds.length)
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(interval)
  }, [displayAds.length])

  // Reset content visibility when slide changes
  useEffect(() => {
    setShowContent(false)
  }, [currentIndex])

  const goToSlide = (index) => {
    setCurrentIndex(index)
  }

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? displayAds.length - 1 : prevIndex - 1
    )
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === displayAds.length - 1 ? 0 : prevIndex + 1
    )
  }

  if (displayAds.length === 0) {
    return null
  }

  const currentAd = displayAds[currentIndex]
  
  // Check if image is a URL or a Tailwind class
  const isImageUrl = currentAd.image && (
    currentAd.image.startsWith('http://') || 
    currentAd.image.startsWith('https://') ||
    currentAd.image.startsWith('/')
  )
  const backgroundClass = !isImageUrl ? (currentAd.image || 'bg-ocean-blue') : ''
  const backgroundImage = isImageUrl ? currentAd.image : null

  return (
    <section 
      className="w-full relative overflow-hidden mt-6 mb-6 px-4 md:px-8 lg:px-12"
      onMouseEnter={() => setShowContent(true)}
      onMouseLeave={() => setShowContent(false)}
      onTouchStart={() => setShowContent(true)}
    >
      {/* Container with 1080x360 (3:1) aspect ratio */}
      <div className="relative w-full max-w-7xl mx-auto" style={{ aspectRatio: '1080/360' }}>
        {/* Carousel Slide */}
        <div
          className={`w-full h-full ${backgroundClass} flex items-center justify-center transition-all duration-500 ease-in-out relative overflow-hidden`}
          style={
            backgroundImage
              ? {
                  backgroundImage: `url(${backgroundImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }
              : {}
          }
        >
          {/* Animated Background Patterns - Above background, below content */}
          <div className="carousel-pattern z-[1]"></div>
          <div className="carousel-pattern-grid z-[1]"></div>
          <div className="carousel-pattern-circles z-[1]"></div>
          
          {/* Overlay for better text readability on images - only show when content is visible */}
          {backgroundImage && showContent && (
            <div className="absolute inset-0 bg-black bg-opacity-40 transition-opacity duration-300 z-[5]"></div>
          )}
          
          {/* Content - only visible on hover/touch */}
          <div 
            className={`container mx-auto px-4 relative z-20 transition-opacity duration-300 ${
              showContent ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="max-w-3xl mx-auto text-center text-white">
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 drop-shadow-lg">
                {currentAd.title}
              </h2>
              <p className="text-lg md:text-xl lg:text-2xl mb-8 text-blue-100 drop-shadow-md">
                {currentAd.description}
              </p>
              {currentAd.link && (
                <a
                  href={currentAd.link}
                  className="inline-block bg-white text-ocean-blue px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-200 shadow-lg"
                >
                  Learn More
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        {displayAds.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 text-ocean-blue p-3 rounded-full shadow-lg transition-all duration-200 z-20"
              aria-label="Previous slide"
            >
              <FiChevronLeft size={24} />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 text-ocean-blue p-3 rounded-full shadow-lg transition-all duration-200 z-20"
              aria-label="Next slide"
            >
              <FiChevronRight size={24} />
            </button>
          </>
        )}

        {/* Dots Indicator */}
        {displayAds.length > 1 && (
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
            {displayAds.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentIndex
                    ? 'bg-white w-8'
                    : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  )
}

