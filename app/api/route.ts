import { NextResponse } from "next/server"

export async function GET() {
  try {
    return NextResponse.json(
      {
        message: "Welcome to the Telegram Userbot Dashboard API",
        version: "1.0.0",
        endpoints: {
          health: "/api/health",
          rules: "/api/rules",
          blacklist: "/api/blacklist"
        },
        timestamp: new Date().toISOString(),
      },
      { status: 200 },
    )
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to load API information",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}