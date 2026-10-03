/**
 * Database connection for SQLite/Turso via Drizzle ORM
 *
 * Supports:
 * - Local development: SQLite (better-sqlite3)
 * - Production: Turso (libSQL)
 */
import fs from 'node:fs'
import path from 'node:path'
import { createClient } from '@libsql/client'
import Database from 'better-sqlite3'
import { drizzle as drizzleSqlite } from 'drizzle-orm/better-sqlite3'
import { drizzle as drizzleLibsql } from 'drizzle-orm/libsql'
import * as schema from './schema'

function readDatabaseConfig() {
  if (typeof useRuntimeConfig === 'function') {
    try {
      const config = useRuntimeConfig()
      return {
        databaseUrl: config.databaseUrl || process.env.DATABASE_URL || './data/atlas.db',
        tursoAuthToken: config.tursoAuthToken || process.env.TURSO_AUTH_TOKEN || '',
      }
    } catch {
      // Scripts run outside a Nuxt request (seed, loaders).
    }
  }

  return {
    databaseUrl: process.env.DATABASE_URL || './data/atlas.db',
    tursoAuthToken: process.env.TURSO_AUTH_TOKEN || '',
  }
}

const config = readDatabaseConfig()

const dbUrl = config.databaseUrl || './data/atlas.db'
const isRemote = dbUrl.startsWith('libsql://') || dbUrl.startsWith('https://')

let db: any

if (isRemote) {
  const client = createClient({
    url: dbUrl,
    authToken: config.tursoAuthToken,
  })

  db = drizzleLibsql(client, { schema })
  console.log('✅ Connected to Turso (libSQL)')
} else {
  const dbDir = path.dirname(dbUrl)
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true })
  }

  const sqlite = new Database(dbUrl)
  sqlite.pragma('journal_mode = WAL')

  db = drizzleSqlite(sqlite, { schema })
  console.log('✅ Connected to SQLite (local)')
}

export { db, schema }
