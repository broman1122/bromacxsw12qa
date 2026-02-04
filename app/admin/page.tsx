"use client"

import React from "react"

import { useState, useEffect, useCallback, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RefreshCw, Clock, CreditCard, CheckCircle, XCircle, Package, Truck, ChefHat, Lock, Wifi, WifiOff, Bell, BellRing, Volume2, VolumeX } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface OrderItem {
  name: string
  price: number
  quantity: number
}

interface Order {
  id: string
  order_number: string
  customer_name: string
  customer_phone: string
  items: OrderItem[]
  total_amount: number
  payment_method: string
  payment_status: string
  order_status: string
  notes: string | null
  created_at: string
}

const orderStatusOptions = [
  { value: "pending", label: "Väntar", icon: Clock, color: "bg-yellow-500" },
  { value: "preparing", label: "Tillagas", icon: ChefHat, color: "bg-blue-500" },
  { value: "ready", label: "Klar", icon: Package, color: "bg-green-500" },
  { value: "delivered", label: "Levererad", icon: Truck, color: "bg-gray-500" },
  { value: "cancelled", label: "Avbruten", icon: XCircle, color: "bg-red-500" },
]

const paymentStatusOptions = [
  { value: "pending", label: "Ej betald", icon: Clock, color: "bg-yellow-500" },
  { value: "paid", label: "Betald", icon: CheckCircle, color: "bg-green-500" },
  { value: "failed", label: "Misslyckad", icon: XCircle, color: "bg-red-500" },
]

const ADMIN_PASSWORD = "55555"

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [passwordError, setPasswordError] = useState(false)

  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [newOrderAlert, setNewOrderAlert] = useState(false)

  const [filter, setFilter] = useState<string>("all")
  const [updating, setUpdating] = useState<string | null>(null)
  
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const previousOrdersRef = useRef<string[]>([])

  // Initialize audio with Web Audio API for notification sound
  useEffect(() => {
    // Create a simple beep sound using Web Audio API
    const createNotificationSound = () => {
      const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.frequency.value = 800
      oscillator.type = 'sine'
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.5)
    }
    
    // Store the function for later use
    (window as unknown as { playNotificationBeep: () => void }).playNotificationBeep = createNotificationSound
  }, [])

  // Play notification sound
  const playNotificationSound = useCallback(() => {
    if (soundEnabled && typeof window !== 'undefined') {
      try {
        (window as unknown as { playNotificationBeep?: () => void }).playNotificationBeep?.()
      } catch {
        // Ignore audio errors
      }
    }
  }, [soundEnabled])

  // Fetch orders from Supabase
  const fetchOrders = useCallback(async () => {
    try {
      const supabase = createClient()
      const { data, error: fetchError } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false })

      if (fetchError) {
        console.error("Fetch error:", fetchError)
        setError("Kunde inte hämta beställningar")
        return
      }

      // Check for new orders
      if (data) {
        const currentOrderIds = data.map(o => o.id)
        const newOrders = currentOrderIds.filter(id => !previousOrdersRef.current.includes(id))
        
        if (newOrders.length > 0 && previousOrdersRef.current.length > 0) {
          playNotificationSound()
          setNewOrderAlert(true)
          setTimeout(() => setNewOrderAlert(false), 5000)
        }
        
        previousOrdersRef.current = currentOrderIds
        setOrders(data as Order[])
        setLastUpdate(new Date())
      }
      
      setError(null)
    } catch (err) {
      console.error("Error fetching orders:", err)
      setError("Något gick fel")
    } finally {
      setIsLoading(false)
    }
  }, [playNotificationSound])

  // Set up Supabase real-time subscription for 24/7 auto-updates
  useEffect(() => {
    if (!isAuthenticated) return

    const supabase = createClient()
    
    // Initial fetch
    fetchOrders()

    // Set up real-time subscription
    const channel = supabase
      .channel('orders-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders'
        },
        (payload) => {
          console.log('Real-time update:', payload)
          
          if (payload.eventType === 'INSERT') {
            // New order - play sound and show alert
            playNotificationSound()
            setNewOrderAlert(true)
            setTimeout(() => setNewOrderAlert(false), 5000)
            
            setOrders(prev => [payload.new as Order, ...prev])
          } else if (payload.eventType === 'UPDATE') {
            // Order updated
            setOrders(prev => 
              prev.map(order => 
                order.id === payload.new.id ? payload.new as Order : order
              )
            )
          } else if (payload.eventType === 'DELETE') {
            // Order deleted
            setOrders(prev => prev.filter(order => order.id !== payload.old.id))
          }
          
          setLastUpdate(new Date())
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status)
        setIsConnected(status === 'SUBSCRIBED')
      })

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel)
    }
  }, [isAuthenticated, fetchOrders, playNotificationSound])

  // Fallback polling every 30 seconds if real-time fails
  useEffect(() => {
    if (!isAuthenticated || isConnected) return

    const interval = setInterval(() => {
      fetchOrders()
    }, 30000)

    return () => clearInterval(interval)
  }, [isAuthenticated, isConnected, fetchOrders])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      setPasswordError(false)
    } else {
      setPasswordError(true)
    }
  }

  const updateOrder = useCallback(async (orderId: string, field: "orderStatus" | "paymentStatus", value: string) => {
    setUpdating(orderId)
    try {
      const supabase = createClient()
      
      const updateData: Record<string, string> = { updated_at: new Date().toISOString() }
      if (field === "orderStatus") updateData.order_status = value
      if (field === "paymentStatus") updateData.payment_status = value

      const { error: updateError } = await supabase
        .from("orders")
        .update(updateData)
        .eq("id", orderId)

      if (updateError) {
        console.error("Update failed:", updateError)
      }
      // Real-time will handle the UI update automatically
    } catch (err) {
      console.error("Update failed:", err)
    } finally {
      setUpdating(null)
    }
  }, [])

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
        <Card className="max-w-sm w-full">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Admin Panel</CardTitle>
            <p className="text-muted-foreground text-sm mt-2">Ange lösenord för att fortsätta</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Input
                  type="password"
                  placeholder="Lösenord"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setPasswordError(false)
                  }}
                  className={passwordError ? "border-destructive" : ""}
                  autoFocus
                />
                {passwordError && (
                  <p className="text-destructive text-sm mt-2">Fel lösenord. Försök igen.</p>
                )}
              </div>
              <Button type="submit" className="w-full bg-primary text-primary-foreground">
                Logga in
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }
  
  const filteredOrders = filter === "all" 
    ? orders 
    : orders.filter(o => o.order_status === filter)

  const pendingCount = orders.filter(o => o.order_status === "pending").length
  const preparingCount = orders.filter(o => o.order_status === "preparing").length
  const todayOrders = orders.filter(o => {
    const orderDate = new Date(o.created_at).toDateString()
    const today = new Date().toDateString()
    return orderDate === today
  })
  const todayRevenue = todayOrders.reduce((sum, o) => sum + o.total_amount, 0)

  if (error && orders.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <XCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Kunde inte ladda beställningar</h2>
            <Button onClick={() => fetchOrders()}>Försök igen</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* New Order Alert Banner */}
      {newOrderAlert && (
        <div className="fixed top-0 left-0 right-0 bg-green-500 text-white py-3 px-4 text-center z-[100] animate-pulse">
          <div className="flex items-center justify-center gap-2">
            <BellRing className="w-5 h-5 animate-bounce" />
            <span className="font-bold">NY BESTÄLLNING MOTTAGEN!</span>
            <BellRing className="w-5 h-5 animate-bounce" />
          </div>
        </div>
      )}

      {/* Header */}
      <header className={`bg-card border-b border-border sticky top-0 z-50 ${newOrderAlert ? 'mt-12' : ''}`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Image
                  src="/images/logo.png"
                  alt="Take & Go Falkenberg"
                  width={60}
                  height={60}
                  className="object-contain"
                />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-foreground">Admin Panel</h1>
                <div className="flex items-center gap-2 text-sm">
                  {isConnected ? (
                    <span className="text-green-600 flex items-center gap-1">
                      <Wifi className="w-3 h-3" />
                      Live 24/7
                    </span>
                  ) : (
                    <span className="text-yellow-600 flex items-center gap-1">
                      <WifiOff className="w-3 h-3" />
                      Polling
                    </span>
                  )}
                  {lastUpdate && (
                    <span className="text-muted-foreground">
                      | Uppdaterad: {lastUpdate.toLocaleTimeString("sv-SE")}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="gap-2 bg-transparent"
                title={soundEnabled ? "Stäng av ljud" : "Sätt på ljud"}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => fetchOrders()}
                disabled={isLoading}
                className="gap-2 bg-transparent"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
                Uppdatera
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsAuthenticated(false)}
                className="text-muted-foreground"
              >
                Logga ut
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className={pendingCount > 0 ? "ring-2 ring-yellow-500 animate-pulse" : ""}>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{pendingCount}</p>
                  <p className="text-sm text-muted-foreground">Väntar</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <ChefHat className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{preparingCount}</p>
                  <p className="text-sm text-muted-foreground">Tillagas</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                  <Package className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{todayOrders.length}</p>
                  <p className="text-sm text-muted-foreground">Idag</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{todayRevenue} kr</p>
                  <p className="text-sm text-muted-foreground">Försäljning</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
            className={filter === "all" ? "bg-primary text-primary-foreground" : "bg-transparent"}
          >
            Alla ({orders.length})
          </Button>
          {orderStatusOptions.map(status => {
            const count = orders.filter(o => o.order_status === status.value).length
            return (
              <Button
                key={status.value}
                variant={filter === status.value ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(status.value)}
                className={filter === status.value ? "bg-primary text-primary-foreground" : "bg-transparent"}
              >
                {status.label} ({count})
              </Button>
            )
          })}
        </div>

        {/* Orders List */}
        {isLoading && orders.length === 0 ? (
          <div className="text-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Laddar beställningar...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Inga beställningar att visa</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredOrders.map(order => {
              const orderStatus = orderStatusOptions.find(s => s.value === order.order_status)
              const paymentStatus = paymentStatusOptions.find(s => s.value === order.payment_status)
              const StatusIcon = orderStatus?.icon || Clock
              const PaymentIcon = paymentStatus?.icon || Clock

              return (
                <Card key={order.id} className={`overflow-hidden transition-all ${order.order_status === "pending" ? "ring-2 ring-yellow-500" : ""}`}>
                  <CardHeader className="pb-3">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <Badge className={`${orderStatus?.color} text-white`}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {orderStatus?.label}
                        </Badge>
                        <span className="text-2xl font-bold text-primary">#{order.order_number}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={order.payment_method === "swish" ? "border-[#00C281] text-[#00C281]" : "border-muted-foreground"}>
                          {order.payment_method === "swish" ? "Swish Handel" : "Kassa"}
                        </Badge>
                        <Badge className={`${paymentStatus?.color} text-white`}>
                          <PaymentIcon className="w-3 h-3 mr-1" />
                          {paymentStatus?.label}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Customer Info */}
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Kund: </span>
                        <span className="font-medium text-foreground">{order.customer_name}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Tel: </span>
                        <a href={`tel:${order.customer_phone}`} className="font-medium text-primary hover:underline">
                          {order.customer_phone}
                        </a>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Tid: </span>
                        <span className="font-medium text-foreground">
                          {new Date(order.created_at).toLocaleString("sv-SE", { 
                            hour: "2-digit", 
                            minute: "2-digit",
                            day: "numeric",
                            month: "short"
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-sm font-medium text-foreground mb-2">Beställning:</p>
                      <ul className="space-y-1">
                        {order.items.map((item, idx) => (
                          <li key={idx} className="flex justify-between text-sm">
                            <span className="text-foreground">{item.quantity}x {item.name}</span>
                            <span className="text-muted-foreground">{item.price * item.quantity} kr</span>
                          </li>
                        ))}
                      </ul>
                      <div className="border-t border-border mt-2 pt-2 flex justify-between font-bold">
                        <span>Totalt:</span>
                        <span className="text-primary">{order.total_amount} kr</span>
                      </div>
                    </div>

                    {/* Notes */}
                    {order.notes && (
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                          <strong>Meddelande:</strong> {order.notes}
                        </p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-wrap gap-4 pt-2 border-t border-border">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Status:</span>
                        <Select
                          value={order.order_status}
                          onValueChange={(value) => updateOrder(order.id, "orderStatus", value)}
                          disabled={updating === order.id}
                        >
                          <SelectTrigger className="w-[140px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {orderStatusOptions.map(status => (
                              <SelectItem key={status.value} value={status.value}>
                                {status.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Betalning:</span>
                        <Select
                          value={order.payment_status}
                          onValueChange={(value) => updateOrder(order.id, "paymentStatus", value)}
                          disabled={updating === order.id}
                        >
                          <SelectTrigger className="w-[130px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {paymentStatusOptions.map(status => (
                              <SelectItem key={status.value} value={status.value}>
                                {status.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
