import Image from "next/image"
import Link from "next/link"
import { Instagram, MapPin, Phone, Mail } from "lucide-react"

const footerLinks = {
  quickLinks: [
    { label: "Hem", href: "#hem" },
    { label: "Meny", href: "#meny" },
    { label: "Beställ Online", href: "#bestall" },
    { label: "Om Oss", href: "#om-oss" },
    { label: "Hitta Oss", href: "#hitta-oss" },
    { label: "Kontakt", href: "#kontakt" },
    { label: "Admin Panel", href: "/admin" },
  ],
  menu: [
    { label: "Pizza", href: "#meny" },
    { label: "Burgare", href: "#meny" },
    { label: "Tillbehör", href: "#meny" },
    { label: "Dryck", href: "#meny" },
  ],
}

const socialLinks = [
  { icon: Instagram, href: "https://www.instagram.com/take_and_go1?igsh=MTZqazY2bnVxYjkyaw==", label: "Instagram" },
]

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-6">
              <div className="relative w-28 h-28">
                <Image
                  src="/images/logo.png"
                  alt="Take & Go Falkenberg"
                  fill
                  className="object-contain"
                />
              </div>
            </Link>
            <p className="text-background/70 mb-6 leading-relaxed text-sm">
              Falkenbergs favorit food truck!
              Äkta italiensk pizza och saftiga burgare, tillagade med kärlek. 🍕🍔
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  aria-label={social.label}
                  className="w-10 h-10 bg-background/10 rounded-full flex items-center justify-center text-background/70 hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <social.icon className="w-5 h-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-background font-bold text-lg mb-6">Snabblänkar</h4>
            <ul className="space-y-3">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-background/70 hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Menu */}
          <div>
            <h4 className="text-background font-bold text-lg mb-6">Meny</h4>
            <ul className="space-y-3">
              {footerLinks.menu.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-background/70 hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-background font-bold text-lg mb-6">Kontakt</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-background/70 text-sm">
                  Stortorget<br />
                  311 31 Falkenberg<br />
                  Sverige
                </span>
              </li>
              <li>
                <Link href="tel:0722562660" className="flex items-center gap-3 text-background/70 hover:text-primary transition-colors">
                  <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-sm">0722-562660</span>
                </Link>
              </li>
              <li>
                <Link href="mailto:take.and.go.f@gmail.com" className="flex items-center gap-3 text-background/70 hover:text-primary transition-colors">
                  <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-sm">take.and.go.f@gmail.com</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-background/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-background/50 text-sm">
              &copy; {new Date().getFullYear()} Take & Go Falkenberg. Alla rättigheter förbehållna.
            </p>
            <div className="flex items-center gap-4 text-sm text-background/50">
              <span>Pizza</span>
              <span className="text-primary">|</span>
              <span>Burgare</span>
              <span className="text-primary">|</span>
              <span>Take & Go</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
