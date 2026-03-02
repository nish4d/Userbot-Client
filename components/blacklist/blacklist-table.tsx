"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, CheckCircle2 } from "lucide-react"
import { format } from "date-fns"
import { useBlacklistStore } from "@/lib/store/use-blacklist-store" // Updated imports to use new store location
import { useToast } from "@/hooks/use-toast"
import { LoadingSkeleton } from "../loading-skeleton"

interface BlacklistTableProps {
  searchTerm: string
  filterBy: string
  isLoading?: boolean
}

export function BlacklistTable({ searchTerm, filterBy, isLoading }: BlacklistTableProps) {
  const { entries, removeFromBlacklist, error } = useBlacklistStore()
  const { toast } = useToast()
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])

  const filteredList = entries
    .filter(
      (item) =>
        !searchTerm ||
        item.userId.toString().includes(searchTerm) ||
        item.username?.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      if (filterBy === "recent") return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
      if (filterBy === "oldest") return new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime()
      return 0
    })

  const handleDelete = async (id: string) => {
    try {
      await removeFromBlacklist(id)
      setSelectedUsers(selectedUsers.filter((selectedId) => selectedId !== id))
      toast({
        title: "Success",
        description: "User removed from blacklist",
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to remove user",
        variant: "destructive",
      })
    }
  }

  const toggleSelectAll = () => {
    if (selectedUsers.length === entries.length) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(entries.map((u) => u.id))
    }
  }

  if (isLoading) return <LoadingSkeleton />

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Blocked Users ({filteredList.length})</CardTitle>
            <CardDescription>Manage your blacklist entries</CardDescription>
          </div>
          {selectedUsers.length > 0 && (
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="border-border text-destructive hover:bg-destructive/10 bg-transparent"
              >
                Delete ({selectedUsers.length})
              </Button>
            </motion.div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive"
          >
            {error}
          </motion.div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === entries.length && entries.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-border"
                  />
                </th>
                <th className="px-4 py-3 text-left text-muted-foreground font-medium">User ID</th>
                <th className="px-4 py-3 text-left text-muted-foreground font-medium">Username</th>
                <th className="px-4 py-3 text-left text-muted-foreground font-medium">Date Added</th>
                <th className="px-4 py-3 text-center text-muted-foreground font-medium">Status</th>
                <th className="px-4 py-3 text-center text-muted-foreground font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredList.map((item, index) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-border hover:bg-muted/30 transition-smooth"
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(item.id)}
                        onChange={() =>
                          setSelectedUsers(
                            selectedUsers.includes(item.id)
                              ? selectedUsers.filter((id) => id !== item.id)
                              : [...selectedUsers, item.id],
                          )
                        }
                        className="rounded border-border"
                      />
                    </td>
                    <td className="px-4 py-3 font-mono text-foreground">{item.userId}</td>
                    <td className="px-4 py-3">
                      {item.username ? (
                        <span className="text-foreground">{item.username}</span>
                      ) : (
                        <span className="text-muted-foreground italic">Unknown</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">
                      {format(new Date(item.addedAt), "MMM dd, yyyy")}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <motion.div whileHover={{ scale: 1.05 }} className="flex justify-center">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      </motion.div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDelete(item.id)}
                        className="p-2 hover:bg-destructive/10 rounded transition-smooth inline-block"
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        {filteredList.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8 text-muted-foreground"
          >
            No blocked users found.
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
}