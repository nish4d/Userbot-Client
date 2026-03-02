import { create } from "zustand"
import type { Rule } from "../types"
import { rulesService } from "../services/rules-service"

interface RulesState {
  rules: Rule[]
  loading: boolean
  error: string | null
  fetchRules: () => Promise<void>
  fetchRule: (id: string) => Promise<Rule>
  createRule: (rule: { triggers: string[]; response: string; image_url?: string | null; enabled?: boolean }) => Promise<Rule>
  updateRule: (id: string, updates: Partial<Rule>) => Promise<Rule>
  deleteRule: (id: string) => Promise<void>
  toggleRule: (id: string) => Promise<void>
  bulkDelete: (ids: string[]) => Promise<void>
  bulkToggle: (ids: string[], enabled: boolean) => Promise<void>
}

export const useRulesStore = create<RulesState>((set, get) => ({
  rules: [],
  loading: false,
  error: null,

  fetchRules: async () => {
    set({ loading: true, error: null })
    try {
      const rules = await rulesService.fetchRules()
      set({ rules, loading: false })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to fetch rules",
        loading: false,
      })
    }
  },

  fetchRule: async (id) => {
    try {
      return await rulesService.fetchRule(id)
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to fetch rule",
      })
      throw error
    }
  },

  createRule: async (rule) => {
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

  updateRule: async (id, updates) => {
    try {
      const updated = await rulesService.updateRule(id, updates)
      set((state) => ({
        rules: state.rules.map((r) => (r.id === id ? { ...r, ...updates } : r)),
      }))
      return updated
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to update rule",
      })
      throw error
    }
  },

  deleteRule: async (id) => {
    try {
      // First, fetch the rule to check if it has an image
      const rule = await rulesService.fetchRule(id)
      
      // If the rule has an image, delete it from Cloudinary first
      if (rule.image_url) {
        try {
          await fetch('/api/delete-image', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ imageUrl: rule.image_url }),
          });
        } catch (imageError) {
          console.error('Failed to delete image from Cloudinary:', imageError);
          // Continue with rule deletion even if image deletion fails
        }
      }
      
      // Then delete the rule
      await rulesService.deleteRule(id)
      set((state) => ({ rules: state.rules.filter((r) => r.id !== id) }))
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to delete rule",
      })
      throw error
    }
  },

  toggleRule: async (id) => {
    const rule = get().rules.find((r) => r.id === id)
    if (rule) {
      await get().updateRule(id, { enabled: !rule.enabled })
    }
  },

  bulkDelete: async (ids) => {
    try {
      // First, fetch all rules to check which ones have images
      const allRules = get().rules;
      const rulesToDelete = allRules.filter(rule => ids.includes(rule.id));
      
      // Delete images from Cloudinary for rules that have them
      const imageDeletionPromises = rulesToDelete
        .filter(rule => rule.image_url)
        .map(rule => 
          fetch('/api/delete-image', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ imageUrl: rule.image_url }),
          }).catch(error => {
            console.error(`Failed to delete image for rule ${rule.id}:`, error);
            // Continue with other deletions even if this one fails
          })
        );
      
      // Wait for all image deletions to complete
      await Promise.all(imageDeletionPromises);
      
      // Then delete the rules
      await rulesService.bulkDelete(ids)
      set((state) => ({
        rules: state.rules.filter((r) => !ids.includes(r.id)),
      }))
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to delete rules",
      })
      throw error
    }
  },

  bulkToggle: async (ids, enabled) => {
    try {
      await rulesService.bulkToggle(ids, enabled)
      set((state) => ({
        rules: state.rules.map((r) => (ids.includes(r.id) ? { ...r, enabled } : r)),
      }))
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to toggle rules",
      })
      throw error
    }
  },
}))
