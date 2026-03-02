import { create } from "zustand"
import { blacklistService } from "@/lib/services/blacklist-service"
import type { BlacklistEntry } from "@/lib/types"

interface BlacklistState {
  entries: BlacklistEntry[]
  isLoading: boolean
  error: string | null

  // Actions
  fetchBlacklist: () => Promise<void>
  addToBlacklist: (userId: number) => Promise<BlacklistEntry>
  removeFromBlacklist: (id: string) => Promise<void>
}

export const useBlacklistStore = create<BlacklistState>((set, get) => ({
  entries: [],
  isLoading: false,
  error: null,

  fetchBlacklist: async () => {
    set({ isLoading: true, error: null })
    try {
      const entries = await blacklistService.fetchBlacklist()
      set({ entries })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to fetch blacklist",
      })
    } finally {
      set({ isLoading: false })
    }
  },

  addToBlacklist: async (userId: number) => {
    try {
      const entry = await blacklistService.addUser(userId)
      await get().fetchBlacklist()
      return entry
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to add to blacklist",
      })
      throw error
    }
  },

  removeFromBlacklist: async (id: string) => {
    try {
      await blacklistService.removeUser(id)
      set({
        entries: get().entries.filter((entry) => entry.id !== id),
      })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to remove from blacklist",
      })
      throw error
    }
  },
}))