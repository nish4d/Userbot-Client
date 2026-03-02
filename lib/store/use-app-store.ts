import { create } from "zustand"
import type { HealthStatus } from "../types"
import { healthService } from "../services/health-service"

interface AppState {
  healthStatus: HealthStatus | null
  sidebarOpen: boolean
  theme: "light" | "dark" | "system"
  loading: boolean
  error: string | null

  checkHealth: () => Promise<void>
  setSidebarOpen: (open: boolean) => void
  setTheme: (theme: "light" | "dark" | "system") => void
}

export const useAppStore = create<AppState>((set) => ({
  healthStatus: null,
  sidebarOpen: true,
  theme: "system",
  loading: false,
  error: null,

  checkHealth: async () => {
    set({ loading: true, error: null })
    try {
      const status = await healthService.checkHealth()
      set({ healthStatus: status, loading: false })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Health check failed",
        loading: false,
      })
    }
  },

  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setTheme: (theme) => set({ theme }),
}))
