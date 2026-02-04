"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Menu, X, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"

const navLinks = [
  { href: "#hem", label: "Hem" },
  { href: "#meny", label: "Meny" },
  { href: "#bestall", label: "Beställ Online" },
  { href: "#om-oss", label: "Om Oss" },
  { href: "#hitta-oss", label: "Hitta Oss" },
  { href: "#kontakt", label: "Kontakt" },
]

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-card/95 backdrop-blur-md shadow-lg py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-16 h-16 md:w-20 md:h-20">
              <Image
                src="/images/logo.png"
                alt="Take & Go Falkenberg"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-foreground/80 hover:text-primary transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Contact Info & CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <Link href="#bestall">
              <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90 gap-2 rounded-full px-6">
                Beställ Online
              </Button>
            </Link>
            <Link href="tel:0722562660">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 rounded-full px-6">
                <Phone className="w-4 h-4" />
                0722-562660
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden text-foreground p-2"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden absolute top-full left-0 right-0 bg-card/95 backdrop-blur-md transition-all duration-300 ${
          isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <nav className="container mx-auto px-4 py-6 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-foreground/80 hover:text-primary transition-colors font-medium text-lg py-2 border-b border-border"
            >
              {link.label}
            </Link>
          ))}
          <Link href="#bestall" className="mt-2" onClick={() => setIsMobileMenuOpen(false)}>
            <Button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 gap-2 rounded-full mb-2">
              Beställ Online
            </Button>
          </Link>
          <Link href="tel:0722562660">
            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 gap-2 rounded-full">
              <Phone className="w-4 h-4" />
              0722-562660
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  )
}
