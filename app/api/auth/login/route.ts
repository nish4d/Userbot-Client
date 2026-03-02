import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as { username?: string; password?: string } | null

    const username = body?.username || ""
    const password = body?.password || ""

    const isProd = process.env.NODE_ENV === "production"

    const expectedUsername =
      process.env.DASHBOARD_USERNAME || (!isProd ? process.env.NEXT_PUBLIC_DEMO_USERNAME || "demo" : undefined)
    const expectedPassword =
      process.env.DASHBOARD_PASSWORD || (!isProd ? process.env.NEXT_PUBLIC_DEMO_PASSWORD || "demo" : undefined)

    if (!expectedUsername || !expectedPassword) {
      return NextResponse.json(
        {
          message: "Login is not configured. Set DASHBOARD_USERNAME and DASHBOARD_PASSWORD in your environment.",
        },
        { status: 500 },
      )
    }

    if (username !== expectedUsername || password !== expectedPassword) {
      return NextResponse.json({ message: "Invalid username or password" }, { status: 401 })
    }

    const res = NextResponse.json({ ok: true }, { status: 200 })

    res.cookies.set({
      name: "dash_auth",
      value: "1",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    })

    return res
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Login failed" },
      { status: 500 },
    )
  }
}
