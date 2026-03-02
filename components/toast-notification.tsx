"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useCallback } from "react"
import { X, Check, AlertCircle, Info } from "lucide-react"

type ToastType = "success" | "error" | "info" | "warning"

interface Toast {
  id: string
  message: string
  type: ToastType
}

const icons = {
  success: Check,
  error: AlertCircle,
  info: Info,
  warning: AlertCircle,
}

const colors = {
  success: "bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-400",
  error: "bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-400",
  info: "bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-400",
  warning: "bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-400",
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((message: string, type: ToastType = "info", duration = 3000) => {
    const id = Math.random().toString(36).substring(7)
    setToasts((prev) => [...prev, { id, message, type }])

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, duration)
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return { toasts, addToast, removeToast }
}

export function ToastContainer({ toasts, removeToast }: { toasts: Toast[]; removeToast: (id: string) => void }) {
  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon = icons[toast.type]
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className={`flex items-center gap-3 p-4 rounded-lg border ${colors[toast.type]}`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm font-medium flex-1">{toast.message}</p>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => removeToast(toast.id)}
                className="flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
