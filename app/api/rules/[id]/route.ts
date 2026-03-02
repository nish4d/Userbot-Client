import { type NextRequest, NextResponse } from "next/server"

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    // Proxy request to backend
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://userbot-blue.vercel.app"
    const body = await request.json()
    
    const response = await fetch(`${backendUrl}/api/rules/${id}`, {
      method: 'PUT',
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
    console.error(`[API/Rules] Proxy error updating rule ${await params.then(p => p.id)}:`, error)
    return NextResponse.json({ error: "Failed to connect to backend" }, { status: 502 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    // Proxy request to backend
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://userbot-blue.vercel.app"
    
    const response = await fetch(`${backendUrl}/api/rules/${id}`, {
      method: 'DELETE',
    })
    
    if (!response.ok) {
      throw new Error(`Backend returned ${response.status}`)
    }
    
    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error(`[API/Rules] Proxy error deleting rule ${await params.then(p => p.id)}:`, error)
    return NextResponse.json({ error: "Failed to connect to backend" }, { status: 502 })
  }
}