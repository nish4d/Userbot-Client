"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Plus, Search, Download, Upload, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RulesTable } from "@/components/auto-reply/rules-table"
import { AddRuleModal } from "@/components/auto-reply/add-rule-modal"
import { RuleTemplates } from "@/components/auto-reply/rule-templates"
import { useRulesStore } from "@/lib/store/use-rules-store"

export default function AutoReplyPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalInitialValues, setModalInitialValues] = useState<{ trigger?: string; response?: string; enabled?: boolean; image_url?: string } | undefined>(undefined)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<"status" | "created" | "trigger">("created")
  const { fetchRules, loading, error } = useRulesStore()

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
    fetchRules()
  }, [fetchRules])

  return (
    <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible">
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold text-foreground">Auto Reply Rules</h1>
        <p className="text-muted-foreground mt-1">Manage automatic message responses</p>
      </motion.div>

      {error && (
        <motion.div variants={itemVariants}>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </motion.div>
      )}

      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search rules by triggers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="px-3 py-2 rounded-lg border border-border bg-card text-foreground text-sm"
        >
          <option value="created">Sort by Created</option>
          <option value="status">Sort by Status</option>
          <option value="trigger">Sort by Triggers</option>
        </select>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2 bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4" />
          Add Rule
        </Button>
      </motion.div>

      <motion.div variants={itemVariants}>
        <RulesTable searchTerm={searchTerm} sortBy={sortBy} isLoading={loading} />
      </motion.div>

      <motion.div variants={itemVariants}>
        <RuleTemplates onUseTemplate={(template: { triggers: string[]; response: string }) => {
          setModalInitialValues({
            trigger: template.triggers[0],
            response: template.response,
            enabled: true
          });
          setIsModalOpen(true);
        }} />
      </motion.div>

      <AddRuleModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setModalInitialValues(undefined); // Clear initial values
          fetchRules(); // Refresh rules after closing the modal
        }} 
        initialValues={modalInitialValues}
      />
    </motion.div>
  )
}
