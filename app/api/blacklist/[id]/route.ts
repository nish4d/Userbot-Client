import { type NextRequest, NextResponse } from "next/server"

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    // Check if backend URL is configured
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!backendUrl) {
      console.warn("[API/Blacklist] BACKEND_URL not configured");
      return NextResponse.json(
        { error: "Backend URL not configured" }, 
        { status: 500 }
      );
    }
    
    // Add timeout and signal support for fetch
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch(`${backendUrl}/api/blacklist/${id}`, {
      method: 'DELETE',
      headers: {
        'User-Agent': 'Telegram-Dashboard/1.0 (vercel-deployment)'
      },
      signal: controller.signal,
    })
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      console.warn(`[API/Blacklist] Backend returned ${response.status} for entry ${id}`)
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
      console.error("[API/Blacklist] Request timeout deleting entry", await params.then(p => p.id))
      return NextResponse.json(
        { error: "Request timeout connecting to backend" }, 
        { status: 504 } // Gateway Timeout
      )
    }
    
    console.error(`[API/Blacklist] Proxy error removing user ${await params.then(p => p.id)} from blacklist:`, error)
    return NextResponse.json({ error: "Failed to connect to backend" }, { status: 502 })
  }
}