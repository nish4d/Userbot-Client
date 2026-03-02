import useSWR from "swr"
import { blacklistService } from "../services/blacklist-service"
import { useAppStore } from "../store/app-store"

export const useBlacklist = () => {
  const { blacklist, setBlacklist } = useAppStore()

  const { data, error, isLoading, mutate } = useSWR(
    "blacklist",
    async () => {
      const fetchedBlacklist = await blacklistService.fetchBlacklist()
      setBlacklist(fetchedBlacklist)
      return fetchedBlacklist
    },
    { revalidateOnFocus: false, dedupingInterval: 60000 },
  )

  const addUser = async (userId: number) => {
    const entry = await blacklistService.addUser(userId)
    await mutate()
    return entry
  }

  const removeUser = async (id: string) => {
    await blacklistService.removeUser(id)
    await mutate()
  }

  const bulkAdd = async (userIds: number[]) => {
    await blacklistService.bulkAdd(userIds)
    await mutate()
  }

  const bulkRemove = async (ids: string[]) => {
    await blacklistService.bulkRemove(ids)
    await mutate()
  }

  return {
    blacklist: data || blacklist,
    isLoading,
    error,
    addUser,
    removeUser,
    bulkAdd,
    bulkRemove,
    refresh: mutate,
  }
}