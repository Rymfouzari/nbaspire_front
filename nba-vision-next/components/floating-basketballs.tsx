"use client"

import { useEffect, useState } from "react"

interface BasketballProps {
  count?: number
}

export function FloatingBasketballs({ count = 8 }: BasketballProps) {
  const [basketballs, setBasketballs] = useState<
    Array<{
      id: number
      x: number
      y: number
      size: number
      delay: number
      duration: number
    }>
  >([])

  useEffect(() => {
    const newBasketballs = []

    for (let i = 0; i < count; i++) {
      newBasketballs.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 20 + 20,
        delay: Math.random() * 5,
        duration: Math.random() * 10 + 10,
      })
    }

    setBasketballs(newBasketballs)
  }, [count])

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {basketballs.map((ball) => (
        <div
          key={ball.id}
          className="absolute text-4xl opacity-10 float-css"
          style={{
            left: `${ball.x}%`,
            top: `${ball.y}%`,
            fontSize: `${ball.size}px`,
            animationDelay: `${ball.delay}s`,
            animationDuration: `${ball.duration}s`,
          }}
        >
          🏀
        </div>
      ))}
    </div>
  )
}
