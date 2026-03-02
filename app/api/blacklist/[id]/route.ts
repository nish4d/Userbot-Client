import { type NextRequest, NextResponse } from "next/server"

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    // Proxy request to backend
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://userbot-blue.vercel.app"
    
    const response = await fetch(`${backendUrl}/api/blacklist/${id}`, {
      method: 'DELETE',
    })
    
    if (!response.ok) {
      throw new Error(`Backend returned ${response.status}`)
    }
    
    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error(`[API/Blacklist] Proxy error removing user ${await params.then(p => p.id)} from blacklist:`, error)
    return NextResponse.json({ error: "Failed to connect to backend" }, { status: 502 })
  }
}