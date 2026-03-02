"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatisticsCardProps {
  icon: LucideIcon
  label: string
  value: string
  trend: string
  trendPositive: boolean
}

export function StatisticsCard({ icon: Icon, label, value, trend, trendPositive }: StatisticsCardProps) {
  return (
    <motion.div 
      whileHover={{ y: -5 }} 
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <Card className="border-border bg-card hover:bg-card/90 transition-all h-full flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
          <div className="p-2 rounded-lg bg-green-500/10">
            <Icon className="w-4 h-4 text-green-500" />
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-between pt-2">
          <div className="text-3xl font-bold text-foreground">{value}</div>
          <div className="flex items-center justify-between mt-4">
            <motion.p
              className={cn("text-sm font-medium flex items-center gap-1", trendPositive ? "text-emerald-500" : "text-red-500")}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
            >
              {trendPositive ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                  <polyline points="16 7 22 7 22 13" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 17 13.5 8.5 8.5 13.5 2 7" />
                  <polyline points="16 17 22 17 22 11" />
                </svg>
              )}
              {trend}
            </motion.p>
            <div className="text-xs text-muted-foreground">Last 30 days</div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
