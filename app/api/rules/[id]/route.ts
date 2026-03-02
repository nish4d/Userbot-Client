import { type NextRequest, NextResponse } from "next/server"

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    // Proxy request to backend
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://userbot-blue.vercel.app"
    const body = await request.json()
    
    // Add timeout and signal support for fetch
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch(`${backendUrl}/api/rules/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    })
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      console.warn(`[API/Rules] Backend returned ${response.status} for rule ${id}`)
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
      console.error("[API/Rules] Request timeout updating rule", await params.then(p => p.id))
      return NextResponse.json(
        { error: "Request timeout connecting to backend" }, 
        { status: 504 } // Gateway Timeout
      )
    }
    
    console.error(`[API/Rules] Proxy error updating rule ${await params.then(p => p.id)}:`, error)
    return NextResponse.json({ error: "Failed to connect to backend" }, { status: 502 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    // Proxy request to backend
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://userbot-blue.vercel.app"
    
    // Add timeout and signal support for fetch
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch(`${backendUrl}/api/rules/${id}`, {
      method: 'DELETE',
      signal: controller.signal,
    })
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      console.warn(`[API/Rules] Backend returned ${response.status} for rule ${id}`)
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
      console.error("[API/Rules] Request timeout deleting rule", await params.then(p => p.id))
      return NextResponse.json(
        { error: "Request timeout connecting to backend" }, 
        { status: 504 } // Gateway Timeout
      )
    }
    
    console.error(`[API/Rules] Proxy error deleting rule ${await params.then(p => p.id)}:`, error)
    return NextResponse.json({ error: "Failed to connect to backend" }, { status: 502 })
  }
}