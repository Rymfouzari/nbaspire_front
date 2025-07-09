"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, style, ...props }, ref) => {
    const baseStyles: React.CSSProperties = {
      borderRadius: "0.5rem",
      border: "1px solid #e5e7eb",
      background: "white",
      color: "#111827",
      boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
      ...style,
    }

    return <div ref={ref} className={cn("ui-card", className)} style={baseStyles} {...props} />
  },
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, style, ...props }, ref) => {
    const baseStyles: React.CSSProperties = {
      display: "flex",
      flexDirection: "column",
      gap: "0.375rem",
      padding: "1.5rem 1.5rem 0",
      ...style,
    }

    return <div ref={ref} className={cn("ui-card-header", className)} style={baseStyles} {...props} />
  },
)
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, style, ...props }, ref) => {
    const baseStyles: React.CSSProperties = {
      fontSize: "1.125rem",
      fontWeight: "600",
      lineHeight: "1.75rem",
      letterSpacing: "-0.025em",
      ...style,
    }

    return <h3 ref={ref} className={cn("ui-card-title", className)} style={baseStyles} {...props} />
  },
)
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, style, ...props }, ref) => {
    const baseStyles: React.CSSProperties = {
      fontSize: "0.875rem",
      color: "#6b7280",
      lineHeight: "1.25rem",
      ...style,
    }

    return <p ref={ref} className={cn("ui-card-description", className)} style={baseStyles} {...props} />
  },
)
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, style, ...props }, ref) => {
    const baseStyles: React.CSSProperties = {
      padding: "1.5rem",
      paddingTop: 0,
      ...style,
    }

    return <div ref={ref} className={cn("ui-card-content", className)} style={baseStyles} {...props} />
  },
)
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, style, ...props }, ref) => {
    const baseStyles: React.CSSProperties = {
      display: "flex",
      alignItems: "center",
      padding: "1.5rem",
      paddingTop: 0,
      ...style,
    }

    return <div ref={ref} className={cn("ui-card-footer", className)} style={baseStyles} {...props} />
  },
)
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
