// src/index.ts

// Load environment variables only in development
if (process.env.NODE_ENV !== 'prod') {
  try {
    // Ensure dotenv is only loaded in development mode
    require('dotenv').config()
  } catch (error) {
    console.error('Error loading .env file:', error)
  }
}

import express from 'express'
import cookieParser from 'cookie-parser'

import { securityMiddleware, apiRateLimiter, authRateLimiter } from './middleware/security'
import authRoutes from './routes/auth.routes'
import mastersRoutes from './routes/masters.routes'
import logger from './config/logger'
import { setCookie } from './utils/setCookie'

import { generateRandomToken } from './utils/jwt'
import cors from 'cors'
import { corsOrigin } from './utils/corsOrgin'

const app = express()
const port = process.env.PORT || 4000

// --- Core Express Middleware ---
app.use(cookieParser()) // Crucial: Parses cookies and populates req.cookies

console.log('CORS Origin:', corsOrigin)

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date(), message: '13/06/2025, 11:02' })
})

app.use(cors({
  origin: corsOrigin,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-CSRF-Token'],
  credentials: true,
  exposedHeaders: ['set-cookie'], // Important for CSRF cookie visibility
  maxAge: 24 * 60 * 60 * 1000,
}))

// --- CSRF Token Endpoint ---
// This endpoint is essential for frontends and Postman to get the XSRF-TOKEN cookie.
// It should be placed after cookieParser but before stricter security checks.
app.get('/api/csrf-token', (req, res) => {
  // const csrfToken = crypto.randomBytes(32).toString('hex')

  const csrfToken = generateRandomToken()

  setCookie(res, 'XSRF-TOKEN', csrfToken, {
    maxAge: 24 * 60 * 60 * 1000, 
  })

  res.status(200).json({
    responseType: 'SUCCESS',
    responseMessage: 'CSRF token set in cookie',
    responseData: {csrfToken: csrfToken},
  })
})

app.set('trust proxy', 1);
// app.use((req, res, next) => {
//   const rawIp = req.ip;
//   const cleanedIp = rawIp?.includes(':') ? rawIp.split(':')[0] : rawIp;
//   console.log('Cleaned IP:', cleanedIp);
//   console.log('X-Forwarded-For:', req.headers['x-forwarded-for']);
//   next();
// });

// --- Security Middleware (including CSRF, Helmet) ---
app.use(securityMiddleware)

app.use('/api', authRoutes) // Production
app.use('/api/masters', apiRateLimiter, mastersRoutes) // Production

// app.use('/api', authRoutes) // Local
// app.use('/api/masters', mastersRoutes) // Local

app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    logger.error(`Unhandled error: ${err.stack}`)
    res.status(500).json({ error: 'Internal server error' })
  }
)

app.use((req, res) => {
  res.status(404).json({
    responseType: 'ERROR',
    responseMessage: 'API endpoint not found',
    responseData: null,
  })
})



app.listen(port, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`)
})
