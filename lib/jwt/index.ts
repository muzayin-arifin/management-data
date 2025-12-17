
import { SignJWT, jwtVerify } from 'jose'

// Use fallback secret if env var is not set (untuk development)
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-for-development-only-change-in-production';
const secret = new TextEncoder().encode(JWT_SECRET);

export async function signToken(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('2h')
    .sign(secret)
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret)
    return payload
  } catch (error) {
    return null
  }
}
