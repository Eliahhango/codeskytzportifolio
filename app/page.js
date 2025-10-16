import dynamic from 'next/dynamic'
import Services from '../components/Services'
import Portfolio from '../components/Portfolio'
import Ads from '../components/Ads'

const Hero = dynamic(() => import('../components/Hero'), { ssr: false })

export default function Page(){
  return (
    <div className="w-full">
      <Hero />
      <Services />
      <Portfolio />
      <Ads />
    </div>
  )
}
