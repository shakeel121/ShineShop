import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from "@shared/schema";
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

// Ensure data directory exists
const dataDir = join(process.cwd(), 'data');
if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true, mode: 0o777 });
}

// Use libsql for local development (works in WebContainer)
const dbPath = join(dataDir, 'database.sqlite');

// Ensure the database file exists with proper permissions
if (!existsSync(dbPath)) {
  try {
    writeFileSync(dbPath, '', { mode: 0o666 });
  } catch (error) {
    console.warn('Could not create database file, will try in-memory database');
  }
}

const client = createClient({
  url: `file:${dbPath}`
});

export const db = drizzle(client, { schema });

console.log('Database initialized successfully with libsql');