"use server";

import { prisma } from '@tenexim/database';
import { hashPassword, verifyPassword } from '@tenexim/auth/src/crypto';
import { encryptPayload, decryptPayload } from '@tenexim/auth';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const COOKIE_NAME = 'tenexim_session';
const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const SENDER_EMAIL = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

export interface ActionResponse {
    success: boolean;
    error?: string;
    message?: string;
    debugLink?: string;
}

export async function getGoogleAuthUrl(): Promise<string> {
    const clientId = process.env.GOOGLE_CLIENT_ID || '';
    const redirectUri = `${APP_URL}/api/auth/callback/google`;
    
    const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: 'code',
        scope: 'openid email profile',
        access_type: 'offline',
        prompt: 'consent'
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

async function sendResendEmail(to: string, subject: string, htmlContent: string): Promise<boolean> {
    if (!RESEND_API_KEY) {
        console.warn("⚠️ RESEND_API_KEY is not defined. Email transmission bypassed.");
        return false;
    }

    try {
        const res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${RESEND_API_KEY}`,
                'Content-Type': 'application/json',
                'User-Agent': 'tenexim-app/1.0.0'
            },
            body: JSON.stringify({
                from: `TENEXIM Intelligence <${SENDER_EMAIL}>`,
                to: [to],
                subject: subject,
                html: htmlContent
            })
        });

        if (!res.ok) {
            const errData = await res.json();
            console.error("❌ Resend REST API transmission failed:", errData);
            return false;
        }

        return true;
    } catch (err) {
        console.error("❌ Exception captured sending Resend mail:", err);
        return false;
    }
}

export async function registerAction(prevState: any, formData: FormData): Promise<ActionResponse> {
    const botField = formData.get('country_validation_field');
    if (botField && botField.toString().length > 0) {
        return { success: true, message: "Verification code sent." };
    }

    const name = formData.get('name')?.toString().trim();
    const email = formData.get('email')?.toString().trim().toLowerCase();
    const password = formData.get('password')?.toString();

    if (!name || !email || !password) {
        return { success: false, error: "Please enter all values." };
    }

    if (password.length < 8) {
        return { success: false, error: "Password must be at least 8 characters long." };
    }

    try {
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return { success: false, error: "An account with this email already exists." };
        }

        const passwordHash = hashPassword(password);
        const trialExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

        await prisma.user.create({
            data: {
                name,
                email,
                passwordHash,
                role: 'USER',
                isTrial: true,
                trialEndsAt: trialExpiry
            }
        });

        const verifyToken = await encryptPayload({ email, type: 'email-verification' }, 24 * 60 * 60 * 1000);
        const verificationLink = `${APP_URL}/verify-email?token=${encodeURIComponent(verifyToken)}`;

        const emailHtml = `
            <div style="font-family: sans-serif; background-color: #020617; padding: 40px; color: #f1f5f9; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid #1e293b;">
                <h1 style="color: #ffffff; font-size: 24px; font-weight: 800; margin-bottom: 20px;">Welcome to TENEXIM</h1>
                <p style="color: #94a3b8; font-size: 15px; line-height: 24px;">Hi ${name},</p>
                <p style="color: #94a3b8; font-size: 15px; line-height: 24px;">Your 30-Day Free Trial of TENEXIM Trade Intelligence is ready. To activate your secure data node uplink, please click the button below to verify your corporate email:</p>
                <div style="margin: 30px 0;">
                    <a href="${verificationLink}" style="background-color: #f59e0b; color: #020617; text-decoration: none; padding: 12px 24px; font-size: 14px; font-weight: 800; border-radius: 8px; display: inline-block;">Verify Account Node</a>
                </div>
                <p style="color: #64748b; font-size: 12px;">If you didn't create this account, please disregard this transmission securely.</p>
                <hr style="border: 0; border-top: 1px solid #1e293b; margin: 30px 0;" />
                <p style="color: #64748b; font-size: 10px; text-transform: uppercase; letter-spacing: 1px;">TENEXIM SOVEREIGN TRADE OS • SECURITY PROTOCOL</p>
            </div>
        `;

        await sendResendEmail(email, "Activate Your TENEXIM Account", emailHtml);

        return { 
            success: true, 
            message: "Account created successfully. A verification link has been dispatched to your email address.",
            debugLink: verificationLink 
        };
    } catch (err) {
        console.error("Database registration error:", err);
        return { success: false, error: "A pipeline registration error occurred." };
    }
}

export async function loginAction(prevState: any, formData: FormData): Promise<ActionResponse> {
    const email = formData.get('email')?.toString().trim().toLowerCase();
    const password = formData.get('password')?.toString();

    if (!email || !password) {
        return { success: false, error: "Please populate all fields." };
    }

    let loginSuccessful = false;

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return { success: false, error: "Invalid email or password." };
        }

        const isValid = verifyPassword(password, user.passwordHash);
        if (!isValid) {
            return { success: false, error: "Invalid email or password." };
        }

        if (!user.emailVerified) {
            return { success: false, error: "Please verify your email before logging in." };
        }

        const sessionPayload = { 
            userId: user.id, 
            email: user.email, 
            role: user.role,
            isTrial: user.isTrial,
            trialEndsAt: user.trialEndsAt ? user.trialEndsAt.getTime() : null
        };
        const sessionToken = await encryptPayload(sessionPayload, 30 * 24 * 60 * 60 * 1000);

        const cookieStore = await cookies();
        cookieStore.set(COOKIE_NAME, sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 30 * 24 * 60 * 60
        });

        loginSuccessful = true;
    } catch (err) {
        console.error("Login execution error:", err);
        return { success: false, error: "Database transaction failed." };
    }

    if (loginSuccessful) {
        redirect('/dashboard/overview');
    }

    return { success: true };
}

export async function forgotPasswordAction(prevState: any, formData: FormData): Promise<ActionResponse> {
    const email = formData.get('email')?.toString().trim().toLowerCase();
    if (!email) {
        return { success: false, error: "Please enter your email address." };
    }

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return { success: true, message: "If registered, recovery instructions have been sent." };
        }

        const resetToken = await encryptPayload({ email, type: 'reset-password' }, 60 * 60 * 1000);
        const recoveryLink = `${APP_URL}/reset-password?token=${encodeURIComponent(resetToken)}`;

        const emailHtml = `
            <div style="font-family: sans-serif; background-color: #020617; padding: 40px; color: #f1f5f9; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid #1e293b;">
                <h1 style="color: #ffffff; font-size: 24px; font-weight: 800; margin-bottom: 20px;">Reset Password Recovery</h1>
                <p style="color: #94a3b8; font-size: 15px; line-height: 24px;">Hi ${user.name || 'Operator'},</p>
                <p style="color: #94a3b8; font-size: 15px; line-height: 24px;">We received a request to override your security passphrase profile. To execute this reset, please click the link below within the next hour:</p>
                <div style="margin: 30px 0;">
                    <a href="${recoveryLink}" style="background-color: #f59e0b; color: #020617; text-decoration: none; padding: 12px 24px; font-size: 14px; font-weight: 800; border-radius: 8px; display: inline-block;">Reset Security Phrase</a>
                </div>
                <p style="color: #64748b; font-size: 12px;">If you did not request this recovery token, please ignore this email securely.</p>
                <hr style="border: 0; border-top: 1px solid #1e293b; margin: 30px 0;" />
                <p style="color: #64748b; font-size: 10px; text-transform: uppercase; letter-spacing: 1px;">TENEXIM INTEL SECURITY CORE</p>
            </div>
        `;

        await sendResendEmail(email, "Reset Your TENEXIM Passphrase", emailHtml);

        return { 
            success: true, 
            message: "A secure recovery link has been dispatched to your email address.",
            debugLink: recoveryLink 
        };
    } catch (err) {
        return { success: false, error: "Database mapping failed." };
    }
}

export async function resetPasswordAction(prevState: any, formData: FormData): Promise<ActionResponse> {
    const token = formData.get('token')?.toString();
    const password = formData.get('password')?.toString();

    if (!token || !password) {
        return { success: false, error: "Missing parameters." };
    }

    if (password.length < 8) {
        return { success: false, error: "Password must be at least 8 characters long." };
    }

    try {
        const payload = await decryptPayload(token);
        if (!payload || payload.type !== 'reset-password') {
            return { success: false, error: "Recovery token is invalid or has expired." };
        }

        const newHash = hashPassword(password);
        await prisma.user.update({
            where: { email: payload.email },
            data: { passwordHash: newHash }
        });

        return { success: true, message: "Passphrase overridden successfully." };
    } catch (err) {
        return { success: false, error: "Failed to store record update." };
    }
}

export async function verifyEmailAction(token: string): Promise<ActionResponse> {
    if (!token) return { success: false, error: "Verification token parameter is missing." };

    try {
        const payload = await decryptPayload(token);
        if (!payload || payload.type !== 'email-verification') {
            return { success: false, error: "Verification token is invalid or has expired." };
        }

        const user = await prisma.user.update({
            where: { email: payload.email },
            data: { emailVerified: new Date() }
        });

        const sessionPayload = { 
            userId: user.id, 
            email: user.email, 
            role: user.role,
            isTrial: user.isTrial,
            trialEndsAt: user.trialEndsAt ? user.trialEndsAt.getTime() : null
        };
        const sessionToken = await encryptPayload(sessionPayload, 30 * 24 * 60 * 60 * 1000);

        const cookieStore = await cookies();
        cookieStore.set(COOKIE_NAME, sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 30 * 24 * 60 * 60
        });

        return { success: true, message: "Email verified successfully. Access node assigned." };
    } catch (err) {
        console.error("Verification processing failed:", err);
        return { success: false, error: "Account verification transaction collapsed." };
    }
}

export async function logoutAction(): Promise<ActionResponse> {
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_NAME);
    return { success: true };
}