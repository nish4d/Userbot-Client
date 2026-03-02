import { apiClient } from "../api-client"
import type { BlacklistEntry } from "../types"

export const blacklistService = {
  async fetchBlacklist(): Promise<BlacklistEntry[]> {
    try {
      const response = await apiClient.get("/api/blacklist", {
        headers: {
          'X-Suppress-Error-Logging': 'true'
        }
      })
      return response.data
    } catch (error) {
      // Error already suppressed from console logging
      console.debug("[BlacklistService] Error fetching blacklist:", error)
      throw error
    }
  },

  async addUser(userId: number, reason?: string): Promise<BlacklistEntry> {
    try {
      const response = await apiClient.post("/api/blacklist", {
        user_id: userId,
        reason,
      }, {
        headers: {
          'X-Suppress-Error-Logging': 'true'
        }
      })
      return response.data
    } catch (error) {
      // Error already suppressed from console logging
      console.debug("[BlacklistService] Error adding user:", error)
      throw error
    }
  },

  async removeUser(id: string): Promise<void> {
    try {
      await apiClient.delete(`/api/blacklist/${id}`, {
        headers: {
          'X-Suppress-Error-Logging': 'true'
        }
      })
    } catch (error) {
      // Error already suppressed from console logging
      console.debug("[BlacklistService] Error removing user:", error)
      throw error
    }
  },

  async bulkAdd(userIds: number[]): Promise<void> {
    try {
      await Promise.all(userIds.map((id) => this.addUser(id)))
    } catch (error) {
      // Error already suppressed from console logging in addUser
      console.debug("[BlacklistService] Error in bulk add:", error)
      throw error
    }
  },

  async bulkRemove(ids: string[]): Promise<void> {
    try {
      await Promise.all(ids.map((id) => this.removeUser(id)))
    } catch (error) {
      // Error already suppressed from console logging in removeUser
      console.debug("[BlacklistService] Error in bulk remove:", error)
      throw error
    }
  },
}