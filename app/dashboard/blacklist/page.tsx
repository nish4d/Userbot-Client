"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Plus, Search, Download, Upload, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { BlacklistTable } from "@/components/blacklist/blacklist-table"
import { AddUserModal } from "@/components/blacklist/add-user-modal"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useBlacklistStore } from "@/lib/store/use-blacklist-store"

export default function BlacklistPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterBy, setFilterBy] = useState<"all" | "recent" | "oldest">("all")
  const { fetchBlacklist, entries, loading: isLoading, error } = useBlacklistStore()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  }

  useEffect(() => {
    fetchBlacklist()
  }, [fetchBlacklist])

  return (
    <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible">
      <motion.div variants={itemVariants}>
        <div className="flex justify-between items-start">
          <h1 className="text-3xl font-bold text-foreground">Blacklist Management</h1>
          <span className="text-md text-red-600 italic">(need to update this page)</span>
        </div>
        <p className="text-muted-foreground mt-1">Manage blocked users and IDs</p>
      </motion.div>

      {error && (
        <motion.div variants={itemVariants}>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </motion.div>
      )}

      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-border bg-card/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total Blocked</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">{entries.length}</p>
            <p className="text-xs text-muted-foreground mt-1">+3 this week</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Blocked Today</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">
              {
                entries.filter((e) => {
                  const today = new Date().toDateString()
                  return new Date(e.addedAt).toDateString() === today
                }).length
              }
            </p>
            <p className="text-xs text-muted-foreground mt-1">Recently added</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card/50">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Active Blocks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">{entries.length}</p>
            <p className="text-xs text-muted-foreground mt-1">0 inactive</p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by user ID or username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={filterBy}
          onChange={(e) => setFilterBy(e.target.value as any)}
          className="px-3 py-2 rounded-lg border border-border bg-card text-foreground text-sm"
        >
          <option value="all">All</option>
          <option value="recent">Recently Added</option>
          <option value="oldest">Oldest First</option>
        </select>
        <Button variant="outline" size="sm" className="gap-2 border-border bg-transparent">
          <Download className="w-4 h-4" />
          Export
        </Button>
        <Button variant="outline" size="sm" className="gap-2 border-border bg-transparent">
          <Upload className="w-4 h-4" />
          Import
        </Button>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2 bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4" />
          Block User
        </Button>
      </motion.div>

      <motion.div variants={itemVariants}>
        <BlacklistTable searchTerm={searchTerm} filterBy={filterBy} isLoading={isLoading} />
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="border-border bg-card/50">
          <CardHeader>
            <CardTitle>Bulk Import</CardTitle>
            <CardDescription>Import a CSV or JSON file with user IDs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-smooth">
              <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm font-medium text-foreground">Click to upload or drag and drop</p>
              <p className="text-xs text-muted-foreground mt-1">CSV, JSON up to 10MB</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <AddUserModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </motion.div>
  )
}
