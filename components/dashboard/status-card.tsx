"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { useHealth } from "@/lib/hooks/use-health"
import { StatusBadge } from "@/components/status-badge"
import { Wifi, Server, Heart } from "lucide-react"

export function StatusCard() {
  const { healthStatus } = useHealth(30000)

  return (
    <Card className="border-border bg-gradient-to-br from-card to-card/80 shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5 text-green-500" />
              Userbot Status
            </CardTitle>
            <CardDescription>Real-time connection information</CardDescription>
          </div>
          <StatusBadge />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <Wifi className="h-5 w-5 text-green-500" />
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <p className="font-semibold text-foreground">
                {healthStatus?.status === "ok" ? "Online" : "Offline"}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <Heart className="h-5 w-5 text-green-500" />
            <div>
              <p className="text-sm text-muted-foreground">Health</p>
              <motion.p
                animate={{
                  color: healthStatus?.status === "ok" ? ["#10b981", "#059669"] : ["#ef4444", "#dc2626"],
                }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
                className="font-semibold"
              >
                {healthStatus?.status === "ok" ? "Healthy" : "Unhealthy"}
              </motion.p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <Server className="h-5 w-5 text-green-500" />
            <div>
              <p className="text-sm text-muted-foreground">Account</p>
              <p className="font-semibold text-foreground truncate max-w-[120px]">
                {healthStatus?.message?.includes("@") 
                  ? healthStatus.message.split(" ")[0] 
                  : "@telegram_userbot"}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <div className="h-5 w-5 text-green-500">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Last Check</p>
              <p className="font-semibold text-foreground">
                Just now
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}