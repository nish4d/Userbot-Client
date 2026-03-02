import { apiClient } from "../api-client"
import type { Rule } from "../types"

export const rulesService = {
  async fetchRules(): Promise<Rule[]> {
    try {
      const response = await apiClient.get("/api/rules", {
        headers: {
          'X-Suppress-Error-Logging': 'true'
        }
      })
      return response.data
    } catch (error: any) {
      // Error already suppressed from console logging, now handle gracefully
      console.debug("[RulesService] Fetch rules failed, returning empty array:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      })
      // Return empty array as fallback instead of throwing
      return []
    }
  },

  async fetchRule(id: string): Promise<Rule> {
    try {
      const response = await apiClient.get(`/api/rules/${id}`, {
        headers: {
          'X-Suppress-Error-Logging': 'true'
        }
      })
      return response.data
    } catch (error: any) {
      // Error already suppressed from console logging
      console.debug(`[RulesService] Error fetching rule ${id}:`, {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      })
      throw error
    }
  },
  async createRule(rule: {
    triggers: string[]
    response: string
    image_url?: string | null
    enabled?: boolean
  }): Promise<Rule> {
    try {
      const response = await apiClient.post("/api/rules", rule, {
        headers: {
          'X-Suppress-Error-Logging': 'true'
        }
      })
      return response.data
    } catch (error: any) {
      // Error already suppressed from console logging
      console.debug("[RulesService] Error creating rule:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      })
      throw error
    }
  },  async updateRule(id: string, updates: Partial<Omit<Rule, "id">>): Promise<Rule> {
    try {
      const response = await apiClient.put(`/api/rules/${id}`, updates, {
        headers: {
          'X-Suppress-Error-Logging': 'true'
        }
      })
      return response.data
    } catch (error: any) {
      // Error already suppressed from console logging
      console.debug("[RulesService] Error updating rule:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      })
      throw error
    }
  },  async deleteRule(id: string): Promise<void> {
    try {
      await apiClient.delete(`/api/rules/${id}`, {
        headers: {
          'X-Suppress-Error-Logging': 'true'
        }
      })
    } catch (error: any) {
      // Error already suppressed from console logging
      console.debug("[RulesService] Error deleting rule:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      })
      throw error
    }
  },  async toggleRule(id: string, enabled: boolean): Promise<Rule> {
    return this.updateRule(id, { enabled })
  },

  async bulkDelete(ids: string[]): Promise<void> {
    try {
      await Promise.all(ids.map((id) => this.deleteRule(id)))
    } catch (error: any) {
      // Error already suppressed from console logging in deleteRule
      console.debug("[RulesService] Error in bulk delete:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      })
      throw error
    }
  },  async bulkToggle(ids: string[], enabled: boolean): Promise<void> {
    try {
      await Promise.all(ids.map((id) => this.toggleRule(id, enabled)))
    } catch (error: any) {
      // Error already suppressed from console logging in toggleRule
      console.debug("[RulesService] Error in bulk toggle:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      })
      throw error
    }
  },
}