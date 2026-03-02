import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Check if backend URL is configured
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!backendUrl) {
      console.warn("[API/Health] BACKEND_URL not configured");
      // Return mock data to allow frontend to run without backend
      return NextResponse.json(
        {
          status: "ok",
          message: "Running in offline mode - backend not configured",
          timestamp: new Date().toISOString(),
          features: {
            telegram_connection: "disconnected",
            auto_reply: "disabled",
            blacklist: "limited",
            active_users: 0,
            uptime: "N/A"
          }
        },
        { status: 200 }
      );
    }
    
    // Add timeout and signal support for fetch
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout for Vercel
    
    const response = await fetch(`${backendUrl}/api/health`, {
      signal: controller.signal,
      headers: {
        'Cache-Control': 'no-cache',
        'User-Agent': 'Telegram-Dashboard/1.0 (vercel-runtime)'
      },
      // Add revalidation options
      next: { revalidate: 30 } // Revalidate every 30 seconds
    })
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      console.warn(`[API/Health] Backend returned ${response.status}`)
      // Return mock data to allow frontend to run without backend
      return NextResponse.json(
        {
          status: "ok",
          message: "Running in offline mode - backend unavailable",
          timestamp: new Date().toISOString(),
          features: {
            telegram_connection: "disconnected",
            auto_reply: "disabled",
            blacklist: "limited",
            active_users: 0,
            uptime: "N/A"
          }
        },
        { status: 200 }
      )
    }
    
    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error: any) {
    // Handle timeout or network errors gracefully
    if (error?.name === 'AbortError') {
      console.error("[API/Health] Request timeout")
    } else {
      console.error("[API/Health] Proxy error:", error)
    }
    
    // Return mock data to allow frontend to run without backend
    return NextResponse.json(
      {
        status: "ok",
        message: "Running in offline mode - backend unreachable",
        timestamp: new Date().toISOString(),
        features: {
          telegram_connection: "disconnected",
          auto_reply: "disabled",
          blacklist: "limited",
          active_users: 0,
          uptime: "N/A"
        }
      },
      { status: 200 }
    )
  }
}