import { create } from "zustand"
import type { Rule, BlacklistEntry, HealthStatus } from "../types"

interface AppState {
  // Health and status
  healthStatus: HealthStatus | null
  setHealthStatus: (status: HealthStatus) => void

  // Rules
  rules: Rule[]
  setRules: (rules: Rule[]) => void
  addRule: (rule: Rule) => void
  updateRule: (id: string, updates: Partial<Rule>) => void
  deleteRule: (id: string) => void
  selectedRuleIds: Set<string>
  toggleRuleSelection: (id: string) => void
  clearRuleSelection: () => void

  // Blacklist
  blacklist: BlacklistEntry[]
  setBlacklist: (entries: BlacklistEntry[]) => void
  addBlacklistEntry: (entry: BlacklistEntry) => void
  removeBlacklistEntry: (userId: number) => void
  selectedBlacklistIds: Set<string>
  toggleBlacklistSelection: (id: string) => void
  clearBlacklistSelection: () => void

  // UI state
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  theme: "light" | "dark" | "system"
  setTheme: (theme: "light" | "dark" | "system") => void
}

export const useAppStore = create<AppState>((set) => ({
  // Health and status
  healthStatus: null,
  setHealthStatus: (status) => set({ healthStatus: status }),

  // Rules
  rules: [],
  setRules: (rules) => set({ rules }),
  addRule: (rule) => set((state) => ({ rules: [...state.rules, rule] })),
  updateRule: (id, updates) =>
    set((state) => ({
      rules: state.rules.map((r) => (r.id === id ? { ...r, ...updates } : r)),
    })),
  deleteRule: (id) =>
    set((state) => ({
      rules: state.rules.filter((r) => r.id !== id),
    })),
  selectedRuleIds: new Set(),
  toggleRuleSelection: (id) =>
    set((state) => {
      const newSet = new Set(state.selectedRuleIds)
      if (newSet.has(id)) newSet.delete(id)
      else newSet.add(id)
      return { selectedRuleIds: newSet }
    }),
  clearRuleSelection: () => set({ selectedRuleIds: new Set() }),

  // Blacklist
  blacklist: [],
  setBlacklist: (entries) => set({ blacklist: entries }),
  addBlacklistEntry: (entry) => set((state) => ({ blacklist: [...state.blacklist, entry] })),
  removeBlacklistEntry: (userId) =>
    set((state) => ({
      blacklist: state.blacklist.filter((e) => e.userId !== userId),
    })),
  selectedBlacklistIds: new Set(),
  toggleBlacklistSelection: (id) =>
    set((state) => {
      const newSet = new Set(state.selectedBlacklistIds)
      if (newSet.has(id)) newSet.delete(id)
      else newSet.add(id)
      return { selectedBlacklistIds: newSet }
    }),
  clearBlacklistSelection: () => set({ selectedBlacklistIds: new Set() }),

  // UI state
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  theme: "system",
  setTheme: (theme) => set({ theme }),
}))
