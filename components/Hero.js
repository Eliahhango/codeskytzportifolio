import { FiCode, FiArrowRight } from 'react-icons/fi'

export default function Hero() {
  return (
    <section id="home" className="w-full bg-white/80 dark:bg-gray-900/90 dark:backdrop-blur-md backdrop-blur-sm py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block mb-6">
            <FiCode className="text-ocean-blue dark:text-blue-400 text-6xl" />
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Building Digital Excellence
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8">
            We transform ideas into powerful, scalable software solutions
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#portfolio"
              className="bg-ocean-blue text-white px-8 py-4 rounded-lg font-semibold hover:bg-ocean-blue-dark transition-colors duration-200 flex items-center justify-center gap-2"
            >
              View Our Work
              <FiArrowRight />
            </a>
            <a
              href="#contact"
              className="bg-gray-100 dark:bg-gray-800 dark:text-white text-ocean-blue px-8 py-4 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              Get In Touch
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

