"use client"

import { motion } from "framer-motion"

export function LoadingSkeleton({ className = "" }: { className?: string }) {
  return (
    <motion.div
      className={`bg-muted/30 rounded-lg ${className}`}
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
    />
  )
}
