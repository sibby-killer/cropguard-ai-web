import { HeroSection } from '@/components/landing/hero'
import { FeaturesSection } from '@/components/landing/features'
import { HowItWorksSection } from '@/components/landing/how-it-works'
import { StatsSection } from '@/components/landing/stats'
import { TestimonialsSection } from '@/components/landing/testimonials'
import { PricingSection } from '@/components/landing/pricing'
import { Footer } from '@/components/landing/footer'
import { Navbar } from '@/components/shared/navbar'

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <StatsSection />
        <TestimonialsSection />
        <PricingSection />
      </main>
      <Footer />
    </div>
  )
}