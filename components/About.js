import { FiUsers, FiAward, FiTrendingUp, FiGlobe } from 'react-icons/fi'

const stats = [
  { icon: FiUsers, value: '50+', label: 'Happy Clients' },
  { icon: FiAward, value: '100+', label: 'Projects Completed' },
  { icon: FiTrendingUp, value: '10+', label: 'Years Experience' },
  { icon: FiGlobe, value: '15+', label: 'Countries Served' },
]

export default function About() {
  return (
    <section id="about" className="w-full bg-ocean-blue py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            About CODESKYTZ
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            We are a team of passionate developers dedicated to creating exceptional software solutions.
            With years of experience in the industry, we combine technical expertise with creative
            problem-solving to deliver products that exceed expectations.
          </p>
          <p className="text-lg text-blue-200">
            Our mission is to help businesses thrive in the digital world by providing
            cutting-edge technology solutions that drive growth and innovation.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <div key={index} className="text-center">
                <div className="inline-block mb-4">
                  <IconComponent className="text-white text-4xl" />
                </div>
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-blue-200 text-lg">
                  {stat.label}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

