"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, MessageCircle } from "lucide-react"

export default function HelpPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Contact Developer</h1>
        <p className="text-muted-foreground mt-1">Reach out to the development team for support</p>
      </div>

      {/* Contact Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary" />
              Email Support
            </CardTitle>
            <CardDescription>Direct email communication</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">For urgent technical issues and direct communication with developers.</p>
            <div className="text-sm font-mono bg-muted p-2 rounded">
              dev-support@example.com
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-primary" />
              Developer Chat
            </CardTitle>
            <CardDescription>Real-time communication</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">Join our developer Discord/Slack channel for real-time support.</p>
            <div className="text-sm font-mono bg-muted p-2 rounded">
              discord.gg/userbot-dev
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Response Time */}
      <div>
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle>Response Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Our development team typically responds to emails within 24 hours.
              For urgent matters, please use the email support option.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
