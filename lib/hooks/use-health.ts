"use client"

import { useEffect, useState } from "react"
import { healthService } from "../services/health-service"
import { useAppStore } from "../../store/use-app-store"

export const useHealth = (interval = 30000) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const { health: healthStatus, checkHealth } = useAppStore()
  
  useEffect(() => {
    const performCheck = async () => {
      try {
        setLoading(true)
        await checkHealth()
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Health check failed"))
      } finally {
        setLoading(false)
      }
    }

    performCheck()
    const timer = setInterval(performCheck, interval)
    return () => clearInterval(timer)
  }, [interval, checkHealth])

  return { healthStatus, loading, error }
}