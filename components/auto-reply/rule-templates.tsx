"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface Template {
  id: number
  name: string
  description: string
  triggers: string[]
  response: string
}

interface RuleTemplatesProps {
  onUseTemplate?: (template: Template) => void
}

const templates = [
  {
    id: 1,
    name: "Greeting",
    description: "Automatic greeting when someone says hello",
    triggers: ["hello", "hi", "hey"],
    response: "Hi! How can I help you today?",
  },
  {
    id: 2,
    name: "Help Command",
    description: "Display available commands",
    triggers: ["help", "support"],
    response:
      "Available commands:\n/start - Begin conversation\n/help - Show this message\n/status - Get current status",
  },
  {
    id: 3,
    name: "Away Message",
    description: "Let users know you are away",
    triggers: ["away", "busy"],
    response: "I'm currently away and will respond to messages when I return.",
  },
  {
    id: 4,
    name: "Business Hours",
    description: "Inform about working hours",
    triggers: ["hours", "time"],
    response: "I'm available Monday-Friday, 9 AM - 6 PM EST.",
  },
]

export function RuleTemplates({ onUseTemplate }: RuleTemplatesProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-foreground">Quick Templates</h2>
        <p className="text-sm text-muted-foreground">Get started with pre-built response templates</p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {templates.map((template) => (
          <motion.div key={template.id} whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
            <Card className="border-border bg-card/50 hover:bg-card transition-smooth cursor-pointer h-full flex flex-col">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">{template.name}</CardTitle>
                <CardDescription className="text-xs">{template.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Triggers:</p>
                  <div className="flex flex-wrap gap-1">
                    {template.triggers.map((trigger, index) => (
                      <code key={index} className="text-xs bg-muted/50 px-2 py-1 rounded text-foreground">
                        {trigger}
                      </code>
                    ))}
                  </div>
                </div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button 
                    size="sm" 
                    className="w-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
                    onClick={() => onUseTemplate && onUseTemplate({
                      ...template,
                      trigger: template.triggers[0]
                    } as any)}
                  >
                    <Plus className="w-3 h-3" />
                    Use Template
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
