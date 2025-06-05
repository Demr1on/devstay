import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from '@vercel/postgres';
import * as schema from './schema';

// Datenbank-Instanz
export const db = drizzle(sql, { schema });

// Re-export schema für einfachen Import
export * from './schema'; 