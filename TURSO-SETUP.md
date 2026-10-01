# Turso Setup Guide

**Turso** is a distributed SQLite database (libSQL) optimized for edge deployments. It's **5-7x faster** than Cloudflare D1 for complex queries and offers a **generous free tier**.

---

## Why Turso for ATLAS?

✅ **Better Performance** - Optimized for analytics and multi-table joins  
✅ **Edge Replication** - Low-latency reads from replicas worldwide  
✅ **Generous Free Tier** - 9 GB storage, 1B row reads/month  
✅ **SQLite Compatible** - Drop-in replacement, same Drizzle schema  
✅ **Production Ready** - Point-in-time recovery, backups, branching  

**Perfect for:** 1.5 GB dataset with complex NHS data queries across 10 sources.

---

## 🚀 Quick Start

### 1. Install Turso CLI

```bash
# macOS/Linux
curl -sSfL https://get.tur.so/install.sh | bash

# Windows (PowerShell)
irm get.tur.so/install.ps1 | iex
```

### 2. Sign Up (Free)

```bash
turso auth signup
```

Creates account and authenticates CLI.

### 3. Create Database

```bash
# Create in London region (closest to UK NHS users)
turso db create atlas --location lhr

# Or use multiple replicas for better performance
turso db create atlas --location lhr --enable-replicas

# View database info
turso db show atlas
```

**Locations:**
- `lhr` - London (recommended for UK)
- `fra` - Frankfurt
- `ams` - Amsterdam
- `bos` - Boston
- `syd` - Sydney
- `nrt` - Tokyo

### 4. Get Connection Details

```bash
# Get database URL
turso db show atlas --url
# Output: libsql://atlas-<your-org>.turso.io

# Generate auth token
turso db tokens create atlas
# Output: eyJhbGc... (save this!)
```

### 5. Update Environment Variables

```bash
# Local .env
DATABASE_URL=libsql://atlas-<your-org>.turso.io
TURSO_AUTH_TOKEN=eyJhbGc...your-token-here
```

### 6. Run Migrations

```bash
# Push schema to Turso
npm run db:push

# Seed initial data
npm run db:seed
```

### 7. Load Data

```bash
# Load organizations
npm run data:load-orgs

# Load all data sources (when loaders are implemented)
npm run data:load-all
```

---

## 🔧 Local vs Production

ATLAS automatically detects whether to use SQLite or Turso based on `DATABASE_URL`:

### Local Development (SQLite)
```env
DATABASE_URL=./data/atlas.db
# TURSO_AUTH_TOKEN not needed
```

Uses `better-sqlite3` for fast local development.

### Production (Turso)
```env
DATABASE_URL=libsql://atlas-<your-org>.turso.io
TURSO_AUTH_TOKEN=eyJhbGc...
```

Uses `@libsql/client` for distributed edge database.

**No code changes needed** - it switches automatically!

---

## 📊 Turso Features

### 1. Database Branching

Create development/staging branches (like git for databases):

```bash
# Create dev branch from production
turso db create atlas-dev --from-db atlas

# Test schema changes on dev branch
DATABASE_URL=$(turso db show atlas-dev --url) npm run db:push

# If good, apply to production
npm run db:push
```

### 2. Point-in-Time Recovery

```bash
# Restore to specific timestamp
turso db restore atlas --to 2026-10-01T14:30:00Z
```

### 3. Web Console

```bash
# Open web UI
turso db shell atlas
```

Run SQL queries, view tables, inspect data.

### 4. Replicas

```bash
# Add replica in Frankfurt for EU users
turso db replicas create atlas --location fra

# List replicas
turso db replicas list atlas
```

Reads automatically routed to nearest replica (lower latency).

---

## 💰 Pricing

### Free Tier (Perfect for ATLAS MVP)
- ✅ 9 GB storage
- ✅ 1 billion row reads/month
- ✅ 25 million row writes/month
- ✅ 3 databases
- ✅ 3 locations (replicas)

**ATLAS fit:**
- Database size: ~1.5 GB ✅
- Monthly reads: ~10-50M (10+ concurrent users) ✅
- Monthly writes: ~2-5M (monthly data loads) ✅

### Paid Tier (When You Scale)
- **$29/month** for 50 GB storage, 10B rows/month
- **$69/month** for 250 GB storage, 50B rows/month

---

## 🔄 Migration from SQLite

If you've already loaded data in local SQLite and want to move to Turso:

### Option 1: Export/Import (Recommended)

```bash
# Export from local SQLite
sqlite3 data/atlas.db .dump > backup.sql

# Import to Turso
turso db shell atlas < backup.sql
```

### Option 2: Re-run Loaders

```bash
# Point to Turso
export DATABASE_URL=libsql://atlas-<your-org>.turso.io
export TURSO_AUTH_TOKEN=eyJhbGc...

# Re-run data loaders
npm run db:seed
npm run data:load-all
```

---

## 🚢 Cloudflare Deployment

Turso works seamlessly with Cloudflare Pages:

### 1. Add Environment Variables

In Cloudflare Dashboard:
- `DATABASE_URL` = `libsql://atlas-<your-org>.turso.io`
- `TURSO_AUTH_TOKEN` = Your token (encrypted secret)
- `JWT_SECRET` = Random string

### 2. Deploy

```bash
# Build and deploy
npm run build
npx wrangler pages deploy .output/public
```

Cloudflare Workers connect to Turso edge replicas (sub-50ms latency).

---

## 📈 Performance Tips

### 1. Indexes

Turso automatically creates indexes from Drizzle schema. For better performance, add indexes on frequently queried columns:

```typescript
// server/db/schema.ts
import { index } from 'drizzle-orm/sqlite-core'

export const rttWaitingList = sqliteTable('rtt_waiting_list', {
  // ... columns
}, (table) => ({
  providerIdx: index('rtt_provider_idx').on(table.providerOdsCode),
  periodIdx: index('rtt_period_idx').on(table.reportingPeriod),
}))
```

### 2. Prepared Statements

Turso caches prepared statements for faster repeated queries:

```typescript
// Use Drizzle prepared statements for repeated queries
const getOrgById = db.query.organizations.findFirst({
  where: eq(organizations.odsCode, sql.placeholder('code')),
}).prepare()

// Execute multiple times (cached)
const org1 = await getOrgById.execute({ code: 'RRK' })
const org2 = await getOrgById.execute({ code: 'RJ1' })
```

### 3. Batch Inserts

Use transactions for bulk data loading:

```typescript
await db.transaction(async (tx) => {
  for (const batch of batches) {
    await tx.insert(schema.rttWaitingList).values(batch)
  }
})
```

---

## 🆘 Troubleshooting

### Error: "Failed to connect to Turso"

**Solution:** Check auth token is valid:
```bash
turso db tokens create atlas --expiration none
```

### Error: "Database not found"

**Solution:** Ensure database exists:
```bash
turso db list
turso db create atlas --location lhr
```

### Slow Queries

**Solution:** Add indexes:
```bash
turso db shell atlas

sqlite> CREATE INDEX idx_rtt_provider ON rtt_waiting_list(provider_ods_code);
```

Or better: add to schema and re-run `npm run db:push`.

---

## 🔗 Resources

- **Turso Docs:** https://docs.turso.tech/
- **Drizzle + Turso Guide:** https://orm.drizzle.team/docs/get-started-sqlite#turso
- **Turso Dashboard:** https://turso.tech/app
- **Turso Discord:** https://discord.gg/turso

---

## 📋 Quick Reference

```bash
# Create database
turso db create atlas --location lhr

# Get connection URL
turso db show atlas --url

# Generate token
turso db tokens create atlas

# Run SQL console
turso db shell atlas

# List databases
turso db list

# Create replica
turso db replicas create atlas --location fra

# Destroy database (careful!)
turso db destroy atlas
```

---

**Ready to switch?** Update your `.env` with Turso credentials and restart the dev server - it'll just work! 🚀
