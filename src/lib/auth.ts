import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db } from "@/lib/db"
import crypto from 'crypto';

// Erlaubte Admin E-Mail-Adressen
const ADMIN_EMAILS = [
  'daniel@devstay.de',
  'info@devstay.de',
  // Hier weitere Admin-E-Mails hinzufügen
];

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
    })
  ],
  callbacks: {
    async signIn({ user, profile }) {
      // Nur erlaubte Admin-E-Mails dürfen sich anmelden
      if (!user.email || !ADMIN_EMAILS.includes(user.email)) {
        console.log('❌ Nicht autorisierter Login-Versuch:', user.email);
        return false;
      }
      
      console.log('✅ Admin angemeldet:', user.email);
      return true;
    },
    async session({ session, user }) {
      // Admin-Status zur Session hinzufügen
      if (session.user?.email && ADMIN_EMAILS.includes(session.user.email)) {
        (session as any).user.isAdmin = true;
      }
      return session;
    },
  },
  pages: {
    signIn: '/admin/signin',
    error: '/admin/error',
  }
})

// Middleware-Helper für Admin-Schutz
export async function requireAdmin() {
  const session = await auth();
  
  if (!session?.user?.email || !ADMIN_EMAILS.includes(session.user.email)) {
    throw new Error('Admin-Berechtigung erforderlich');
  }
  
  return session;
}

// Legacy Klasse für Abwärtskompatibilität
export class AdminAuth {
  static hashPassword(password: string): string {
    return crypto.createHash('sha256').update(password + process.env.NEXTAUTH_SECRET).digest('hex');
  }
  
  static verifyPassword(inputPassword: string, storedHash?: string): boolean {
    if (!storedHash) {
      return inputPassword === process.env.ADMIN_PASSWORD;
    }
    
    const inputHash = this.hashPassword(inputPassword);
    return crypto.timingSafeEqual(
      Buffer.from(inputHash),
      Buffer.from(storedHash)
    );
  }
  
  static generateSessionToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }
  
  private static failedAttempts = new Map<string, { count: number; lastAttempt: number }>();
  
  static isRateLimited(ip: string): boolean {
    const attempts = this.failedAttempts.get(ip);
    if (!attempts) return false;
    
    const now = Date.now();
    const timeDiff = now - attempts.lastAttempt;
    
    if (timeDiff > 15 * 60 * 1000) {
      this.failedAttempts.delete(ip);
      return false;
    }
    
    return attempts.count >= 5;
  }
  
  static recordFailedAttempt(ip: string): void {
    const attempts = this.failedAttempts.get(ip) || { count: 0, lastAttempt: 0 };
    attempts.count++;
    attempts.lastAttempt = Date.now();
    this.failedAttempts.set(ip, attempts);
  }
  
  static recordSuccessfulLogin(ip: string): void {
    this.failedAttempts.delete(ip);
  }
}

export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return 'unknown';
} 