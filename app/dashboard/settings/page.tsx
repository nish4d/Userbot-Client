"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Lock, LogOut, Zap } from "lucide-react"

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false)
  const [typingDelay, setTypingDelay] = useState(500)
  const [floodWaitEnabled, setFloodWaitEnabled] = useState(true)

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

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    setIsSaving(false)
  }

  return (
    <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible">
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Configure userbot behavior and preferences</p>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={itemVariants}>
        <Tabs defaultValue="account" className="space-y-4">
          <TabsList className="bg-muted border border-border">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="api">API Configuration</TabsTrigger>
            <TabsTrigger value="behavior">Behavior</TabsTrigger>
            <TabsTrigger value="ui">UI Preferences</TabsTrigger>
          </TabsList>

          {/* Account Settings */}
          <TabsContent value="account" className="space-y-4">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your Telegram account connection</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Connected Account</label>
                  <div className="p-3 bg-muted/30 rounded-lg border border-border">
                    <p className="font-medium text-foreground">@username_bot</p>
                    <p className="text-xs text-muted-foreground mt-1">ID: 1234567890</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Status</label>
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <p className="text-sm text-emerald-600 dark:text-emerald-400">Connected and Active</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Last Sync</label>
                  <p className="text-sm text-muted-foreground">2 minutes ago</p>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button variant="outline" className="gap-2 border-border bg-transparent">
                    <Lock className="w-4 h-4" />
                    Re-authenticate
                  </Button>
                  <Button variant="destructive" className="gap-2 ml-auto">
                    <LogOut className="w-4 h-4" />
                    Disconnect
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Session Management */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-lg">Session Management</CardTitle>
                <CardDescription>Manage active sessions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-muted/30 rounded-lg flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground text-sm">Current Session</p>
                    <p className="text-xs text-muted-foreground mt-1">Chrome on Windows</p>
                  </div>
                  <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">Active</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* API Configuration */}
          <TabsContent value="api" className="space-y-4">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle>API Credentials</CardTitle>
                <CardDescription>Manage your API keys and credentials</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">API Hash</label>
                  <div className="flex gap-2">
                    <Input
                      type="password"
                      value="••••••••••••••••••••••••••••••••"
                      readOnly
                      className="bg-input border-border"
                    />
                    <Button variant="outline" size="sm" className="border-border bg-transparent">
                      Copy
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">Keep this secret</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">API ID</label>
                  <Input type="password" value="••••••••••" readOnly className="bg-input border-border" />
                </div>

                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                  <p className="text-sm text-amber-600 dark:text-amber-400">
                    Never share your API credentials with anyone
                  </p>
                </div>

                <Button
                  variant="outline"
                  className="border-border text-destructive hover:bg-destructive/10 w-full bg-transparent"
                >
                  Regenerate Credentials
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Behavior Settings */}
          <TabsContent value="behavior" className="space-y-4">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle>Typing Behavior</CardTitle>
                <CardDescription>Configure how the userbot sends messages</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Typing Delay Range</label>
                  <div className="flex gap-2 items-center">
                    <Input
                      type="number"
                      value={typingDelay}
                      onChange={(e) => setTypingDelay(Number(e.target.value))}
                      className="w-20 bg-input border-border"
                    />
                    <span className="text-sm text-muted-foreground">ms</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Delay before sending responses</p>
                </div>

                <div className="space-y-3 pt-4">
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div>
                      <p className="font-medium text-foreground text-sm">Show typing indicator</p>
                      <p className="text-xs text-muted-foreground">Display "typing..." status</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div>
                      <p className="font-medium text-foreground text-sm">Message formatting</p>
                      <p className="text-xs text-muted-foreground">Use markdown and HTML</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  FloodWait Handling
                </CardTitle>
                <CardDescription>How to handle rate limits</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div>
                    <p className="font-medium text-foreground text-sm">Auto-retry on flood</p>
                    <p className="text-xs text-muted-foreground">Automatically retry after delay</p>
                  </div>
                  <Switch checked={floodWaitEnabled} onChange={setFloodWaitEnabled} />
                </div>

                {floodWaitEnabled && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Max Retry Count</label>
                    <Input type="number" defaultValue={3} className="bg-input border-border" />
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* UI Preferences */}
          <TabsContent value="ui" className="space-y-4">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle>Display Options</CardTitle>
                <CardDescription>Customize your dashboard appearance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground block">Theme</label>
                  <div className="grid grid-cols-3 gap-2">
                    {["Light", "Dark", "System"].map((theme) => (
                      <Button key={theme} variant="outline" className="border-border bg-transparent">
                        {theme}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground block">Animation Intensity</label>
                  <div className="space-y-2">
                    {["Reduced", "Normal", "Enhanced"].map((level) => (
                      <label key={level} className="flex items-center gap-2">
                        <input type="radio" name="animation" defaultChecked={level === "Normal"} className="w-4 h-4" />
                        <span className="text-sm text-foreground">{level}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div>
                    <p className="font-medium text-foreground text-sm">Compact mode</p>
                    <p className="text-xs text-muted-foreground">Reduce spacing</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Save Button */}
      <motion.div variants={itemVariants} className="flex gap-2">
        <Button onClick={handleSave} disabled={isSaving} className="bg-primary hover:bg-primary/90">
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
        <Button variant="outline" className="border-border bg-transparent">
          Discard
        </Button>
      </motion.div>
    </motion.div>
  )
}
