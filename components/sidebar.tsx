"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, MessageCircle, Shield, BarChart3, Settings, HelpCircle, Terminal } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Auto Reply", href: "/dashboard/auto-reply", icon: MessageCircle },
  { name: "Blacklist", href: "/dashboard/blacklist", icon: Shield },
  // { name: "Settings", href: "/dashboard/settings", icon: Settings },
  { name: "Help", href: "/dashboard/help", icon: HelpCircle },
]

interface SidebarProps {
  isOpen: boolean
}

export function Sidebar({ isOpen }: SidebarProps) {
  const pathname = usePathname()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  }

  return (
    <motion.aside
      animate={{ width: isOpen ? 280 : 80 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="bg-sidebar border-r border-sidebar-border overflow-hidden flex flex-col"
    >
      <div className="h-16 flex items-center justify-center border-b border-sidebar-border">
        <motion.div
          animate={{ scale: isOpen ? 1 : 0.8 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 via-emerald-400 to-green-600 rounded-lg flex items-center justify-center">
            <Terminal className="w-6 h-6 text-primary-foreground" />
          </div>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="font-bold text-sidebar-foreground whitespace-nowrap"
            >
              Userbot
            </motion.div>
          )}
        </motion.div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 space-y-5 px-3">
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <motion.div key={item.href} variants={itemVariants}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg transition-smooth group relative overflow-hidden mb-2",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent",
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-400/20 -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {isOpen && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className="text-sm font-medium whitespace-nowrap"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </Link>
              </motion.div>
            )
          })}
        </motion.div>
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xs text-sidebar-foreground/60 text-center"
        >
          {isOpen && <div>v1.0.0</div>}
        </motion.div>
      </div>
    </motion.aside>
  )
}
