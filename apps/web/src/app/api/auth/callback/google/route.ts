import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@tenexim/database';
import { encryptPayload } from '@tenexim/auth';


const COOKIE_NAME = 'tenexim_session';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
        return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(error)}`, request.url));
    }

    if (!code) {
        return NextResponse.redirect(new URL('/login?error=auth_code_missing', request.url));
    }

    try {
        const clientId = process.env.GOOGLE_CLIENT_ID || '';
        const clientSecret = process.env.GOOGLE_CLIENT_SECRET || '';
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const redirectUri = `${appUrl}/api/auth/callback/google`;

        const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                code,
                client_id: clientId,
                client_secret: clientSecret,
                redirect_uri: redirectUri,
                grant_type: 'authorization_code'
            })
        });

        if (!tokenRes.ok) {
            const tokenErr = await tokenRes.json();
            console.error('Google token exchange trade error:', tokenErr);
            return NextResponse.redirect(new URL('/login?error=token_exchange_failed', request.url));
        }

        const tokens = await tokenRes.json();
        const accessToken = tokens.access_token;

        const profileRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { 'Authorization': `Bearer ${accessToken}` }
        });

        if (!profileRes.ok) {
            return NextResponse.redirect(new URL('/login?error=profile_fetch_failed', request.url));
        }

        const profile = await profileRes.json();
        const email = profile.email?.toLowerCase();
        const name = profile.name;
        const avatar = profile.picture;

        if (!email) {
            return NextResponse.redirect(new URL('/login?error=email_not_provided', request.url));
        }

        let user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            const trialExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
            user = await prisma.user.create({
                data: {
                    email,
                    name,
                    avatar,
                    passwordHash: 'OAUTH_USER_NO_PASSWORD',
                    role: 'USER',
                    isTrial: true,
                    trialEndsAt: trialExpiry,
                    emailVerified: new Date()
                }
            });
        } else {
            user = await prisma.user.update({
                where: { email },
                data: {
                    avatar: user.avatar || avatar,
                    emailVerified: user.emailVerified || new Date()
                }
            });
        }

        const sessionPayload = { 
            userId: user.id, 
            email: user.email, 
            role: user.role,
            isTrial: user.isTrial,
            trialEndsAt: user.trialEndsAt ? user.trialEndsAt.getTime() : null
        };
        const sessionToken = await encryptPayload(sessionPayload, 30 * 24 * 60 * 60 * 1000);

        const response = NextResponse.redirect(new URL('/dashboard/overview', request.url));
        
        response.cookies.set(COOKIE_NAME, sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 30 * 24 * 60 * 60
        });

        return response;
    } catch (err) {
        console.error('Google OAuth Handshake exception:', err);
        return NextResponse.redirect(new URL('/login?error=internal_server_error', request.url));
    }
}