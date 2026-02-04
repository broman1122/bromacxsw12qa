"use client"

import React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Phone, Mail, Instagram, Send, MessageCircle } from "lucide-react"
import Link from "next/link"

const socialLinks = [
  { icon: Instagram, href: "https://www.instagram.com/take_and_go1?igsh=MTZqazY2bnVxYjkyaw==", label: "Instagram", handle: "@take_and_go1" },
]

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSubmitting(false)
    setSubmitted(true)
    setFormData({ name: "", email: "", phone: "", message: "" })
  }

  return (
    <section id="kontakt" className="py-24 bg-card">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-primary font-medium text-sm tracking-wider uppercase">
            Kontakta Oss
          </span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-card-foreground mt-4 mb-6">
            Hör av dig – vi vill gärna höra från dig!
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Har du frågor, vill boka oss för ett event eller bara säga hej? 
            Vi älskar att få kontakt med våra kunder och ser fram emot att prata med just dig! ✨
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          {submitted ? (
            <div className="bg-muted rounded-2xl p-8 border border-border flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-4">
                  <Send className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground mb-2">
                  Tack for ditt meddelande!
                </h3>
                <p className="text-muted-foreground mb-6">
                  Vi aterkommer sa snart vi kan.
                </p>
                <Button onClick={() => setSubmitted(false)} variant="outline">
                  Skicka nytt meddelande
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-muted rounded-2xl p-8 border border-border">
              <h3 className="text-card-foreground font-bold text-xl mb-6">Skicka Ett Meddelande</h3>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="text-muted-foreground text-sm mb-2 block">Namn</label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Ditt namn"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="bg-card border-border"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="text-muted-foreground text-sm mb-2 block">Telefon</label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="070-123 45 67"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="bg-card border-border"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="text-muted-foreground text-sm mb-2 block">E-post</label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="din@email.se"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="bg-card border-border"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="text-muted-foreground text-sm mb-2 block">Meddelande</label>
                  <Textarea
                    id="message"
                    placeholder="Skriv ditt meddelande har..."
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    className="bg-card border-border resize-none"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
                >
                  {isSubmitting ? "Skickar..." : (
                    <>
                      <Send className="w-4 h-4" />
                      Skicka Meddelande
                    </>
                  )}
                </Button>
              </form>
            </div>
          )}

          {/* Contact Info */}
          <div className="space-y-6">
            {/* Direct Contact */}
            <div className="bg-muted rounded-2xl p-8 border border-border">
              <h3 className="text-card-foreground font-bold text-xl mb-6">Kontakta Oss Direkt</h3>
              <div className="space-y-4">
                <Link
                  href="tel:0722562660"
                  className="flex items-center gap-4 p-4 bg-card rounded-xl hover:bg-primary/5 transition-colors"
                >
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-muted-foreground text-sm">Ring oss</div>
                    <div className="text-card-foreground font-medium">0722-562660</div>
                  </div>
                </Link>
                <Link
                  href="https://wa.me/46722562660"
                  target="_blank"
                  className="flex items-center gap-4 p-4 bg-card rounded-xl hover:bg-primary/5 transition-colors"
                >
                  <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <div className="text-muted-foreground text-sm">WhatsApp</div>
                    <div className="text-card-foreground font-medium">0722-562660</div>
                  </div>
                </Link>
                <Link
                  href="mailto:take.and.go.f@gmail.com"
                  className="flex items-center gap-4 p-4 bg-card rounded-xl hover:bg-primary/5 transition-colors"
                >
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-muted-foreground text-sm">E-post</div>
                    <div className="text-card-foreground font-medium">take.and.go.f@gmail.com</div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-muted rounded-2xl p-8 border border-border">
              <h3 className="text-card-foreground font-bold text-xl mb-6">Folj Oss</h3>
              <div className="space-y-4">
                {socialLinks.map((social) => (
                  <Link
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    className="flex items-center gap-4 p-4 bg-card rounded-xl hover:bg-primary/5 transition-colors"
                  >
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                      <social.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-muted-foreground text-sm">{social.label}</div>
                      <div className="text-card-foreground font-medium">{social.handle}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Catering CTA */}
            <div className="bg-primary rounded-2xl p-8 text-center">
              <h3 className="text-primary-foreground font-bold text-xl mb-3">Catering & Event?</h3>
              <p className="text-primary-foreground/80 mb-6">
                Planerar du bröllop, företag eller fest? Vi kommer gärna till dig!
              </p>
              <Link href="tel:0722562660">
                <Button
                  variant="outline"
                  className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
                >
                  Ring för Offert
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
