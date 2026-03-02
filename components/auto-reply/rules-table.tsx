"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Trash2, Edit2, Copy } from "lucide-react"
import { useRulesStore } from "@/lib/store/use-rules-store" // Updated imports to use new store location
import { useToast } from "@/hooks/use-toast"
import { EditRuleModal } from "./edit-rule-modal"
import { RulesTableSkeleton } from "./rules-table-skeleton"
import type { Rule } from "@/lib/types"

interface RulesTableProps {
  searchTerm: string
  sortBy: string
  isLoading?: boolean
}

export function RulesTable({ searchTerm, sortBy, isLoading }: RulesTableProps) {
  const { rules, deleteRule, toggleRule, bulkDelete, error } = useRulesStore()
  const { toast } = useToast()
  const [selectedRules, setSelectedRules] = useState<string[]>([])
  const [editingRule, setEditingRule] = useState<Rule | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const filteredRules = rules
    .filter((rule) => {
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      // Check in triggers array
      if (rule.triggers && rule.triggers.some(trigger => trigger.toLowerCase().includes(term))) {
        return true;
      }
      // Check in legacy trigger field
      if (rule.trigger && rule.trigger.toLowerCase().includes(term)) {
        return true;
      }
      return false;
    })
    .sort((a, b) => {
      if (sortBy === "status") return Number(b.enabled) - Number(a.enabled)
      if (sortBy === "trigger") {
        const aTrigger = (a.triggers && a.triggers[0]) || a.trigger || ""
        const bTrigger = (b.triggers && b.triggers[0]) || b.trigger || ""
        return aTrigger.localeCompare(bTrigger)
      }
      return 0
    })

  const handleToggle = async (ruleId: string) => {
    try {
      await toggleRule(ruleId)
      toast({
        title: "Success",
        description: "Rule status updated",
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update rule",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (ruleId: string) => {
    try {
      await deleteRule(ruleId)
      setSelectedRules(selectedRules.filter((id) => id !== ruleId))
      toast({
        title: "Success",
        description: "Rule deleted",
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete rule",
        variant: "destructive",
      })
    }
  }

  const toggleSelectAll = () => {
    if (selectedRules.length === rules.length) {
      setSelectedRules([])
    } else {
      setSelectedRules(rules.map((r) => r.id))
    }
  }

  if (isLoading) return <RulesTableSkeleton />

  return (
    <>
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Active Rules ({filteredRules.length})</CardTitle>
              <CardDescription>Manage your automatic reply triggers</CardDescription>
            </div>
            {selectedRules.length > 0 && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={async () => {
                    try {
                      await bulkDelete(selectedRules);
                      setSelectedRules([]);
                      toast({
                        title: "Success",
                        description: `${selectedRules.length} rule(s) deleted`,
                      });
                    } catch (err) {
                      toast({
                        title: "Error",
                        description: "Failed to delete rules",
                        variant: "destructive",
                      });
                    }
                  }}
                  className="border-border text-destructive hover:bg-destructive/10 bg-transparent"
                >
                  Delete Selected ({selectedRules.length})
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
                      checked={selectedRules.length === rules.length && rules.length > 0}
                      onChange={toggleSelectAll}
                      className="rounded border-border"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-muted-foreground font-medium">Triggers</th>
                  <th className="px-4 py-3 text-left text-muted-foreground font-medium">Response</th>
                                    <th className="px-4 py-3 text-left text-muted-foreground font-medium">Image</th>
                  <th className="px-4 py-3 text-center text-muted-foreground font-medium">Status</th>
                  <th className="px-4 py-3 text-center text-muted-foreground font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredRules.map((rule, index) => (
                    <motion.tr
                      key={rule.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-border hover:bg-muted/30 transition-smooth"
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedRules.includes(rule.id)}
                          onChange={() =>
                            setSelectedRules(
                              selectedRules.includes(rule.id)
                                ? selectedRules.filter((id) => id !== rule.id)
                                : [...selectedRules, rule.id],
                            )
                          }
                          className="rounded border-border"
                        />
                      </td>
                      <td className="px-4 py-3 font-medium">
                        {rule.triggers && rule.triggers.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {rule.triggers.map((trigger, index) => (
                              <code key={index} className="bg-muted/50 px-2 py-1 rounded text-foreground text-xs">
                                {trigger}
                              </code>
                            ))}
                          </div>
                        ) : rule.trigger ? (
                          <code className="bg-muted/50 px-2 py-1 rounded text-foreground">{rule.trigger}</code>
                        ) : (
                          <Badge variant="secondary">Default</Badge>
                        )}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground truncate max-w-xs">{rule.response}</td>
                                            <td className="px-4 py-3 w-24">
                                              {rule.image_url ? (
                                                <img 
                                                  src={rule.image_url} 
                                                  alt="Rule attachment" 
                                                  className="w-16 h-16 object-cover rounded border border-border"
                                                />
                                              ) : (
                                                <span className="text-muted-foreground text-xs">None</span>
                                              )}
                                            </td>
                      <td className="px-4 py-3 text-center">
                        <motion.div whileHover={{ scale: 1.05 }} onClick={() => handleToggle(rule.id)}>
                          <Switch checked={rule.enabled} />
                        </motion.div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigator.clipboard.writeText(rule.response).then(() => {
                              toast({
                                title: "Copied",
                                description: "Rule response copied to clipboard",
                              });
                            })}
                            className="p-2 hover:bg-muted/30 rounded transition-smooth"
                          >
                            <Copy className="w-4 h-4 text-muted-foreground" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              setEditingRule(rule);
                              setIsEditModalOpen(true);
                            }}
                            className="p-2 hover:bg-muted/30 rounded transition-smooth"
                          >
                            <Edit2 className="w-4 h-4 text-muted-foreground" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDelete(rule.id)}
                            className="p-2 hover:bg-destructive/10 rounded transition-smooth"
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
          {filteredRules.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8 text-muted-foreground"
            >
              No rules found matching your search.
            </motion.div>
          )}
        </CardContent>
      </Card>
      <EditRuleModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        rule={editingRule} 
      />
    </>
  )
}
