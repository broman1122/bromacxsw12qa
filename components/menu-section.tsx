"use client"

import React from "react"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Pizza, Beef, Drumstick, Fish, Utensils, Sparkles, Sandwich, Leaf, Flame } from "lucide-react"
import { menuData } from "@/lib/menu-data"

const categoryIcons: Record<string, React.ReactNode> = {
  "vardagspizzor": <Pizza className="w-5 h-5" />,
  "tacos-mexicana": <Beef className="w-5 h-5" />,
  "kycklingpizzor": <Drumstick className="w-5 h-5" />,
  "fisk-skaldjur": <Fish className="w-5 h-5" />,
  "kebab-special": <Utensils className="w-5 h-5" />,
  "lyxpizzor": <Sparkles className="w-5 h-5" />,
  "rullar-tallrikar": <Utensils className="w-5 h-5" />,
  "burgare": <Sandwich className="w-5 h-5" />,
  "shawarma": <Utensils className="w-5 h-5" />,
}

export function MenuSection() {
  const [selectedCategory, setSelectedCategory] = useState(menuData[0]?.id || "")

  const currentCategory = menuData.find(cat => cat.id === selectedCategory)

  return (
    <section id="meny" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">Vår Meny</Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Upptäck våra smaker!</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Njut av handgjorda pizzor, saftiga burgare och autentiska rätter – allt tillagat med kärlek och de färskaste ingredienserna. Beställ, hämta och låt smaken tala för sig själv! 🍕🍔
          </p>
        </div>

        {/* Category tabs */}
        <ScrollArea className="w-full whitespace-nowrap mb-8">
          <div className="flex justify-center gap-2 pb-4 flex-wrap">
            {menuData.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 ${
                  selectedCategory === category.id 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-transparent hover:bg-primary/10"
                }`}
              >
                {categoryIcons[category.id]}
                <span className="hidden sm:inline">{category.name}</span>
              </Button>
            ))}
          </div>
        </ScrollArea>

        {/* Category title */}
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-foreground flex items-center justify-center gap-3">
            {categoryIcons[selectedCategory]}
            {currentCategory?.name}
          </h3>
        </div>

        {/* Menu items grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {currentCategory?.items.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow border-border/50">
              <CardContent className="p-6">
                <div className="flex justify-between items-start gap-4 mb-3">
                  <div>
                    <h4 className="font-bold text-foreground text-lg">{item.name}</h4>
                    <div className="flex gap-2 mt-1">
                      {item.vegetarian && (
                        <Badge variant="outline" className="text-xs bg-green-500/10 text-green-600 border-green-500/20 gap-1">
                          <Leaf className="w-3 h-3" />
                          Veg
                        </Badge>
                      )}
                      {item.spicy && (
                        <Badge variant="outline" className="text-xs bg-red-500/10 text-red-600 border-red-500/20 gap-1">
                          <Flame className="w-3 h-3" />
                          Stark
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xl font-bold text-primary">{item.priceEn} kr</div>
                    {item.priceFamilj && (
                      <div className="text-sm text-muted-foreground">Familj: {item.priceFamilj} kr</div>
                    )}
                  </div>
                </div>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Extra info */}
        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto bg-primary/5 border-primary/20">
            <CardContent className="p-6">
              <h4 className="font-bold text-foreground mb-3">Tillägg & Specialönskemål</h4>
              <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
                <span className="bg-muted px-3 py-1 rounded-full">Glutenfri botten +25 kr</span>
                <span className="bg-muted px-3 py-1 rounded-full">Barnpizza -10 kr</span>
                <span className="bg-muted px-3 py-1 rounded-full">Extra topping från 15 kr</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="text-center mt-8">
          <Button 
            asChild
            size="lg"
            className="bg-secondary text-secondary-foreground hover:bg-secondary/90 gap-2 rounded-full px-8"
          >
            <a href="#bestall">Beställ Nu</a>
          </Button>
        </div>
      </div>
    </section>
  )
}
