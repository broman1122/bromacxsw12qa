"use client"

import React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { ShoppingCart, Plus, Minus, Trash2, CreditCard, Phone, Check, Pizza, Beef, Drumstick, Fish, Utensils, Sparkles, Sandwich, X } from "lucide-react"
import { menuData } from "@/lib/menu-data"

// Swish Handel configuration
const SWISH_NUMBER = "0760798088"
const SWISH_PAYEE_ALIAS = "1234679304" // Swish Handel nummer (replace with actual)

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

interface CartItem {
  id: string
  name: string
  size: string
  price: number
  quantity: number
  extras: string[]
}

interface SelectedItem {
  id: string
  name: string
  description: string
  priceEn: number
  priceFamilj?: number
  category: string
}

interface OrderConfirmation {
  success: boolean
  orderNumber?: string
  customerName?: string
  items?: CartItem[]
  totalAmount?: number
  paymentMethod?: string
  message?: string
}

export function OrderSection() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState(menuData[0]?.id || "")
  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderResult, setOrderResult] = useState<OrderConfirmation | null>(null)
  
  // Modal state
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null)
  const [modalQuantity, setModalQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState<"standard" | "familj" | "barn" | "glutenfri" | "dubbel">("standard")
  const [includedToppings, setIncludedToppings] = useState<string[]>([])

  const isPizzaCategory = ["vardagspizzor", "tacos-mexicana", "kycklingpizzor", "fisk-skaldjur", "kebab-special", "lyxpizzor"].includes(selectedCategory)

  const openItemModal = (item: typeof menuData[0]["items"][0]) => {
    setSelectedItem(item)
    setModalQuantity(1)
    setSelectedSize("standard")
    // Parse description for included toppings
    const toppings = item.description.split(", ").map(t => t.trim())
    setIncludedToppings(toppings)
  }

  const closeModal = () => {
    setSelectedItem(null)
    setModalQuantity(1)
    setSelectedSize("standard")
    setIncludedToppings([])
  }

  const calculatePrice = () => {
    if (!selectedItem) return 0
    let basePrice = selectedItem.priceEn
    
    switch (selectedSize) {
      case "familj":
        basePrice = selectedItem.priceFamilj || selectedItem.priceEn + 150
        break
      case "barn":
        basePrice = selectedItem.priceEn - 10
        break
      case "glutenfri":
        basePrice = selectedItem.priceEn + 25
        break
      case "dubbel":
        basePrice = selectedItem.priceEn + 10
        break
      default:
        basePrice = selectedItem.priceEn
    }
    
    return basePrice * modalQuantity
  }

  const getSizeLabel = () => {
    switch (selectedSize) {
      case "familj": return "Familj"
      case "barn": return "Barn"
      case "glutenfri": return "Glutenfri"
      case "dubbel": return "Dubbel botten"
      default: return "Standard"
    }
  }

  const addToCartFromModal = () => {
    if (!selectedItem) return

    let unitPrice = selectedItem.priceEn
    switch (selectedSize) {
      case "familj":
        unitPrice = selectedItem.priceFamilj || selectedItem.priceEn + 150
        break
      case "barn":
        unitPrice = selectedItem.priceEn - 10
        break
      case "glutenfri":
        unitPrice = selectedItem.priceEn + 25
        break
      case "dubbel":
        unitPrice = selectedItem.priceEn + 10
        break
    }

    const cartId = `${selectedItem.id}-${selectedSize}-${Date.now()}`
    
    setCart(prev => [...prev, {
      id: cartId,
      name: selectedItem.name,
      size: getSizeLabel(),
      price: unitPrice,
      quantity: modalQuantity,
      extras: includedToppings,
    }])
    
    closeModal()
  }

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => 
      prev.map(item => {
        if (item.id === id) {
          const newQty = item.quantity + delta
          return newQty > 0 ? { ...item, quantity: newQty } : item
        }
        return item
      }).filter(item => item.quantity > 0)
    )
  }

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id))
  }

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleSubmit = async (paymentMethod: "swish" | "kassa") => {
    if (!customerName || !customerPhone || cart.length === 0) {
      alert("Vänligen fyll i namn, telefon och lägg till minst en vara")
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerPhone,
          items: cart.map(item => ({
            name: `${item.name} (${item.size})`,
            price: item.price,
            quantity: item.quantity,
          })),
          totalAmount,
          paymentMethod,
          notes
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setOrderResult({ 
          success: true, 
          orderNumber: data.orderNumber,
          customerName,
          items: [...cart],
          totalAmount,
          paymentMethod,
          message: paymentMethod === "swish" 
            ? `Swisha ${totalAmount} kr till ${SWISH_NUMBER}. Skriv ordernummer ${data.orderNumber} i meddelandet.`
            : `Betala ${totalAmount} kr i kassan när du hämtar. Ordernummer: ${data.orderNumber}`
        })
        setCart([])
        setCustomerName("")
        setCustomerPhone("")
        setNotes("")
      } else {
        setOrderResult({ success: false, message: data.error || "Något gick fel" })
      }
    } catch {
      setOrderResult({ success: false, message: "Kunde inte skicka beställning" })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Order confirmation view
  if (orderResult?.success) {
    return (
      <section id="bestall" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 max-w-full overflow-hidden">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="pt-8 pb-8">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-slow">
                  <Check className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-foreground mb-2">Tack för din beställning!</h2>
                <p className="text-5xl font-bold text-primary my-4">#{orderResult.orderNumber}</p>
                <p className="text-lg text-muted-foreground">Beställare: <span className="font-semibold text-foreground">{orderResult.customerName}</span></p>
              </div>

              <div className="bg-muted/50 rounded-xl p-6 mb-6">
                <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Din beställning
                </h3>
                <div className="space-y-3">
                  {orderResult.items?.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                      <div>
                        <span className="font-medium text-foreground">{item.name}</span>
                        <span className="text-sm text-muted-foreground ml-2">({item.size})</span>
                        <span className="text-sm text-muted-foreground ml-2">x{item.quantity}</span>
                      </div>
                      <span className="font-semibold text-foreground">{item.price * item.quantity} kr</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center pt-4 mt-4 border-t-2 border-primary">
                  <span className="text-xl font-bold text-foreground">Totalt:</span>
                  <span className="text-2xl font-bold text-primary">{orderResult.totalAmount} kr</span>
                </div>
              </div>

              {orderResult.paymentMethod === "swish" && (
                <div className="bg-[#00C281]/10 border-2 border-[#00C281] rounded-xl p-6 mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <svg className="w-8 h-8" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect width="200" height="200" rx="40" fill="#00C281"/>
                      <path d="M50 100C50 72.4 72.4 50 100 50C127.6 50 150 72.4 150 100C150 127.6 127.6 150 100 150" stroke="white" strokeWidth="20" strokeLinecap="round"/>
                    </svg>
                    <h3 className="font-bold text-[#00C281] text-lg">Swish Handel</h3>
                  </div>
                  <div className="space-y-3 text-foreground">
                    <div className="bg-white/50 dark:bg-black/20 rounded-lg p-3">
                      <p className="text-sm text-muted-foreground">Swish-nummer</p>
                      <p className="text-2xl font-bold text-[#00C281]">{SWISH_NUMBER}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white/50 dark:bg-black/20 rounded-lg p-3">
                        <p className="text-sm text-muted-foreground">Belopp</p>
                        <p className="text-xl font-bold">{orderResult.totalAmount} kr</p>
                      </div>
                      <div className="bg-white/50 dark:bg-black/20 rounded-lg p-3">
                        <p className="text-sm text-muted-foreground">Meddelande</p>
                        <p className="text-xl font-bold">#{orderResult.orderNumber}</p>
                      </div>
                    </div>
                    <a 
                      href={`swish://payment?data=%7B%22version%22%3A1%2C%22payee%22%3A%7B%22value%22%3A%22${SWISH_PAYEE_ALIAS}%22%7D%2C%22amount%22%3A%7B%22value%22%3A${orderResult.totalAmount}%7D%2C%22message%22%3A%7B%22value%22%3A%22${orderResult.orderNumber}%22%7D%7D`}
                      className="flex items-center justify-center gap-2 w-full bg-[#00C281] hover:bg-[#00A86B] text-white font-bold py-4 px-6 rounded-xl transition-colors"
                    >
                      <svg className="w-6 h-6" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M50 100C50 72.4 72.4 50 100 50C127.6 50 150 72.4 150 100C150 127.6 127.6 150 100 150" stroke="white" strokeWidth="20" strokeLinecap="round"/>
                      </svg>
                      Öppna Swish-appen
                    </a>
                    <p className="text-xs text-center text-muted-foreground">
                      Klicka på knappen för att öppna Swish direkt med ifylld betalning
                    </p>
                  </div>
                </div>
              )}

              {orderResult.paymentMethod === "kassa" && (
                <div className="bg-primary/10 border-2 border-primary rounded-xl p-6 mb-6">
                  <h3 className="font-bold text-primary mb-3 text-lg">Betala i kassan</h3>
                  <p className="text-foreground">Betala <span className="font-bold">{orderResult.totalAmount} kr</span> när du hämtar din beställning.</p>
                  <p className="text-foreground mt-2">Uppge ordernummer: <span className="font-bold text-xl">#{orderResult.orderNumber}</span></p>
                </div>
              )}

              <Button 
                onClick={() => setOrderResult(null)} 
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-lg py-6"
              >
                Gör en ny beställning
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    )
  }

  const currentCategory = menuData.find(cat => cat.id === selectedCategory)

  return (
    <section id="bestall" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 max-w-full overflow-hidden">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">Beställ Online</Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Lägg din beställning</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Välj från vår meny, fyll i dina uppgifter och betala med Swish eller i kassan
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {/* Menu Selection */}
          <div className="lg:col-span-2 space-y-6">
            {/* Category tabs */}
            <div className="overflow-x-auto pb-2">
              <div className="flex gap-2 min-w-max">
                {menuData.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center gap-2 shrink-0 ${
                      selectedCategory === category.id 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-transparent"
                    }`}
                  >
                    {categoryIcons[category.id]}
                    <span className="hidden sm:inline">{category.name}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Menu items */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {categoryIcons[selectedCategory]}
                  {currentCategory?.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {currentCategory?.items.map((item) => (
                    <div 
                      key={item.id} 
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => openItemModal(item)}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-foreground">{item.name}</h3>
                          <span className="text-primary font-bold">{item.priceEn} kr</span>
                          {item.priceFamilj && <span className="text-muted-foreground text-sm">/ Familj {item.priceFamilj} kr</span>}
                          {item.vegetarian && <Badge variant="outline" className="text-xs bg-green-500/10 text-green-600 border-green-500/20">Veg</Badge>}
                          {item.spicy && <Badge variant="outline" className="text-xs bg-red-500/10 text-red-600 border-red-500/20">Stark</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                      </div>
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          openItemModal(item)
                        }}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 shrink-0"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Välj
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Cart & Checkout */}
          <div className="space-y-6">
            {/* Cart */}
            <Card className="sticky top-24">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Din varukorg
                  {cart.length > 0 && (
                    <Badge className="ml-auto bg-primary text-primary-foreground">
                      {cart.reduce((sum, item) => sum + item.quantity, 0)}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {cart.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">Varukorgen är tom</p>
                ) : (
                  <>
                    <ScrollArea className="max-h-[250px]">
                      {cart.map((item) => (
                        <div key={item.id} className="flex items-center justify-between gap-2 py-3 border-b border-border last:border-0">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground truncate">{item.name}</p>
                            <p className="text-xs text-primary">{item.size}</p>
                            <p className="text-sm text-muted-foreground">{item.price} kr</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button 
                              size="icon" 
                              variant="outline" 
                              className="h-7 w-7 bg-transparent"
                              onClick={() => updateQuantity(item.id, -1)}
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            <Button 
                              size="icon" 
                              variant="outline" 
                              className="h-7 w-7 bg-transparent"
                              onClick={() => updateQuantity(item.id, 1)}
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              className="h-7 w-7 text-destructive"
                              onClick={() => removeFromCart(item.id)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </ScrollArea>
                    <div className="flex justify-between items-center pt-3 border-t border-border">
                      <span className="font-bold text-foreground">Totalt:</span>
                      <span className="text-xl font-bold text-primary">{totalAmount} kr</span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Customer Info */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Dina uppgifter</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Namn *</Label>
                  <Input 
                    id="name" 
                    value={customerName} 
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Ditt namn"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Telefon *</Label>
                  <Input 
                    id="phone" 
                    type="tel"
                    value={customerPhone} 
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="07X XXX XX XX"
                  />
                </div>
                <div>
                  <Label htmlFor="notes">Meddelande (valfritt)</Label>
                  <Textarea 
                    id="notes" 
                    value={notes} 
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Allergier, extra önskemål..."
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment Options */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Betalning</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full bg-[#00C281] hover:bg-[#00A86B] text-white gap-2 py-6 text-lg"
                  disabled={isSubmitting || cart.length === 0}
                  onClick={() => handleSubmit("swish")}
                >
                  <svg className="w-5 h-5" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M50 100C50 72.4 72.4 50 100 50C127.6 50 150 72.4 150 100C150 127.6 127.6 150 100 150" stroke="currentColor" strokeWidth="20" strokeLinecap="round"/>
                  </svg>
                  Swish Handel ({totalAmount} kr)
                </Button>
                <p className="text-sm text-center text-muted-foreground font-medium">Swish Handel: {SWISH_NUMBER}</p>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-card px-2 text-muted-foreground">eller</span>
                  </div>
                </div>
                <Button 
                  variant="outline"
                  className="w-full gap-2 bg-transparent py-6"
                  disabled={isSubmitting || cart.length === 0}
                  onClick={() => handleSubmit("kassa")}
                >
                  <Phone className="w-5 h-5" />
                  Betala i kassan
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Item Selection Modal */}
      <Dialog open={!!selectedItem} onOpenChange={() => closeModal()}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <div>
                <span className="text-2xl text-primary font-bold">{selectedItem?.name}</span>
                <span className="text-muted-foreground ml-2">kr</span>
              </div>
            </DialogTitle>
            <p className="text-muted-foreground text-sm">{selectedItem?.description}</p>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Included toppings */}
            <div>
              <h4 className="font-bold text-foreground mb-3">Ingår</h4>
              <div className="grid grid-cols-2 gap-3">
                {includedToppings.map((topping, index) => (
                  <label 
                    key={index}
                    className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl border border-border cursor-pointer hover:bg-muted/50"
                  >
                    <Checkbox checked={true} className="data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
                    <span className="text-sm text-foreground">{topping}</span>
                    <X className="w-4 h-4 text-muted-foreground ml-auto" />
                  </label>
                ))}
              </div>
            </div>

            {/* Pizza size options */}
            {isPizzaCategory && (
              <div>
                <h4 className="font-bold text-foreground mb-3">Pizzor 1</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <label 
                    className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedSize === "glutenfri" 
                        ? "border-primary bg-primary/10" 
                        : "border-border bg-muted/30 hover:bg-muted/50"
                    }`}
                    onClick={() => setSelectedSize("glutenfri")}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedSize === "glutenfri" ? "border-primary bg-primary" : "border-muted-foreground"
                    }`}>
                      {selectedSize === "glutenfri" && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <div>
                      <span className="text-sm text-foreground">Glutenfri botten</span>
                      <span className="text-xs text-primary ml-1">+25:-</span>
                    </div>
                  </label>

                  <label 
                    className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedSize === "standard" 
                        ? "border-primary bg-primary/10" 
                        : "border-border bg-muted/30 hover:bg-muted/50"
                    }`}
                    onClick={() => setSelectedSize("standard")}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedSize === "standard" ? "border-primary bg-primary" : "border-muted-foreground"
                    }`}>
                      {selectedSize === "standard" && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <span className="text-sm text-foreground">Standard</span>
                  </label>

                  <label 
                    className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedSize === "barn" 
                        ? "border-primary bg-primary/10" 
                        : "border-border bg-muted/30 hover:bg-muted/50"
                    }`}
                    onClick={() => setSelectedSize("barn")}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedSize === "barn" ? "border-primary bg-primary" : "border-muted-foreground"
                    }`}>
                      {selectedSize === "barn" && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <div>
                      <span className="text-sm text-foreground">Barnpizza</span>
                      <span className="text-xs text-green-600 ml-1">-10:-</span>
                    </div>
                  </label>

                  {selectedItem?.priceFamilj && (
                    <label 
                      className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedSize === "familj" 
                          ? "border-primary bg-primary/10" 
                          : "border-border bg-muted/30 hover:bg-muted/50"
                      }`}
                      onClick={() => setSelectedSize("familj")}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedSize === "familj" ? "border-primary bg-primary" : "border-muted-foreground"
                      }`}>
                        {selectedSize === "familj" && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <div>
                        <span className="text-sm text-foreground">Familjepizza</span>
                        <span className="text-xs text-primary ml-1">+{(selectedItem.priceFamilj - selectedItem.priceEn)} kr:-</span>
                      </div>
                    </label>
                  )}

                  <label 
                    className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedSize === "dubbel" 
                        ? "border-primary bg-primary/10" 
                        : "border-border bg-muted/30 hover:bg-muted/50"
                    }`}
                    onClick={() => setSelectedSize("dubbel")}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedSize === "dubbel" ? "border-primary bg-primary" : "border-muted-foreground"
                    }`}>
                      {selectedSize === "dubbel" && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <div>
                      <span className="text-sm text-foreground">Dubbel botten</span>
                      <span className="text-xs text-primary ml-1">+10:-</span>
                    </div>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Quantity and Add button */}
          <div className="flex items-center gap-4 pt-4 border-t border-border">
            <div className="flex items-center gap-2 bg-muted rounded-xl p-1">
              <Button 
                size="icon"
                variant="ghost"
                className="h-10 w-10 bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => setModalQuantity(Math.max(1, modalQuantity - 1))}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="w-10 text-center font-bold text-lg">{modalQuantity}</span>
              <Button 
                size="icon"
                variant="ghost"
                className="h-10 w-10 bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => setModalQuantity(modalQuantity + 1)}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <Button 
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 py-6 text-lg"
              onClick={addToCartFromModal}
            >
              Lägg till {calculatePrice()} kr
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  )
}
