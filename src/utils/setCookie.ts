import { Response } from 'express'
import { cookieDomain } from './corsOrgin'

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

  // console.log('Env:', process.env.NODE_ENV, 'Cookie domain:', cookieDomain)

  res.cookie(name, value, {
    httpOnly: options.httpOnly ?? true,
    secure: options.secure ?? true,
    sameSite: options.sameSite ?? (isProduction ? 'none' : 'lax'),
    domain: options.domain ?? cookieDomain,
    path: options.path ?? '/',
    maxAge: options.maxAge,
  })
}

export function removeCookie(
  res: Response,
  name: string,
  options: CookieOptions = {}
) {
  const isProduction = process.env.NODE_ENV === 'prod'

  res.clearCookie(name, {
    httpOnly: options.httpOnly ?? true,
    secure: options.secure ?? true,
    sameSite: options.sameSite ?? (isProduction ? 'none' : 'lax'),
    domain: options.domain ?? cookieDomain,
    path: options.path ?? '/',
  })
}
