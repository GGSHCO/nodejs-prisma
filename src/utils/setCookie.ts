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



// export function setCookie(
//   res: Response,
//   name: string,
//   value: string,
//   options: CookieOptions = {}
// ) {
//   const isProduction = process.env.NODE_ENV === 'prod'
//   const isLocalIP = process.env.SERVER_URL?.includes('192.168.') // Add your IP check logic
  
//   res.cookie(name, value, {
//     httpOnly: options.httpOnly ?? (name !== 'XSRF-TOKEN'), // XSRF-TOKEN needs to be readable by JS
//     secure: options.secure ?? true,
//     sameSite: isLocalIP ? 'none' : (options.sameSite ?? (isProduction ? 'none' : 'lax')),
//     domain: isLocalIP ? undefined : (options.domain ?? cookieDomain), // Don't set domain for IP addresses
//     path: options.path ?? '/',
//     maxAge: options.maxAge,
//   })
// }

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
