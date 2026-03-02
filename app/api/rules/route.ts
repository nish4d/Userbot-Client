import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    // Check if backend URL is configured
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!backendUrl) {
      console.warn("[API/Rules] BACKEND_URL not configured");
      // Return mock data to allow frontend to run without backend
      return NextResponse.json(
        { 
          rules: [
            {
              id: "mock-1",
              triggers: ["hello", "hi"],
              response: "Hello! This is a sample auto-reply message.",
              enabled: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            },
            {
              id: "mock-2",
              triggers: ["help", "support"],
              response: "Need help? Check out our documentation or contact support!",
              enabled: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ]
        }, 
        { status: 200 }
      );
    }
    
    // Add timeout and signal support for fetch
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout for Vercel
    
    const response = await fetch(`${backendUrl}/api/rules`, {
      signal: controller.signal,
      headers: {
        'Cache-Control': 'no-cache',
        'User-Agent': 'Telegram-Dashboard/1.0 (vercel-runtime)'
      },
      next: { revalidate: 60 } // Revalidate every 60 seconds
    })
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      console.warn(`[API/Rules] Backend returned ${response.status}`)
      // Return mock data to allow frontend to run without backend
      return NextResponse.json(
        { 
          rules: [
            {
              id: "mock-1",
              triggers: ["hello", "hi"],
              response: "Hello! This is a sample auto-reply message.",
              enabled: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            },
            {
              id: "mock-2",
              triggers: ["help", "support"],
              response: "Need help? Check out our documentation or contact support!",
              enabled: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ]
        }, 
        { status: 200 }
      )
    }
    
    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error: any) {
    // Handle timeout or network errors gracefully
    if (error?.name === 'AbortError') {
      console.error("[API/Rules] Request timeout")
    } else {
      console.error("[API/Rules] Proxy error:", error)
    }
    
    // Return mock data to allow frontend to run without backend
    return NextResponse.json({
      rules: [
        {
          id: "mock-1",
          triggers: ["hello", "hi"],
          response: "Hello! This is a sample auto-reply message.",
          enabled: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: "mock-2",
          triggers: ["help", "support"],
          response: "Need help? Check out our documentation or contact support!",
          enabled: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]
    }, { status: 200 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check if backend URL is configured
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!backendUrl) {
      console.warn("[API/Rules] BACKEND_URL not configured");
      // Return mock data to allow frontend to run without backend
      const body = await request.json();
      return NextResponse.json(
        { 
          id: `mock-${Date.now()}`,
          ...body,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, 
        { status: 200 }
      );
    }
    
    const body = await request.json()
    
    // Add timeout and signal support for fetch
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout for Vercel
    
    const response = await fetch(`${backendUrl}/api/rules`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Telegram-Dashboard/1.0 (vercel-runtime)'
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    })
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      console.warn(`[API/Rules] Backend returned ${response.status}`)
      // Return mock data to allow frontend to run without backend
      return NextResponse.json(
        { 
          id: `mock-${Date.now()}`,
          ...body,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, 
        { status: 200 }
      )
    }
    
    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error: any) {
    // Handle timeout or network errors gracefully
    if (error?.name === 'AbortError') {
      console.error("[API/Rules] Request timeout")
    } else {
      console.error("[API/Rules] Proxy error:", error)
    }
    
    // Return mock data to allow frontend to run without backend
    const body = await request.json();
    return NextResponse.json(
      { 
        id: `mock-${Date.now()}`,
        ...body,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, 
      { status: 200 }
    )
  }
}