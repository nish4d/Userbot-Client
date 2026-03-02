import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    // Proxy request to backend
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://userbot-blue.vercel.app"
    const response = await fetch(`${backendUrl}/api/rules`)
    
    if (!response.ok) {
      throw new Error(`Backend returned ${response.status}`)
    }
    
    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("[API/Rules] Proxy error:", error)
    return NextResponse.json({ error: "Failed to connect to backend" }, { status: 502 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Proxy request to backend
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://userbot-blue.vercel.app"
    const body = await request.json()
    
    const response = await fetch(`${backendUrl}/api/rules`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    
    if (!response.ok) {
      throw new Error(`Backend returned ${response.status}`)
    }
    
    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("[API/Rules] Proxy error:", error)
    return NextResponse.json({ error: "Failed to connect to backend" }, { status: 502 })
  }
}