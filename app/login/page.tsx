import LoginClient from "./login-client"

export default function LoginPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>
}) {
  const nextParam = searchParams?.next
  const nextUrl = Array.isArray(nextParam) ? nextParam[0] : nextParam

  return <LoginClient nextUrl={nextUrl || "/dashboard"} />
}
