"use client"

import { useEffect, useState } from "react"
import { Shield, MessageCircle, Activity } from "lucide-react"
import { motion } from "framer-motion"
import { StatusCard } from "@/components/dashboard/status-card"
import { StatisticsCard } from "@/components/dashboard/statistics-card"
import { useAppStore } from "@/store/use-app-store"
import { useRulesStore } from "@/lib/store/use-rules-store"
import { useBlacklistStore } from "@/lib/store/use-blacklist-store"

export default function Dashboard() {
  const [mounted, setMounted] = useState(false)
  const { checkHealth } = useAppStore()
  const { fetchRules, rules } = useRulesStore()
  const { fetchBlacklist, entries: blacklistEntries } = useBlacklistStore()

  useEffect(() => {
    setMounted(true)
    checkHealth()
    fetchRules()
    fetchBlacklist()
  }, [checkHealth, fetchRules, fetchBlacklist])

  if (!mounted) return null

  const activeRulesCount = Array.isArray(rules) ? rules.filter((r) => r.enabled).length : 0
  const blacklistCount = Array.isArray(blacklistEntries) ? blacklistEntries.length : 0
  const totalRulesCount = Array.isArray(rules) ? rules.length : 0

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back to your Telegram Userbot control center</p>
      </div>

      {/* Status Section */}
      <div>
        <StatusCard />
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatisticsCard
          icon={Activity}
          label="Total Rules"
          value={totalRulesCount.toString()}
          trend="+5%"
          trendPositive
        />
        <StatisticsCard
          icon={MessageCircle}
          label="Active Rules"
          value={activeRulesCount.toString()}
          trend="+12%"
          trendPositive
        />
        <StatisticsCard
          icon={Shield}
          label="Blacklisted Users"
          value={blacklistCount.toString()}
          trend="+3"
          trendPositive
        />
      </div>

      {/* Recent Activity */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="text-center py-8 text-muted-foreground">
          <Activity className="mx-auto h-12 w-12 mb-3" />
          <p>No recent activity to display</p>
        </div>
      </div>
    </div>
  )
}