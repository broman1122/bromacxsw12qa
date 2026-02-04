"use client"

import { useEffect, useState } from "react"

interface Bubble {
  id: number
  x: number
  y: number
  size: number
  duration: number
  delay: number
}

export function BubbleEffects() {
  const [bubbles, setBubbles] = useState<Bubble[]>([])

  useEffect(() => {
    // Generate bubbles
    const newBubbles: Bubble[] = []
    for (let i = 0; i < 20; i++) {
      newBubbles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 60 + 20,
        duration: Math.random() * 15 + 10,
        delay: Math.random() * 10,
      })
    }
    setBubbles(newBubbles)
  }, [])

  return (
    <div className="fixed top-0 left-0 w-screen h-screen pointer-events-none overflow-hidden z-0" style={{ maxWidth: '100vw' }}>
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          className="absolute rounded-full bg-primary/10 animate-bubble"
          style={{
            left: `${Math.min(bubble.x, 95)}%`,
            bottom: `-${bubble.size}px`,
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            animationDuration: `${bubble.duration}s`,
            animationDelay: `${bubble.delay}s`,
          }}
        />
      ))}
    </div>
  )
}
