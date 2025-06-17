// src/middleware/security.ts

import { Request, Response, NextFunction } from 'express'
import helmet from 'helmet'

import { rateLimit } from 'express-rate-limit'
import express from 'express'
import logger from '../config/logger'
import { verifyToken } from '../utils/jwt'
import { env } from '../config/env'

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'prod' ? 100 : 1000,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req, res) => {
    const rawIp = req.ip || ''
    const cleanedIp = rawIp.includes(':') ? rawIp.split(':')[0] : rawIp

    const userId = (req as CustomRequest).user?.id ?? null;
    if (userId) {
      return `USER-${userId}`;
    }

    return `IP-${cleanedIp}`
  },
  handler: (req, res) => {
    const userId = (req as CustomRequest).user?.id ?? 'anonymous'
    const rawIp = req.ip || ''
    const cleanedIp = rawIp.includes(':') ? rawIp.split(':')[0] : rawIp
    const now = new Date().toISOString()
    const endpoint = req.originalUrl
    const method = req.method
    const userAgent = req.headers['user-agent'] || 'unknown'

    logger.warn(`[${now}] Rate limit exceeded:
      IP: ${cleanedIp} (raw: ${rawIp}),
      UserID: ${userId},
      Method: ${method},
      Endpoint: ${endpoint},
      User-Agent: ${userAgent}
    `)

    res.status(429).json({
      responseType: 'ERROR',
      responseMessage: 'Too many requests, please try again later',
      responseData: null,
    })
  },
})

const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  // keyGenerator: (req, res) => {
  //   // Strip the port from IP if present
  //   const rawIp = req.ip || ''
  //   const cleanedIp = rawIp.includes(':') ? rawIp.split(':')[0] : rawIp
  //   return cleanedIp
  // },
  keyGenerator: (req, res) => {
    const ip = (req.ip || '').split(':')[0]
    const email = req.body?.data.email || 'unknown'
    return `${ip}-${email}`
  },
  handler: (req, res) => {
    const rawIp = req.ip || ''
    const cleanedIp = rawIp.includes(':') ? rawIp.split(':')[0] : rawIp
    const email = req.body?.data.email || 'unknown'
    const now = new Date().toISOString()
    const endpoint = req.originalUrl
    const method = req.method
    const userAgent = req.headers['user-agent'] || 'unknown'

    logger.warn(`[${now}] Auth rate limit exceeded:
      IP: ${cleanedIp} (raw: ${rawIp}),
      Email: ${email},
      Method: ${method},
      Endpoint: ${endpoint},
      User-Agent: ${userAgent}
    `)
    res.status(429).json({
      responseType: 'ERROR',
      responseMessage: 'Too many attempts, please try again later',
      responseData: null,
    })
  },
})

const csrfProtection = (req: Request, res: Response, next: NextFunction) => {
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
    const csrfHeader = req.headers['x-csrf-token'] || req.headers['X-CSRF-Token'];
    const csrfCookie = req.cookies['XSRF-TOKEN'];
    
    if (!csrfHeader || !csrfCookie || csrfHeader !== csrfCookie) {
      return res.status(403).json({
        responseType: 'ERROR',
        responseMessage: 'Invalid CSRF token',
        responseData: {csrfHeader, csrfCookie},
      });
    }
  }
  next();
}

export const securityMiddleware = [
  // Security headers
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          ...(process.env.NODE_ENV === 'dev'
            ? ["'unsafe-inline'", "'unsafe-eval'"]
            : []),
        ].filter(Boolean),
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          ...env.STYLE_SRC_URLS.split(','),
        ],
        imgSrc: [
          "'self'",
          'data:',
          ...env.IMG_SRC_URLS.split(','),
          process.env.CLIENT_URL,
        ].filter(Boolean) as string[],
        fontSrc: ["'self'", ...env.FONT_SRC_URLS.split(',')],
        connectSrc: [
          "'self'",
          env.SERVER_URL,
          ...env.CONNECT_SRC_URLS.split(','),
          ...(process.env.NODE_ENV === 'dev' ? [env.DEV_WEBSOCKET_URL] : []),
        ].filter(Boolean),
        frameSrc: ["'self'"],
        objectSrc: ["'none'"],
      },
    },
    crossOriginResourcePolicy: {
      policy: process.env.NODE_ENV === 'prod' ? 'same-site' : 'cross-origin',
    },
  }),

  // CORS Moved to index page


  // CSRF protection
  csrfProtection,

  express.json({ limit: '10kb' }),
  express.urlencoded({ extended: true, limit: '10kb' }),

  // Remove X-Powered-By header
  (req: Request, res: Response, next: NextFunction) => {
    res.removeHeader('X-Powered-By')
    next()
  },
]

// Apply rate limiting specifically to auth routes
export const authRateLimiter = authLimiter

// Apply general rate limiting to API routes
export const apiRateLimiter = apiLimiter

// Authentication middleware
// Define a custom type for the request object to include the 'user' property
interface CustomRequest extends Request {
  user?: { id: number; email: string } // Adjust the type of 'user' as needed
}

export const authenticate = (
  req: CustomRequest, // Use the custom request type here
  res: Response,
  next: NextFunction
): void | Promise<void> => {
  try {
    const accessToken = req.cookies.accessToken

    if (!accessToken) {
      res.status(401).json({
        responseType: 'ERROR',
        responseMessage: 'Authentication required',
        responseData: null,
      })
      return
    }

    const decoded = verifyToken(accessToken, 'access')

    // Verify user status in database || Currently commented to ensure performance
    // const user = await prisma.sYF_USERMASTER.findUnique({
    //   where: { LID: decoded.id },
    //   select: { STATUS: true },
    // })

    req.user = decoded

    next()
  } catch (error) {
    let errorMessage = 'An unknown error occurred' 
    if (error instanceof Error) {
      errorMessage = error.message
    }
    logger.error('Authentication error:', errorMessage)
    res.status(401).json({
      responseType: 'ERROR',
      responseMessage: 'Invalid or expired token',
      responseData: null,
    })
    return
  }
}
