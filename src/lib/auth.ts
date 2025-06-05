import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import crypto from 'crypto';

// Erlaubte Admin E-Mail-Adressen aus Environment Variables
const getAdminEmails = (): string[] => {
  const adminEmails = process.env.ADMIN_EMAILS;
  if (!adminEmails) {
    console.warn('⚠️ ADMIN_EMAILS environment variable not set, using defaults');
    return ['dewalddaniel1@gmail.com']; // Fallback zu deiner E-Mail
  }
  return adminEmails.split(',').map(email => email.trim());
};

const ADMIN_EMAILS = getAdminEmails();

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
    })
  ],
  callbacks: {
    async signIn({ user }) {
      console.log('🔍 SignIn attempt:', user.email);
      console.log('📋 Allowed emails:', ADMIN_EMAILS);
      
      // Nur erlaubte Admin-E-Mails dürfen sich anmelden
      if (!user.email || !ADMIN_EMAILS.includes(user.email)) {
        console.log('❌ Nicht autorisierter Login-Versuch:', user.email);
        return false;
      }
      
      console.log('✅ Admin angemeldet:', user.email);
      return true;
    },
    async jwt({ token, user }) {
      // User-Daten beim ersten Login zum Token hinzufügen
      if (user && user.email) {
        token.isAdmin = ADMIN_EMAILS.includes(user.email);
        console.log('🎫 JWT Token created for:', user.email);
      }
      return token;
    },
    async session({ session, token }) {
      // Admin-Status zur Session hinzufügen
      if (session.user?.email && ADMIN_EMAILS.includes(session.user.email)) {
        (session as any).user.isAdmin = true;
        console.log('👤 Session created for admin:', session.user.email);
      }
      return session;
    },
  },
  pages: {
    signIn: '/admin/signin',
    error: '/admin/error',
  },
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
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