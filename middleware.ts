import { NextResponse, type NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl
  const isAuthed = req.cookies.get("dash_auth")?.value === "1"

  if (pathname.startsWith("/dashboard")) {
    if (!isAuthed) {
      const url = req.nextUrl.clone()
      url.pathname = "/login"
      url.searchParams.set("next", `${pathname}${search}`)
      return NextResponse.redirect(url)
    }
  }

  if (pathname === "/login" && isAuthed) {
    const url = req.nextUrl.clone()
    url.pathname = "/dashboard"
    url.search = ""
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
}
