"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { motion } from "framer-motion"
import { ThemeProvider } from "@/components/theme-provider"
import { useAppStore } from "@/store/use-app-store"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const initialize = useAppStore((state) => state.initialize)

  useEffect(() => {
    initialize()
  }, [initialize])

  return (
    <ThemeProvider>
      <div className="flex h-screen bg-background">
        <Sidebar isOpen={sidebarOpen} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
          <main className="flex-1 overflow-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="p-6 max-w-7xl mx-auto w-full"
            >
              {children}
            </motion.div>
          </main>
        </div>
      </div>
    </ThemeProvider>
  )
}