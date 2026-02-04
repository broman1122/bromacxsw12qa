"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"

interface LightningBolt {
  id: number
  left: number
  delay: number
  duration: number
}

interface FoodItem {
  id: number
  emoji: string
  left: number
  top: number
  size: number
  delay: number
  rotation: number
}

export function PizzaIntro() {
  const [show, setShow] = useState(true)
  const [fadeOut, setFadeOut] = useState(false)
  const [lightningBolts, setLightningBolts] = useState<LightningBolt[]>([])
  const [foodItems, setFoodItems] = useState<FoodItem[]>([])
  const [flashScreen, setFlashScreen] = useState(false)

  // Create thunder sound using Web Audio API
  const playThunderSound = useCallback(() => {
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (!AudioContextClass) return
      
      const audioContext = new AudioContextClass()
      const duration = 1.5
      const sampleRate = audioContext.sampleRate
      const bufferSize = duration * sampleRate
      const buffer = audioContext.createBuffer(1, bufferSize, sampleRate)
      const data = buffer.getChannelData(0)
      
      // Generate thunder-like noise
      for (let i = 0; i < bufferSize; i++) {
        const t = i / sampleRate
        // Exponential decay with rumble
        const envelope = Math.exp(-t * 3) * (1 + Math.sin(t * 20) * 0.3)
        // Mix of noise frequencies for rumble effect
        const noise = (Math.random() * 2 - 1) * envelope
        const lowRumble = Math.sin(t * 30) * Math.exp(-t * 2) * 0.5
        data[i] = (noise + lowRumble) * 0.4
      }
      
      const source = audioContext.createBufferSource()
      source.buffer = buffer
      
      // Add low-pass filter for more realistic thunder
      const filter = audioContext.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.value = 400
      
      const gainNode = audioContext.createGain()
      gainNode.gain.value = 0.6
      
      source.connect(filter)
      filter.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      source.start()
      source.stop(audioContext.currentTime + duration)
    } catch {
      // Ignore audio errors
    }
  }, [])

  const triggerFlash = useCallback(() => {
    setFlashScreen(true)
    playThunderSound()
    setTimeout(() => setFlashScreen(false), 100)
  }, [playThunderSound])

  useEffect(() => {
    // Generate lightning bolts
    const bolts: LightningBolt[] = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 0.2 + Math.random() * 0.3,
    }))
    setLightningBolts(bolts)

    // Generate food items (pizzas and burgers)
    const foods: FoodItem[] = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      emoji: i % 2 === 0 ? "🍕" : "🍔",
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: 40 + Math.random() * 40,
      delay: Math.random() * 1.5,
      rotation: Math.random() * 360,
    }))
    setFoodItems(foods)

    // Trigger lightning flashes
    const flashIntervals = [300, 800, 1200, 1600]
    flashIntervals.forEach((time) => {
      setTimeout(triggerFlash, time)
    })

    // Start fade out after 3 seconds
    const fadeTimer = setTimeout(() => {
      setFadeOut(true)
    }, 3000)

    // Remove component after fade animation
    const hideTimer = setTimeout(() => {
      setShow(false)
    }, 3800)

    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(hideTimer)
    }
  }, [triggerFlash])

  if (!show) return null

  return (
    <div
      className={`fixed inset-0 z-[100] bg-[#0a0a0a] flex items-center justify-center overflow-hidden transition-opacity duration-700 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Lightning flash overlay */}
      <div
        className={`absolute inset-0 bg-white/90 pointer-events-none transition-opacity duration-75 ${
          flashScreen ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Animated storm background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a2e] via-[#16213e] to-[#0f0f23]">
        {/* Lightning bolts */}
        {lightningBolts.map((bolt) => (
          <div
            key={bolt.id}
            className="absolute top-0 animate-lightning"
            style={{
              left: `${bolt.left}%`,
              animationDelay: `${bolt.delay}s`,
              animationDuration: `${bolt.duration}s`,
            }}
          >
            <svg
              width="60"
              height="200"
              viewBox="0 0 60 200"
              className="text-yellow-300 drop-shadow-[0_0_20px_rgba(253,224,71,0.8)]"
            >
              <path
                d="M30 0 L35 50 L50 55 L25 100 L40 105 L15 150 L35 155 L20 200 L25 155 L5 150 L30 105 L10 100 L35 55 L20 50 Z"
                fill="currentColor"
                className="animate-pulse"
              />
            </svg>
          </div>
        ))}

        {/* Thunder clouds effect */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-gray-800/80 to-transparent animate-pulse" />
      </div>

      {/* Flying food items */}
      {foodItems.map((food) => (
        <div
          key={food.id}
          className="absolute animate-food-fly"
          style={{
            left: `${food.left}%`,
            top: `${food.top}%`,
            fontSize: `${food.size}px`,
            animationDelay: `${food.delay}s`,
            transform: `rotate(${food.rotation}deg)`,
          }}
        >
          <span className="drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
            {food.emoji}
          </span>
        </div>
      ))}

      {/* Main content */}
      <div className="relative flex flex-col items-center z-10">
        {/* Logo with glow effect */}
        <div className="relative w-72 h-72 md:w-96 md:h-96 animate-logo-entrance">
          {/* Glow ring */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500 blur-3xl opacity-50 animate-pulse" />
          
          {/* Logo */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Image
              src="/images/logo.png"
              alt="Take & Go"
              width={350}
              height={350}
              className="object-contain drop-shadow-[0_0_30px_rgba(255,100,0,0.6)] animate-logo-float"
              priority
            />
          </div>

          {/* Orbiting food */}
          <div className="absolute inset-0 animate-orbit">
            <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-5xl drop-shadow-lg">🍕</span>
          </div>
          <div className="absolute inset-0 animate-orbit-reverse">
            <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-5xl drop-shadow-lg">🍔</span>
          </div>
          <div className="absolute inset-0 animate-orbit" style={{ animationDelay: "0.5s" }}>
            <span className="absolute top-1/2 -left-4 -translate-y-1/2 text-4xl drop-shadow-lg">🍕</span>
          </div>
          <div className="absolute inset-0 animate-orbit-reverse" style={{ animationDelay: "0.5s" }}>
            <span className="absolute top-1/2 -right-4 -translate-y-1/2 text-4xl drop-shadow-lg">🍔</span>
          </div>
        </div>

        {/* Welcome text */}
        <div className="mt-8 text-center animate-text-entrance">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
            Välkommen till
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-500 to-yellow-400 animate-gradient">
              Take & Go!
            </span>
          </h1>
          <p className="text-white/80 text-lg md:text-xl animate-fade-in" style={{ animationDelay: "0.5s" }}>
            Falkenbergs godaste pizza & burgare 🍕🍔
          </p>
        </div>

        {/* Electric sparks at bottom */}
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex gap-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-1 h-8 bg-gradient-to-t from-transparent via-yellow-400 to-white animate-spark"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
