import { NextRequest, NextResponse } from 'next/server'

const BASE_DOMAIN = process.env.NEXT_PUBLIC_BASE_DOMAIN ?? 'bymean.id'
const RESERVED_SLUGS = new Set(['www', 'app', 'admin', 'api', 'dashboard', 'gallery', 'builder', 'publish', 'guests', 'rsvp', 'messages', 'gifts', 'analytics', 'settings', 'login', 'register'])

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') ?? ''
  const isLocalhost = host.includes('localhost') || host.includes('127.0.0.1')

  if (isLocalhost) return NextResponse.next()

  if (host.endsWith(`.${BASE_DOMAIN}`)) {
    const slug = host.replace(`.${BASE_DOMAIN}`, '')

    if (RESERVED_SLUGS.has(slug)) return NextResponse.next()

    const url = request.nextUrl.clone()
    url.pathname = `/${slug}${url.pathname === '/' ? '' : url.pathname}`
    return NextResponse.rewrite(url)
  }

  // Phase 5+: custom domain → lookup in DB and rewrite
  // Handled in app/(invitation)/[slug]/page.tsx via x-forwarded-host header

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
