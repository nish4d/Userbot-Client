"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import type { LucideIcon } from "lucide-react"

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-12 px-4 text-center"
    >
      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 3 }}
        className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center mb-4"
      >
        <Icon className="w-8 h-8 text-primary" />
      </motion.div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-sm">{description}</p>
      {action && (
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button onClick={action.onClick} className="bg-primary hover:bg-primary/90">
            {action.label}
          </Button>
        </motion.div>
      )}
    </motion.div>
  )
}
