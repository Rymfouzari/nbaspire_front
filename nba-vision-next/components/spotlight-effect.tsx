"use client"

import { useEffect, useState } from "react"

export function SpotlightEffect() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
      if (!isVisible) setIsVisible(true)
    }

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [isVisible])

  if (!isVisible) return null

  return (
    <div
      className="pointer-events-none fixed inset-0 z-30 transition duration-300 opacity-0 md:opacity-100"
      style={{
        background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(255,165,0,0.05), transparent 40%)`,
      }}
    />
  )
}
