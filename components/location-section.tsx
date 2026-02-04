"use client"

import { MapPin, Navigation, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function LocationSection() {
  return (
    <section id="hitta-oss" className="py-24 bg-muted">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-primary font-medium text-sm tracking-wider uppercase">
            Var finns vi?
          </span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground mt-4 mb-6">
            Hitta Oss
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Vi finns i centrum! Kom förbi och hämta din mat.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Google Maps Embed */}
          <div className="relative bg-card rounded-3xl overflow-hidden aspect-square lg:aspect-auto lg:min-h-[500px] border border-border shadow-xl">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2143.8!2d12.4912!3d56.9055!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTbCsDU0JzE5LjgiTiAxMsKwMjknMjguMyJF!5e0!3m2!1ssv!2sse!4v1706900000000!5m2!1ssv!2sse"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: "100%" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0"
              title="Take & Go Falkenberg Location"
            />
            
            {/* Map Overlay Button */}
            <div className="absolute bottom-4 left-4 right-4">
              <Link 
                href="https://maps.app.goo.gl/1JbHMGXfWTj8PKkg9" 
                target="_blank"
                className="block"
              >
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 gap-2 shadow-lg">
                  <Navigation className="w-4 h-4" />
                  Oppna i Google Maps
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Info Side */}
          <div className="flex items-center">
            {/* Location Card */}
            <div className="bg-card rounded-3xl p-8 border border-border shadow-lg w-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-foreground font-bold text-xl">vår plats</h3>
              </div>
              <div className="p-6 bg-gradient-to-r from-muted to-transparent rounded-2xl border border-border/50">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-secondary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-foreground font-semibold text-xl">Centrum, Falkenberg</h4>
                    <p className="text-muted-foreground mt-2">Huvudplatsen mitt i centrum!</p>
                    <span className="inline-block mt-3 text-secondary text-sm font-bold bg-secondary/10 px-4 py-2 rounded-lg">
                      Alla dagar
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
