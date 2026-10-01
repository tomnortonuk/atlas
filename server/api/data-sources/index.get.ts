/**
 * GET /api/data-sources
 * List all available data sources
 */
import { db, schema } from '~/server/db'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const activeOnly = query.active === 'true'
  
  let sources = await db.select().from(schema.dataSources)
  
  if (activeOnly) {
    sources = sources.filter(s => s.active)
  }
  
  return {
    sources,
    count: sources.length,
  }
})
