import { create } from "zustand"
import type { BlacklistEntry } from "../types"
import { blacklistService } from "../services/blacklist-service"

interface BlacklistState {
  entries: BlacklistEntry[]
  loading: boolean
  error: string | null
  fetchBlacklist: () => Promise<void>
  addToBlacklist: (userId: number, reason?: string) => Promise<BlacklistEntry>
  removeFromBlacklist: (id: string) => Promise<void>
  bulkAdd: (userIds: number[]) => Promise<void>
  bulkRemove: (ids: string[]) => Promise<void>
}

export const useBlacklistStore = create<BlacklistState>((set) => ({
  entries: [],
  loading: false,
  error: null,

  fetchBlacklist: async () => {
    set({ loading: true, error: null })
    try {
      const entries = await blacklistService.fetchBlacklist()
      set({ entries, loading: false })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to fetch blacklist",
        loading: false,
      })
    }
  },

  addToBlacklist: async (userId, reason) => {
    try {
      const entry = await blacklistService.addUser(userId, reason)
      set((state) => ({ entries: [...state.entries, entry] }))
      return entry
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to add user",
      })
      throw error
    }
  },

  removeFromBlacklist: async (id) => {
    try {
      await blacklistService.removeUser(id)
      set((state) => ({
        entries: state.entries.filter((e) => e.id !== id),
      }))
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to remove user",
      })
      throw error
    }
  },

  bulkAdd: async (userIds) => {
    try {
      await blacklistService.bulkAdd(userIds)
      const newEntries = userIds.map((id) => ({
        id: Date.now().toString(),
        userId: id,
        addedAt: new Date(),
      }))
      set((state) => ({
        entries: [...state.entries, ...newEntries],
      }))
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to add users",
      })
      throw error
    }
  },

  bulkRemove: async (ids) => {
    try {
      await blacklistService.bulkRemove(ids)
      set((state) => ({
        entries: state.entries.filter((e) => !ids.includes(e.id)),
      }))
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to remove users",
      })
      throw error
    }
  },
}))