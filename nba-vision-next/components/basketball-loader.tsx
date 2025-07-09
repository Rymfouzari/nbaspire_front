"use client"

import { useEffect, useState } from "react"

export function BasketballLoader() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1500)

    // Initialize counter animations
    const counters = document.querySelectorAll(".counter")
    counters.forEach((counter) => {
      const target = Number.parseInt(counter.getAttribute("data-target") || "0")
      const duration = 1500 // ms
      const step = target / (duration / 16) // 60fps

      let current = 0
      const updateCounter = () => {
        current += step
        if (current < target) {
          counter.textContent = Math.floor(current).toString()
          requestAnimationFrame(updateCounter)
        } else {
          counter.textContent = target.toString()
        }
      }

      setTimeout(() => {
        requestAnimationFrame(updateCounter)
      }, 500)
    })

    return () => clearTimeout(timer)
  }, [])

  if (!loading) return null

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-orange-900 to-amber-900 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="relative w-24 h-24 mx-auto mb-4">
          <div className="w-24 h-24 rounded-full border-4 border-t-orange-500 border-r-orange-400 border-b-orange-300 border-l-orange-200 animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 basketball-texture rounded-full animate-bounce">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-1 h-10 bg-orange-900 rounded-full"></div>
                <div className="w-10 h-1 bg-orange-900 rounded-full absolute"></div>
              </div>
            </div>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">NBA Vision</h2>
        <p className="text-orange-200">Chargement des statistiques...</p>
      </div>
    </div>
  )
}
