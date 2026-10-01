/**
 * Authentication utilities
 */
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import type { H3Event } from 'h3'
import { db, schema } from '../db'
import { eq } from 'drizzle-orm'

const config = useRuntimeConfig()

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function generateToken(userId: number, email: string): string {
  return jwt.sign(
    { userId, email },
    config.jwtSecret,
    { expiresIn: '7d' }
  )
}

export function verifyToken(token: string): { userId: number; email: string } | null {
  try {
    return jwt.verify(token, config.jwtSecret) as { userId: number; email: string }
  } catch {
    return null
  }
}

export async function getUserFromEvent(event: H3Event) {
  const authHeader = getHeader(event, 'authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.slice(7)
  const payload = verifyToken(token)
  if (!payload) {
    return null
  }

  const [user] = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.id, payload.userId))
    .limit(1)

  return user || null
}

export async function requireAuth(event: H3Event) {
  const user = await getUserFromEvent(event)
  if (!user) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized',
    })
  }
  return user
}
