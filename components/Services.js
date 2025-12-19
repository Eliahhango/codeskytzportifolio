import { FiCode, FiSmartphone, FiDatabase, FiCloud, FiShield, FiZap } from 'react-icons/fi'

const services = [
  {
    icon: FiCode,
    title: 'Web Development',
    description: 'Custom web applications built with modern frameworks and best practices.',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    icon: FiSmartphone,
    title: 'Mobile Apps',
    description: 'Native and cross-platform mobile applications for iOS and Android.',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  {
    icon: FiDatabase,
    title: 'Backend Solutions',
    description: 'Robust server-side architecture and database design for scalability.',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
  {
    icon: FiCloud,
    title: 'Cloud Services',
    description: 'Cloud infrastructure setup, migration, and optimization services.',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
  },
  {
    icon: FiShield,
    title: 'Security',
    description: 'Comprehensive security audits and implementation of best practices.',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
  },
  {
    icon: FiZap,
    title: 'Performance',
    description: 'Optimization and performance tuning for faster, efficient applications.',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
  },
]

export default function Services() {
  return (
    <section id="services" className="w-full bg-white/70 dark:bg-gray-900/85 dark:backdrop-blur-md backdrop-blur-sm py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Our Services
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Comprehensive software development services tailored to your needs
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const IconComponent = service.icon
            return (
              <div
                key={index}
                className={`${service.bgColor} dark:bg-gray-800/90 dark:border dark:border-blue-500/20 p-8 rounded-lg hover:shadow-lg dark:hover:shadow-blue-500/30 transition-shadow duration-200`}
              >
                <div className={`${service.color} dark:text-blue-400 mb-4`}>
                  <IconComponent size={48} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {service.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

