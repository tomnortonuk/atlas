/**
 * GET /api/organizations/:code
 * Get organization by ODS code
 */
import { db, schema } from '~/server/db'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const code = getRouterParam(event, 'code')
  
  if (!code) {
    throw createError({
      statusCode: 400,
      message: 'ODS code required',
    })
  }
  
  const [org] = await db
    .select()
    .from(schema.organizations)
    .where(eq(schema.organizations.odsCode, code.toUpperCase()))
    .limit(1)
  
  if (!org) {
    throw createError({
      statusCode: 404,
      message: 'Organization not found',
    })
  }
  
  return org
})
