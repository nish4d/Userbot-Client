import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    // Check if backend URL is configured
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!backendUrl) {
      console.warn("[API/Blacklist] BACKEND_URL not configured");
      return NextResponse.json(
        { 
          error: "Backend URL not configured",
          entries: [] // Return empty array as fallback
        }, 
        { status: 500 }
      );
    }
    
    // Add timeout and signal support for fetch
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch(`${backendUrl}/api/blacklist`, {
      signal: controller.signal,
      headers: {
        'Cache-Control': 'no-cache',
        'User-Agent': 'Telegram-Dashboard/1.0 (vercel-deployment)'
      }
    })
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      console.warn(`[API/Blacklist] Backend returned ${response.status}`)
      return NextResponse.json(
        { 
          error: `Backend returned ${response.status}`,
          entries: [] // Return empty array as fallback
        }, 
        { status: response.status }
      )
    }
    
    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error: any) {
    // Handle timeout or network errors gracefully
    if (error?.name === 'AbortError') {
      console.error("[API/Blacklist] Request timeout")
      return NextResponse.json(
        { 
          error: "Request timeout connecting to backend",
          entries: [] // Return empty array as fallback
        }, 
        { status: 504 } // Gateway Timeout
      )
    }
    
    console.error("[API/Blacklist] Proxy error:", error)
    return NextResponse.json({ error: "Failed to connect to backend", entries: [] }, { status: 502 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check if backend URL is configured
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!backendUrl) {
      console.warn("[API/Blacklist] BACKEND_URL not configured");
      return NextResponse.json(
        { error: "Backend URL not configured" }, 
        { status: 500 }
      );
    }
    
    const body = await request.json()
    
    // Add timeout and signal support for fetch
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch(`${backendUrl}/api/blacklist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Telegram-Dashboard/1.0 (vercel-deployment)'
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    })
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      console.warn(`[API/Blacklist] Backend returned ${response.status}`)
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
      console.error("[API/Blacklist] Request timeout")
      return NextResponse.json(
        { error: "Request timeout connecting to backend" }, 
        { status: 504 } // Gateway Timeout
      )
    }
    
    console.error("[API/Blacklist] Proxy error:", error)
    return NextResponse.json({ error: "Failed to connect to backend" }, { status: 502 })
  }
}