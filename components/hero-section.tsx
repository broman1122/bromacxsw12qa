"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronDown, MapPin, Clock } from "lucide-react"

export function HeroSection() {
  return (
    <section id="hem" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-bg.jpg"
          alt="Take & Go Food Truck"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center pt-20">
        <div className="max-w-4xl mx-auto">
          {/* Logo */}
          <div className="mb-6 flex justify-center">
            <div className="relative w-40 h-40 md:w-56 md:h-56">
              <Image
                src="/images/logo.png"
                alt="Take & Go Falkenberg"
                fill
                className="object-contain drop-shadow-2xl"
                priority
              />
            </div>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
            <span className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
            <span className="text-white text-sm font-medium">Oppet nu i Falkenberg!</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif font-bold text-white mb-6 leading-tight text-balance">
            Pizza <span className="text-primary">&</span> Burgare
            <br />
            <span className="text-3xl sm:text-4xl md:text-5xl text-white/90">Take & Go</span>
          </h1>

          {/* Description */}
          <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto mb-10 text-pretty">
            Äkta italiensk pizza och saftiga burgare, tillagade med kärlek. 
            Beställ, hämta och njut – det är så enkelt! 🍕🍔
          </p>

          {/* Opening Hours Card */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 max-w-md mx-auto mb-10">
            <div className="flex items-center gap-2 justify-center mb-4">
              <Clock className="w-5 h-5 text-primary" />
              <span className="text-white font-semibold">Öppettider</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm text-white/90">
              <span>Måndag - Torsdag:</span>
              <span className="text-right">16:30 - 21:00</span>
              <span>Fredag:</span>
              <span className="text-right">11:00 - 22:00</span>
              <span>Lördag:</span>
              <span className="text-right">11:00 - 22:00</span>
              <span>Söndag:</span>
              <span className="text-right">12:00 - 21:00</span>
            </div>
            <div className="flex items-center gap-2 justify-center mt-4 pt-4 border-t border-white/20">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="text-white/80 text-sm">Falkenberg, Sverige</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="#bestall">
              <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 text-lg px-8 py-6 rounded-full shadow-lg">
                Beställ Online
              </Button>
            </Link>
            <Link href="#meny">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-6 rounded-full shadow-lg">
                Se Menyn
              </Button>
            </Link>
            <Link href="tel:0722562660">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-foreground text-lg px-8 py-6 rounded-full bg-transparent"
              >
                Ring: 0722-562660
              </Button>
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <Link href="#meny">
            <ChevronDown className="w-8 h-8 text-white/70 hover:text-white transition-colors" />
          </Link>
        </div>
      </div>
    </section>
  )
}
