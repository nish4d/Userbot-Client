import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-semibold tracking-tight">
            Userbot Dashboard
          </Link>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost">
              <a href="/EXE/TelegramSessionGenerator.exe" download>
                EXE Download
              </a>
            </Button>
            <Button asChild>
              <Link href="/login">Login</Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute -top-24 left-1/2 h-72 w-[48rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-emerald-500/25 via-cyan-500/25 to-violet-500/25 blur-3xl" />
            <div className="absolute -bottom-24 left-1/2 h-72 w-[48rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-violet-500/20 via-emerald-500/20 to-cyan-500/20 blur-3xl" />
          </div>

          <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
            <div className="max-w-3xl">
              <div className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
                Telegram automation, managed with clarity
              </div>

              <h1 className="mt-4 text-4xl sm:text-5xl font-bold tracking-tight">
                Professional control panel for your Telegram Userbot
              </h1>
              <p className="mt-4 text-base sm:text-lg text-muted-foreground">
                Create auto-reply rules, manage blacklists, and monitor status from a fast, modern dashboard. Start by
                downloading the Telegram token tool, then sign in.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Button asChild size="lg">
                  <a href="/EXE/TelegramSessionGenerator.exe" download>
                    EXE Download
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/login">Continue to Login</Link>
                </Button>
              </div>

              <div className="mt-6 text-sm text-muted-foreground">
                Download not working? Put your file at{" "}
                <span className="font-medium text-foreground">Dashboard/public/exe/TelegramSessionGenerator.exe</span>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-14">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Real-time Overview</CardTitle>
                <CardDescription>Health, rules, and blacklist at a glance</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                A clean dashboard for monitoring your automation setup.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Auto Reply Engine</CardTitle>
                <CardDescription>Create rules that respond for you</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Manage rule templates and quickly enable/disable behaviors.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Blacklist Control</CardTitle>
                <CardDescription>Reduce spam and unwanted interactions</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Add users to blacklist and keep the bot focused and safe.
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-16">
          <Card>
            <CardHeader>
              <CardTitle>How it works</CardTitle>
              <CardDescription>A simple setup flow</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-lg border border-border bg-background p-4">
                  <div className="text-sm font-medium">1) Download</div>
                  <div className="mt-1 text-sm text-muted-foreground">Get the Telegram token EXE from the landing page.</div>
                </div>
                <div className="rounded-lg border border-border bg-background p-4">
                  <div className="text-sm font-medium">2) Login</div>
                  <div className="mt-1 text-sm text-muted-foreground">Sign in to the dashboard using your credentials.</div>
                </div>
                <div className="rounded-lg border border-border bg-background p-4">
                  <div className="text-sm font-medium">3) Manage</div>
                  <div className="mt-1 text-sm text-muted-foreground">Configure rules and blacklist from the dashboard.</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <footer className="border-t border-border">
          <div className="mx-auto max-w-6xl px-6 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="font-semibold">Userbot Dashboard</div>
              <div className="text-sm text-muted-foreground">Telegram Userbot Management Dashboard</div>
            </div>
            <div className="flex items-center gap-2">
              <Button asChild variant="outline">
                <a href="/EXE/TelegramSessionGenerator.exe" download>
                  EXE Download
                </a>
              </Button>
              <Button asChild>
                <Link href="/login">Login</Link>
              </Button>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}
