import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';

// Initialize database connection
const sqlite = new Database('tea-self-select.db');

// Enable foreign key constraints
sqlite.pragma('foreign_keys = ON');

// Create database instance
export const db = drizzle(sqlite, { schema });

// Ensure database connection is properly closed on exit
process.on('exit', () => {
  sqlite.close();
});

process.on('SIGINT', () => {
  sqlite.close();
  process.exit();
});