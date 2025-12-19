import Header from '@/components/Header'
import Carousel from '@/components/Carousel'
import Hero from '@/components/Hero'
import Services from '@/components/Services'
import Portfolio from '@/components/Portfolio'
import About from '@/components/About'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import { getCarouselAds } from '@/lib/services/carouselService'

export default async function Home() {
  // Fetch carousel ads from Firebase
  let ads = []
  try {
    const result = await getCarouselAds()
    if (result.success) {
      // Convert Firestore Timestamps to plain objects for Client Components
      ads = result.data.map(ad => ({
        ...ad,
        createdAt: ad.createdAt?.toDate?.()?.toISOString() || ad.createdAt,
        updatedAt: ad.updatedAt?.toDate?.()?.toISOString() || ad.updatedAt,
      }))
    }
  } catch (error) {
    console.error('Error fetching carousel ads:', error)
  }

  return (
    <main className="min-h-screen relative">
      <Header />
      <Carousel ads={ads} />
      <Hero />
      <Services />
      <Portfolio />
      <About />
      <Contact />
      <Footer />
    </main>
  )
}
