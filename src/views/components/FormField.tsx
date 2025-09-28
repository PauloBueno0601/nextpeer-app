"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface FormFieldProps {
  label: string
  name: string
  type?: "text" | "email" | "password" | "number" | "tel" | "textarea" | "select"
  value: string | number
  onChange: (value: string | number) => void
  onBlur?: () => void
  placeholder?: string
  required?: boolean
  error?: string
  options?: { value: string; label: string }[]
  className?: string
  disabled?: boolean
}

export function FormField({
  label,
  name,
  type = "text",
  value,
  onChange,
  onBlur,
  placeholder,
  required = false,
  error,
  options,
  className,
  disabled = false,
}: FormFieldProps) {
  const [isFocused, setIsFocused] = useState(false)

  const handleFocus = () => setIsFocused(true)
  const handleBlur = () => {
    setIsFocused(false)
    onBlur?.()
  }

  const renderInput = () => {
    switch (type) {
      case "textarea":
        return (
          <Textarea
            id={name}
            name={name}
            value={value as string}
            onChange={(e) => onChange(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            className={cn(error && "border-destructive", isFocused && "ring-2 ring-primary/20")}
          />
        )

      case "select":
        return (
          <Select value={value as string} onValueChange={onChange} disabled={disabled}>
            <SelectTrigger
              className={cn(error && "border-destructive", isFocused && "ring-2 ring-primary/20")}
              onFocus={handleFocus}
              onBlur={handleBlur}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )

      default:
        return (
          <Input
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={(e) => onChange(type === "number" ? Number(e.target.value) : e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            className={cn(error && "border-destructive", isFocused && "ring-2 ring-primary/20")}
          />
        )
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
      <Label
        htmlFor={name}
        className={cn("text-sm font-medium", required && "after:content-['*'] after:text-destructive after:ml-1")}
      >
        {label}
      </Label>
      {renderInput()}
      {error && (
        <Alert variant="destructive" className="py-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-sm">{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
