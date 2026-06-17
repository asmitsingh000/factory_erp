import { NextResponse } from 'next/server';

const roleRoutes = {
  factory: [
    '/local/factory/dashboard', '/local/factory/team', '/local/factory/calender', '/local/factory/calendar',
    '/overseas/factory/dashboard', '/overseas/factory/team', '/overseas/factory/calender', '/overseas/factory/calendar'
  ],
  marketing: [
    '/local/marketing/dashboard', '/local/marketing/team', '/local/marketing/calender', '/local/marketing/calendar',
    '/overseas/marketing/dashboard', '/overseas/marketing/team', '/overseas/marketing/calender', '/overseas/marketing/calendar'
  ],
  owner: ['/owner/monitor']
};

export async function middleware(request) {
  const url = request.nextUrl.clone();
  let { pathname } = url;

  if (pathname !== '/' && pathname.endsWith('/')) {
    url.pathname = pathname.replace(/\/+$/, '');
    return NextResponse.redirect(url);
  }

  const lower = pathname.toLowerCase();
  if (pathname !== lower) {
    url.pathname = lower;
    return NextResponse.redirect(url);
  }

  const publicPrefixes = ['/', '/auth', '/login', '/api', '/public'];
  if (publicPrefixes.some(p => pathname === p || pathname.startsWith(p + '/'))) {
    return NextResponse.next();
  }

  const protectedPaths = Object.values(roleRoutes).flat();
  const isProtected = protectedPaths.some(p => pathname === p || pathname.startsWith(p));

  const userRole = request.cookies.get('userRole')?.value;

  if (isProtected) {
    const cookieHeader = request.headers.get('cookie') || '';
    const hasToken = /token=/.test(cookieHeader) || !!request.cookies.get('token')?.value;

    if (!hasToken) {
      const loginUrl = new URL('/', request.url);
      loginUrl.searchParams.set('returnUrl', request.nextUrl.pathname + request.nextUrl.search);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const verifyRes = await fetch(new URL('/api/auth/verify', request.url), {
        method: 'GET',
        headers: { cookie: cookieHeader }
      });

      if (!verifyRes.ok) {
        const loginUrl = new URL('/', request.url);
        loginUrl.searchParams.set('returnUrl', request.nextUrl.pathname + request.nextUrl.search);
        return NextResponse.redirect(loginUrl);
      }
    } catch (e) {
      const loginUrl = new URL('/', request.url);
      loginUrl.searchParams.set('returnUrl', request.nextUrl.pathname + request.nextUrl.search);
      return NextResponse.redirect(loginUrl);
    }

    if (!userRole) {
      return NextResponse.next();
    }

    const allowedRoutes = roleRoutes[userRole];
    const hasAccess = allowedRoutes?.some(route => pathname.startsWith(route));
    if (!hasAccess) {
      const defaultRoutes = {
        factory: '/factory/dashboard',
        marketing: '/marketing/dashboard',
        local_factory: '/local/factory/dashboard',
        local_marketing: '/local/marketing/dashboard',
        overseas_factory: '/overseas/factory/dashboard',
        overseas_marketing: '/overseas/marketing/dashboard',
        owner: '/owner/monitor'
      };
      return NextResponse.redirect(new URL(defaultRoutes[userRole] || '/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|robots.txt).*)'],
};
