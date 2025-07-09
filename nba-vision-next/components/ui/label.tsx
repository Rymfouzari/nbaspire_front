"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const labelVariants = cva("", {
  variants: {},
  defaultVariants: {},
})

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & VariantProps<typeof labelVariants>
>(({ className, style, ...props }, ref) => {
  const baseStyles: React.CSSProperties = {
    fontSize: "0.875rem",
    fontWeight: "500",
    lineHeight: "1.25rem",
    color: "#374151",
    display: "block",
    marginBottom: "0.5rem",
    ...style,
  }

  return <LabelPrimitive.Root ref={ref} className={cn("ui-label", className)} style={baseStyles} {...props} />
})
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
