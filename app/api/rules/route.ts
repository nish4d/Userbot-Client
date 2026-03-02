import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    // Proxy request to backend
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://userbot-blue.vercel.app"
    
    // Add timeout and signal support for fetch
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch(`${backendUrl}/api/rules`, {
      signal: controller.signal,
      headers: {
        'Cache-Control': 'no-cache',
      }
    })
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      console.warn(`[API/Rules] Backend returned ${response.status}`)
      return NextResponse.json(
        { 
          error: `Backend returned ${response.status}`,
          rules: [] // Return empty array as fallback
        }, 
        { status: response.status }
      )
    }
    
    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error: any) {
    // Handle timeout or network errors gracefully
    if (error?.name === 'AbortError') {
      console.error("[API/Rules] Request timeout")
      return NextResponse.json(
        { 
          error: "Request timeout connecting to backend",
          rules: [] // Return empty array as fallback
        }, 
        { status: 504 } // Gateway Timeout
      )
    }
    
    console.error("[API/Rules] Proxy error:", error)
    return NextResponse.json({ error: "Failed to connect to backend", rules: [] }, { status: 502 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Proxy request to backend
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://userbot-blue.vercel.app"
    const body = await request.json()
    
    // Add timeout and signal support for fetch
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch(`${backendUrl}/api/rules`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    })
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      console.warn(`[API/Rules] Backend returned ${response.status}`)
      return NextResponse.json(
        { error: `Backend returned ${response.status}` }, 
        { status: response.status }
      )
    }
    
    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error: any) {
    // Handle timeout or network errors gracefully
    if (error?.name === 'AbortError') {
      console.error("[API/Rules] Request timeout")
      return NextResponse.json(
        { error: "Request timeout connecting to backend" }, 
        { status: 504 } // Gateway Timeout
      )
    }
    
    console.error("[API/Rules] Proxy error:", error)
    return NextResponse.json({ error: "Failed to connect to backend" }, { status: 502 })
  }
}