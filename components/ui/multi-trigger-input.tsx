"use client"

import { useState, useRef, KeyboardEvent } from "react"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MultiTriggerInputProps {
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  className?: string
}

export function MultiTriggerInput({ 
  value = [], 
  onChange, 
  placeholder = "Type a keyword and press Enter", 
  className 
}: MultiTriggerInputProps) {
  const [inputValue, setInputValue] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const addTrigger = (trigger: string) => {
    const trimmed = trigger.trim()
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed])
      setInputValue("")
    }
  }

  const removeTrigger = (triggerToRemove: string) => {
    onChange(value.filter(trigger => trigger !== triggerToRemove))
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault()
      addTrigger(inputValue)
    } else if (e.key === "Backspace" && inputValue === "" && value.length > 0) {
      // Remove the last trigger when backspace is pressed on empty input
      removeTrigger(value[value.length - 1])
    }
  }

  const handleBlur = () => {
    if (inputValue.trim()) {
      addTrigger(inputValue)
    }
  }

  return (
    <div className={`flex flex-wrap gap-2 p-2 border rounded-lg bg-input border-border ${className}`}>
      {value.map((trigger) => (
        <div 
          key={trigger} 
          className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-md text-sm"
        >
          <span>{trigger}</span>
          <button 
            type="button"
            onClick={() => removeTrigger(trigger)}
            className="hover:bg-primary/20 rounded-full p-0.5"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}
      <Input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        placeholder={value.length === 0 ? placeholder : ""}
        className="flex-1 min-w-[120px] border-0 bg-transparent shadow-none focus-visible:ring-0 p-0 h-6"
      />
    </div>
  )
}