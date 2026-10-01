/**
 * Database connection for SQLite/Turso via Drizzle ORM
 * 
 * Supports:
 * - Local development: SQLite (better-sqlite3)
 * - Production: Turso (libSQL)
 */
import * as schema from './schema'

const config = useRuntimeConfig()

// Determine database type from URL
const dbUrl = config.databaseUrl || './data/atlas.db'
const isRemote = dbUrl.startsWith('libsql://') || dbUrl.startsWith('https://')

let db: any

if (isRemote) {
  // Production: Turso (libSQL)
  const { createClient } = await import('@libsql/client')
  const { drizzle } = await import('drizzle-orm/libsql')
  
  const client = createClient({
    url: dbUrl,
    authToken: config.tursoAuthToken,
  })
  
  db = drizzle(client, { schema })
  console.log('✅ Connected to Turso (libSQL)')
} else {
  // Local development: SQLite
  const Database = (await import('better-sqlite3')).default
  const { drizzle } = await import('drizzle-orm/better-sqlite3')
  const path = await import('path')
  const fs = await import('fs')
  
  // Ensure data directory exists
  const dbDir = path.dirname(dbUrl)
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true })
  }
  
  const sqlite = new Database(dbUrl)
  sqlite.pragma('journal_mode = WAL')
  
  db = drizzle(sqlite, { schema })
  console.log('✅ Connected to SQLite (local)')
}

export { db, schema }
