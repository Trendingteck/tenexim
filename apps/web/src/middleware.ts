import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decryptPayload } from '@tenexim/auth';

const COOKIE_NAME = 'tenexim_session';

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // Direct bypass for assets, API and auth pages to prevent redirects
    if (
        path.startsWith('/_next') ||
        path.startsWith('/api/') ||
        path.startsWith('/static') ||
        path.endsWith('.png') ||
        path.endsWith('.svg') ||
        path.endsWith('.ico')
    ) {
        return NextResponse.next();
    }

    const sessionCookie = request.cookies.get(COOKIE_NAME)?.value;

    // 1. Unauthenticated Route Handling
    if (!sessionCookie) {
        if (path.startsWith('/dashboard')) {
            const loginUrl = new URL('/login', request.url);
            return NextResponse.redirect(loginUrl);
        }
        return NextResponse.next();
    }

    // 2. Read Session Payload (Edge-safe decryption)
    const session = await decryptPayload(sessionCookie);

    if (!session) {
        // Clear invalid session cookie to prevent recursive redirect errors
        const response = NextResponse.redirect(new URL('/login', request.url));
        response.cookies.delete(COOKIE_NAME);
        return response;
    }

    // 3. Prevent authenticated users from visiting auth gates
    if (['/login', '/register', '/forgot-password', '/reset-password', '/verify-email'].includes(path)) {
        return NextResponse.redirect(new URL('/dashboard/overview', request.url));
    }

    // 4. Enforce Onboarding trial metrics & limit checks on dashboard routes
    if (path.startsWith('/dashboard')) {
        if (session.isTrial && session.trialEndsAt) {
            const ends = Number(session.trialEndsAt);
            if (Date.now() > ends) {
                // If trial is expired, redirect to payment / restriction gateway page
                const upgradeUrl = new URL('/upgrade-tier', request.url);
                return NextResponse.redirect(upgradeUrl);
            }
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};