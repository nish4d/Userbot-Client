import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Proxy request to backend
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://userbot-blue.vercel.app"
    const response = await fetch(`${backendUrl}/api/health`)
    
    if (!response.ok) {
      throw new Error(`Backend returned ${response.status}`)
    }
    
    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("[API/Health] Proxy error:", error)
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to connect to backend",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 502 }
    )
  }
}