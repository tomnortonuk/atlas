/**
 * POST /api/auth/register
 * User registration endpoint
 */
import { db, schema } from '~/server/db'
import { hashPassword, generateToken } from '~/server/utils/auth'
import { z } from 'zod'

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
  organizationOds: z.string().optional(),
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  // Validate input
  const validation = registerSchema.safeParse(body)
  if (!validation.success) {
    throw createError({
      statusCode: 400,
      message: 'Invalid registration data',
      data: validation.error.issues,
    })
  }
  
  const { email, password, name, organizationOds } = validation.data
  
  // Hash password
  const passwordHash = await hashPassword(password)
  
  try {
    // Create user
    const [user] = await db
      .insert(schema.users)
      .values({
        email,
        passwordHash,
        name,
        organizationOds,
        role: 'user',
      })
      .returning()
    
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
  } catch (error: any) {
    if (error.code === 'SQLITE_CONSTRAINT') {
      throw createError({
        statusCode: 409,
        message: 'Email already registered',
      })
    }
    throw error
  }
})
