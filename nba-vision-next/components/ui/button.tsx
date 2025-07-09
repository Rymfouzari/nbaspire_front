"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva("", {
  variants: {
    variant: {
      default: "",
      destructive: "",
      outline: "",
      secondary: "",
      ghost: "",
      link: "",
    },
    size: {
      default: "",
      sm: "",
      lg: "",
      icon: "",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
})

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, style, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"

    // Styles de base pour tous les boutons
    const baseStyles: React.CSSProperties = {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "0.375rem",
      fontSize: "0.875rem",
      fontWeight: "500",
      transition: "all 0.2s",
      cursor: "pointer",
      border: "none",
      textDecoration: "none",
      outline: "none",
      ...style,
    }

    // Styles selon la variante
    let variantStyles: React.CSSProperties = {}

    switch (variant) {
      case "outline":
        variantStyles = {
          background: "transparent",
          color: "#c2410c",
          border: "2px solid #ea580c",
          ...variantStyles,
        }
        break
      case "secondary":
        variantStyles = {
          background: "#f3f4f6",
          color: "#374151",
          ...variantStyles,
        }
        break
      case "ghost":
        variantStyles = {
          background: "transparent",
          color: "inherit",
          ...variantStyles,
        }
        break
      case "destructive":
        variantStyles = {
          background: "linear-gradient(to right, #dc2626, #b91c1c)",
          color: "white",
          ...variantStyles,
        }
        break
      case "link":
        variantStyles = {
          background: "transparent",
          color: "#3b82f6",
          textDecoration: "underline",
          ...variantStyles,
        }
        break
      default:
        variantStyles = {
          background: "linear-gradient(to right, #ea580c, #c2410c)",
          color: "white",
          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
          ...variantStyles,
        }
    }

    // Styles selon la taille
    let sizeStyles: React.CSSProperties = {}

    switch (size) {
      case "sm":
        sizeStyles = {
          height: "2.25rem",
          padding: "0 0.75rem",
          fontSize: "0.75rem",
        }
        break
      case "lg":
        sizeStyles = {
          height: "2.75rem",
          padding: "0 2rem",
          fontSize: "1rem",
        }
        break
      case "icon":
        sizeStyles = {
          height: "2.5rem",
          width: "2.5rem",
          padding: "0",
        }
        break
      default:
        sizeStyles = {
          height: "2.5rem",
          padding: "0 1rem",
        }
    }

    const finalStyles = { ...baseStyles, ...variantStyles, ...sizeStyles }

    return (
      <Comp
        className={cn("ui-button", className)}
        ref={ref}
        style={finalStyles}
        onMouseEnter={(e) => {
          if (variant === "outline") {
            e.currentTarget.style.background = "#ffedd5"
          } else if (variant === "ghost") {
            e.currentTarget.style.background = "rgba(0, 0, 0, 0.05)"
          } else if (variant !== "link") {
            e.currentTarget.style.transform = "scale(1.05)"
            if (variant === "default") {
              e.currentTarget.style.background = "linear-gradient(to right, #c2410c, #9a3412)"
            }
          }
        }}
        onMouseLeave={(e) => {
          if (variant === "outline") {
            e.currentTarget.style.background = "transparent"
          } else if (variant === "ghost") {
            e.currentTarget.style.background = "transparent"
          } else if (variant !== "link") {
            e.currentTarget.style.transform = "scale(1)"
            if (variant === "default") {
              e.currentTarget.style.background = "linear-gradient(to right, #ea580c, #c2410c)"
            }
          }
        }}
        {...props}
      />
    )
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }
