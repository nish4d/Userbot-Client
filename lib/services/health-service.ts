import { apiClient } from "../api-client"
import type { HealthStatus } from "../types"

export const healthService = {
  async checkHealth(): Promise<HealthStatus> {
    try {
      console.log('[HealthService] Making request to /api/health')
      // Use the Next.js API route as proxy instead of direct backend call
      const response = await apiClient.get("/api/health")
      console.log('[HealthService] Response received:', response.status)
      return response.data
    } catch (error) {
      console.error("[HealthService] Error checking health:", error)
      throw error
    }
  },
}