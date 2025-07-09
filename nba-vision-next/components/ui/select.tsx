"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown, ChevronUp } from "lucide-react"

import { cn } from "@/lib/utils"

const Select = SelectPrimitive.Root

const SelectGroup = SelectPrimitive.Group

const SelectValue = SelectPrimitive.Value

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, style, ...props }, ref) => {
  const baseStyles: React.CSSProperties = {
    display: "flex",
    height: "2.5rem",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: "0.375rem",
    border: "1px solid #d1d5db",
    background: "white",
    padding: "0.5rem 0.75rem",
    fontSize: "0.875rem",
    cursor: "pointer",
    transition: "border-color 0.2s",
    outline: "none",
    ...style,
  }

  return (
    <SelectPrimitive.Trigger
      ref={ref}
      className={cn("ui-select-trigger", className)}
      style={baseStyles}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "#9ca3af"
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "#d1d5db"
      }}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDown style={{ height: "1rem", width: "1rem", opacity: 0.5 }} />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
})
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn("flex cursor-default items-center justify-center py-1", className)}
    {...props}
  >
    <ChevronUp style={{ height: "1rem", width: "1rem" }} />
  </SelectPrimitive.ScrollUpButton>
))
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn("flex cursor-default items-center justify-center py-1", className)}
    {...props}
  >
    <ChevronDown style={{ height: "1rem", width: "1rem" }} />
  </SelectPrimitive.ScrollDownButton>
))
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", style, ...props }, ref) => {
  const baseStyles: React.CSSProperties = {
    position: "relative",
    zIndex: 50,
    maxHeight: "24rem",
    minWidth: "8rem",
    overflow: "hidden",
    borderRadius: "0.375rem",
    border: "1px solid #e5e7eb",
    background: "white",
    color: "#111827",
    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    ...style,
  }

  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        ref={ref}
        className={cn("ui-select-content", className)}
        position={position}
        style={baseStyles}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn(
            "p-1",
            position === "popper" &&
              "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]",
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
})
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, style, ...props }, ref) => {
  const baseStyles: React.CSSProperties = {
    padding: "0.375rem 0.5rem 0.375rem 2rem",
    fontSize: "0.875rem",
    fontWeight: "600",
    ...style,
  }

  return <SelectPrimitive.Label ref={ref} className={cn("ui-select-label", className)} style={baseStyles} {...props} />
})
SelectLabel.displayName = SelectPrimitive.Label.displayName

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, style, ...props }, ref) => {
  const baseStyles: React.CSSProperties = {
    position: "relative",
    display: "flex",
    width: "100%",
    cursor: "pointer",
    userSelect: "none",
    alignItems: "center",
    borderRadius: "0.125rem",
    padding: "0.375rem 0.5rem 0.375rem 2rem",
    fontSize: "0.875rem",
    outline: "none",
    transition: "background-color 0.2s",
    ...style,
  }

  return (
    <SelectPrimitive.Item
      ref={ref}
      className={cn("ui-select-item", className)}
      style={baseStyles}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "#f3f4f6"
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "transparent"
      }}
      {...props}
    >
      <span
        style={{
          position: "absolute",
          left: "0.5rem",
          display: "flex",
          height: "0.875rem",
          width: "0.875rem",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <SelectPrimitive.ItemIndicator>
          <Check style={{ height: "1rem", width: "1rem" }} />
        </SelectPrimitive.ItemIndicator>
      </span>

      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
})
SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, style, ...props }, ref) => {
  const baseStyles: React.CSSProperties = {
    margin: "-0.25rem 0",
    height: "1px",
    background: "#e5e7eb",
    ...style,
  }

  return (
    <SelectPrimitive.Separator
      ref={ref}
      className={cn("ui-select-separator", className)}
      style={baseStyles}
      {...props}
    />
  )
})
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
}
