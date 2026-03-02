// Type definitions for userbot data
export interface Rule {
  id: string
  trigger?: string | null
  triggers: string[]
  response: string
  image_url?: string | null
  enabled: boolean
  createdAt?: Date
  updatedAt?: Date
}

export interface BlacklistEntry {
  id: string
  userId: number
  username?: string
  addedAt: Date
  reason?: string
}

export interface HealthStatus {
  status: "ok" | "error"
  message: string
  timestamp?: string
  database?: "ok" | "error"
  uptime?: number
  lastCheck?: Date
}

export interface Statistics {
  totalMessages: number
  totalReplies: number
  activeRules: number
  blacklistedUsers: number
  averageResponseTime: number
}

export interface Activity {
  id: string
  type: "message" | "reply" | "block" | "rule_created" | "rule_updated"
  description: string
  timestamp: Date
  userId?: number
  ruleId?: string
  metadata?: Record<string, any>
}

export interface MessageMetric {
  date: string
  received: number
  replied: number
}

export interface TriggerMetric {
  trigger: string
  count: number
  percentage: number
}

export interface ResponseTimeMetric {
  range: string
  count: number
}

export interface HeatmapData {
  day: string
  hour: number
  value: number
}

export interface AnalyticsData {
  messages: MessageMetric[]
  triggers: TriggerMetric[]
  responseTimes: ResponseTimeMetric[]
  heatmap: HeatmapData[]
  summary: {
    weekMessages: number
    monthMessages: number
    mostActiveHour: string
    topTrigger: string
  }
}