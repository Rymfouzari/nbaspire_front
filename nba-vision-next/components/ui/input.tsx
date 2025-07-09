"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, style, ...props }, ref) => {
  const baseStyles: React.CSSProperties = {
    display: "flex",
    height: "2.5rem",
    width: "100%",
    borderRadius: "0.375rem",
    border: "1px solid #d1d5db",
    background: "white",
    padding: "0.5rem 0.75rem",
    fontSize: "0.875rem",
    transition: "border-color 0.2s, box-shadow 0.2s",
    outline: "none",
    ...style,
  }

  return (
    <input
      type={type}
      className={cn("ui-input", className)}
      ref={ref}
      style={baseStyles}
      onFocus={(e) => {
        e.target.style.borderColor = "#3b82f6"
        e.target.style.boxShadow = "0 0 0 2px rgba(59, 130, 246, 0.1)"
      }}
      onBlur={(e) => {
        e.target.style.borderColor = "#d1d5db"
        e.target.style.boxShadow = "none"
      }}
      {...props}
    />
  )
})
Input.displayName = "Input"

export { Input }
