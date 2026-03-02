"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { useHealth } from "@/lib/hooks/use-health"

export function StatusBadge() {
  const { healthStatus, loading } = useHealth()

  const isOnline = healthStatus?.status === "ok"

  return (
    <motion.div
      animate={{ scale: isOnline ? [1, 1.05, 1] : 1 }}
      transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
    >
      <Badge variant={isOnline ? "default" : "destructive"} className="gap-2">
        <motion.span
          animate={{ opacity: isOnline ? [1, 0.5, 1] : 1 }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
          className="w-2 h-2 rounded-full bg-current"
        />
        {loading ? "Checking..." : isOnline ? "Online" : "Offline"}
      </Badge>
    </motion.div>
  )
}
