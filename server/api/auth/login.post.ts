/**
 * POST /api/auth/login
 * User login endpoint
 */
import { db, schema } from '~/server/db'
import { eq } from 'drizzle-orm'
import { verifyPassword, generateToken } from '~/server/utils/auth'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  // Validate input
  const validation = loginSchema.safeParse(body)
  if (!validation.success) {
    throw createError({
      statusCode: 400,
      message: 'Invalid email or password format',
    })
  }
  
  const { email, password } = validation.data
  
  // Find user
  const [user] = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, email))
    .limit(1)
  
  if (!user) {
    throw createError({
      statusCode: 401,
      message: 'Invalid credentials',
    })
  }
  
  // Verify password
  const isValid = await verifyPassword(password, user.passwordHash)
  if (!isValid) {
    throw createError({
      statusCode: 401,
      message: 'Invalid credentials',
    })
  }
  
  // Update last login
  await db
    .update(schema.users)
    .set({ lastLogin: new Date().toISOString() })
    .where(eq(schema.users.id, user.id))
  
  // Generate token
  const token = generateToken(user.id, user.email)
  
  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  }
})
