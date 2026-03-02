import { create } from "zustand"
import { apiClient } from "@/lib/api-client"
import { healthService } from "@/lib/services/health-service"
import type { HealthStatus } from "@/lib/types"

interface AppState {
  // Health Status
  health: HealthStatus | null
  isHealthLoading: boolean
  healthError: string | null
  checkHealth: () => Promise<void>

  // App State
  isInitialized: boolean
  initialize: () => Promise<void>
}

export const useAppStore = create<AppState>((set) => ({
  // Health Status
  health: null,
  isHealthLoading: false,
  healthError: null,

  checkHealth: async () => {
    set({ isHealthLoading: true })
    try {
      const health = await healthService.checkHealth()
      set({ health, healthError: null })
    } catch (error) {
      set({
        healthError: error instanceof Error ? error.message : "Failed to check health",
        health: null,
      })
    } finally {
      set({ isHealthLoading: false })
    }
  },

  // App State
  isInitialized: false,

  initialize: async () => {
    try {
      // apiClient is already initialized
      set({ isInitialized: true })
      // Perform initial health check
      await healthService.checkHealth()
    } catch (error) {
      console.error("[App] Failed to initialize app:", error)
    }
  },
}))
