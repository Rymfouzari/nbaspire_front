"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, style, ...props }, ref) => {
  const baseStyles: React.CSSProperties = {
    position: "relative",
    height: "1rem",
    width: "100%",
    overflow: "hidden",
    borderRadius: "9999px",
    background: "#f3f4f6",
    ...style,
  }

  const indicatorStyles: React.CSSProperties = {
    height: "100%",
    width: "100%",
    flex: 1,
    background: "#3b82f6",
    transition: "all 0.2s",
    borderRadius: "9999px",
    transform: `translateX(-${100 - (value || 0)}%)`,
  }

  return (
    <ProgressPrimitive.Root ref={ref} className={cn("ui-progress", className)} style={baseStyles} {...props}>
      <ProgressPrimitive.Indicator className="ui-progress-indicator" style={indicatorStyles} />
    </ProgressPrimitive.Root>
  )
})
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
