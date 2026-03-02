import useSWR from "swr"
import { rulesService } from "../services/rules-service"
import { useAppStore } from "../store/app-store"
import type { Rule } from "../types"

export const useRules = () => {
  const { rules, setRules } = useAppStore()

  const { data, error, isLoading, mutate } = useSWR(
    "rules",
    async () => {
      const fetchedRules = await rulesService.fetchRules()
      setRules(fetchedRules)
      return fetchedRules
    },
    { revalidateOnFocus: false, dedupingInterval: 60000 },
  )

  const createRule = async (rule: {
    triggers: string[]
    response: string
    enabled?: boolean
  }) => {
    const newRule = await rulesService.createRule(rule)
    await mutate()
    return newRule
  }

  const updateRule = async (id: string, updates: Partial<Rule>) => {
    const updated = await rulesService.updateRule(id, updates)
    await mutate()
    return updated
  }

  const deleteRule = async (id: string) => {
    await rulesService.deleteRule(id)
    await mutate()
  }

  const bulkDelete = async (ids: string[]) => {
    await rulesService.bulkDelete(ids)
    await mutate()
  }

  const bulkToggle = async (ids: string[], enabled: boolean) => {
    await rulesService.bulkToggle(ids, enabled)
    await mutate()
  }

  return {
    rules: data || rules,
    loading: isLoading,
    error,
    createRule,
    updateRule,
    deleteRule,
    bulkDelete,
    bulkToggle,
    mutate,
  }
}
