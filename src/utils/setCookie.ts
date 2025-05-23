import { Response } from 'express'

type SameSite = 'lax' | 'strict' | 'none'

interface CookieOptions {
  httpOnly?: boolean
  secure?: boolean
  sameSite?: SameSite
  domain?: string
  path?: string
  maxAge?: number
}

export function setCookie(
  res: Response,
  name: string,
  value: string,
  options: CookieOptions = {}
) {
  const isProduction = process.env.NODE_ENV === 'prod'

  res.cookie(name, value, {
    httpOnly: options.httpOnly ?? true,
    secure: options.secure ?? isProduction,
    sameSite: options.sameSite ?? (isProduction ? 'none' : 'lax'),
    domain:
      options.domain ?? (isProduction ? process.env.CLIENT_URL : undefined),
    path: options.path ?? '/',
    maxAge: options.maxAge,
  })
}
