// src/utils/jwt.ts
import jwt from 'jsonwebtoken'
import { env } from '../config/env'
import crypto from 'crypto';

interface TokenPayload {
  id: number
  email: string
  iss?: string
  aud?: string | string[]
}

export const generateTokens = (user: TokenPayload) => {
  const accessTokenOptions: jwt.SignOptions = {
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
    algorithm: 'HS256',
    issuer: env.SERVER_URL,
    audience: env.CLIENT_URL,
  }

  const refreshTokenOptions: jwt.SignOptions = {
    expiresIn: env.REFRESH_TOKEN_EXPIRES as jwt.SignOptions['expiresIn'],
    algorithm: 'HS256',
    issuer: env.SERVER_URL,
    audience: env.CLIENT_URL,
  }

  const accessToken = jwt.sign(
    { id: user.id, email: user.email },
    env.JWT_ACCESS_SECRET,
    accessTokenOptions
  )

  const refreshToken = jwt.sign(
    { id: user.id },
    env.JWT_REFRESH_SECRET,
    refreshTokenOptions
  )

  return { accessToken, refreshToken }
}

export const verifyToken = (token: string, type: 'access' | 'refresh') => {
  try {
    const secret =
      type === 'access' ? env.JWT_ACCESS_SECRET : env.JWT_REFRESH_SECRET
    const decoded = jwt.verify(token, secret) as TokenPayload

    // Validate token audience and issuer
    if (decoded.iss !== env.SERVER_URL) {
      throw new Error('Invalid token issuer')
    }

    if (decoded.aud !== env.CLIENT_URL) {
      throw new Error('Invalid token audience')
    }

    // Additional verification based on token type
    if (type === 'access' && !decoded.email) {
      throw new Error('Invalid access token')
    }

    return decoded
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Token expired')
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid token')
    }
    throw new Error('Token verification failed')
  }
}

export const generateRandomToken = (): string => {
  return crypto.randomBytes(32).toString('hex'); // 64-character hex string
};
