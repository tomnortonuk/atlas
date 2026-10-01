/**
 * GET /api/auth/me
 * Get current user profile
 */
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    organizationOds: user.organizationOds,
    role: user.role,
  }
})
