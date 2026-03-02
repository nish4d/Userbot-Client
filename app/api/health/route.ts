import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Proxy request to backend
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://userbot-blue.vercel.app"
    
    // Add timeout and signal support for fetch
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch(`${backendUrl}/api/health`, {
      signal: controller.signal,
      headers: {
        'Cache-Control': 'no-cache',
      }
    })
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      console.warn(`[API/Health] Backend returned ${response.status}`)
      return NextResponse.json(
        {
          status: "error",
          message: `Backend returned ${response.status}`,
        },
        { status: response.status }
      )
    }
    
    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error: any) {
    // Handle timeout or network errors gracefully
    if (error?.name === 'AbortError') {
      console.error("[API/Health] Request timeout")
      return NextResponse.json(
        {
          status: "error",
          message: "Request timeout connecting to backend",
        },
        { status: 504 } // Gateway Timeout
      )
    }
    
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