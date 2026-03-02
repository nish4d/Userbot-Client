"use client"

import { useEffect, useState } from "react"

export function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | "system" | null
    if (savedTheme) {
      setTheme(savedTheme)
    }
    applyTheme(savedTheme || "system")
  }, [])

  const applyTheme = (newTheme: "light" | "dark" | "system") => {
    const html = document.documentElement
    if (newTheme === "system") {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      html.classList.toggle("dark", isDark)
    } else {
      html.classList.toggle("dark", newTheme === "dark")
    }
  }

  const updateTheme = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
    applyTheme(newTheme)
  }

  return { theme, setTheme: updateTheme, mounted }
}
