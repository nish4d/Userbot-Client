import { create } from "zustand"
import { rulesService } from "@/lib/services/rules-service"
import type { Rule as AutoReplyRule } from "@/lib/types"

interface RulesState {
  rules: AutoReplyRule[]
  isLoading: boolean
  error: string | null

  // Actions
  fetchRules: () => Promise<void>
  createRule: (rule: Omit<AutoReplyRule, "id">) => Promise<AutoReplyRule>
  updateRule: (ruleId: string, updates: Partial<AutoReplyRule>) => Promise<void>
  deleteRule: (ruleId: string) => Promise<void>
  toggleRule: (ruleId: string) => Promise<void>
}

export const useRulesStore = create<RulesState>((set, get) => ({
  rules: [],
  isLoading: false,
  error: null,

  fetchRules: async () => {
    set({ isLoading: true, error: null })
    try {
      const rules = await rulesService.fetchRules()
      set({ rules })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to fetch rules",
      })
    } finally {
      set({ isLoading: false })
    }
  },

  createRule: async (rule: Omit<AutoReplyRule, "id">) => {
    try {
      const newRule = await rulesService.createRule(rule)
      set((state) => ({ rules: [...state.rules, newRule] }))
      return newRule
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to create rule",
      })
      throw error
    }
  },

  updateRule: async (ruleId: string, updates: Partial<AutoReplyRule>) => {
    try {
      await rulesService.updateRule(ruleId, updates)
      set({
        rules: get().rules.map((rule) => (rule.id === ruleId ? { ...rule, ...updates } : rule)),
      })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to update rule",
      })
      throw error
    }
  },

  deleteRule: async (ruleId: string) => {
    try {
      await rulesService.deleteRule(ruleId)
      set({
        rules: get().rules.filter((rule) => rule.id !== ruleId),
      })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to delete rule",
      })
      throw error
    }
  },

  toggleRule: async (ruleId: string) => {
    const rule = get().rules.find((r) => r.id === ruleId)
    if (rule) {
      await get().updateRule(ruleId, { enabled: !rule.enabled })
    }
  },
}))
