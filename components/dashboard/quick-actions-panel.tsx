"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Eye, Settings, BarChart3, Bot, FileText } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

const actions = [
  { label: "Add New Rule", href: "/dashboard/auto-reply", icon: Plus, color: "bg-blue-500" },
  { label: "View Blacklist", href: "/dashboard/blacklist", icon: Eye, color: "bg-red-500" },
  { label: "System Settings", href: "/dashboard/settings", icon: Settings, color: "bg-gray-500" },
  { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3, color: "bg-green-500" },
  { label: "Bot Status", href: "/dashboard/status", icon: Bot, color: "bg-purple-500" },
  { label: "Documentation", href: "/dashboard/help", icon: FileText, color: "bg-yellow-500" },
]

export function QuickActionsPanel() {
  return (
    <Card className="border-border bg-card sticky top-6 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-primary/10">
            <Settings className="h-4 w-4 text-primary" />
          </div>
          Quick Actions
        </CardTitle>
        <CardDescription>Access common features quickly</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action, index) => {
            const Icon = action.icon
            return (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -2 }}
                className="aspect-square"
              >
                <Link href={action.href} className="block h-full">
                  <Button
                    variant="outline"
                    className="w-full h-full flex flex-col items-center justify-center gap-2 border-border hover:bg-primary/5 bg-transparent p-3"
                  >
                    <div className={`p-2 rounded-lg ${action.color}`}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-xs font-medium text-foreground">{action.label}</span>
                  </Button>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
