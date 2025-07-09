"use client"

import type * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva("", {
  variants: {
    variant: {
      default: "",
      secondary: "",
      destructive: "",
      outline: "",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, style, ...props }: BadgeProps) {
  const baseStyles: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    borderRadius: "9999px",
    padding: "0.125rem 0.625rem",
    fontSize: "0.75rem",
    fontWeight: "600",
    transition: "all 0.2s",
    ...style,
  }

  let variantStyles: React.CSSProperties = {}

  switch (variant) {
    case "secondary":
      variantStyles = {
        background: "#f3f4f6",
        color: "#374151",
      }
      break
    case "destructive":
      variantStyles = {
        background: "#dc2626",
        color: "white",
      }
      break
    case "outline":
      variantStyles = {
        background: "transparent",
        border: "1px solid #d1d5db",
        color: "#374151",
      }
      break
    default:
      variantStyles = {
        background: "#3b82f6",
        color: "white",
      }
  }

  const finalStyles = { ...baseStyles, ...variantStyles }

  return <div className={cn("ui-badge", className)} style={finalStyles} {...props} />
}

export { Badge, badgeVariants }
