"use client"

import { motion } from "framer-motion"
import { AlertCircle, XCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

interface ErrorHandlerProps {
  error: Error | string | null
  onRetry?: () => void
  onDismiss?: () => void
}

export function ErrorHandler({ error, onRetry, onDismiss }: ErrorHandlerProps) {
  if (!error) return null

  const message = typeof error === "string" ? error : error.message

  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>{message}</span>
          <div className="flex gap-2 ml-4">
            {onRetry && (
              <Button variant="outline" size="sm" onClick={onRetry} className="h-7 bg-transparent">
                Retry
              </Button>
            )}
            {onDismiss && (
              <Button variant="ghost" size="sm" onClick={onDismiss} className="h-7">
                <XCircle className="w-4 h-4" />
              </Button>
            )}
          </div>
        </AlertDescription>
      </Alert>
    </motion.div>
  )
}
