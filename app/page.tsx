import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { MenuSection } from "@/components/menu-section"
import { OrderSection } from "@/components/order-section"
import { AboutSection } from "@/components/about-section"
import { LocationSection } from "@/components/location-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"
import { BubbleEffects } from "@/components/bubble-effects"
import { PizzaIntro } from "@/components/pizza-intro"

export default function Home() {
  return (
    <main className="min-h-screen relative">
      <PizzaIntro />
      <BubbleEffects />
      <Header />
      <HeroSection />
      <MenuSection />
      <OrderSection />
      <AboutSection />
      <LocationSection />
      <ContactSection />
      <Footer />
    </main>
  )
}
