// src/index.ts

// Load environment variables only in development
if (process.env.NODE_ENV !== 'production') {
  try {
    require('dotenv').config()
  } catch (error) {
    console.error('Failed to load dotenv:', error)
  }
}

import express from 'express'
import cookieParser from 'cookie-parser'
import { securityMiddleware } from './middleware/security'
import authRoutes from './routes/auth.routes'
import logger from './config/logger'

const app = express()
const port = process.env.PORT || 3000 // Use environment variable for port

// --- Core Express Middleware ---
app.use(express.json({ limit: '10kb' })) // Body parser for JSON
app.use(express.urlencoded({ extended: true, limit: '10kb' })) // Body parser for URL-encoded data
app.use(cookieParser()) // Crucial: Parses cookies and populates req.cookies

// --- Security Middleware (including CSRF) ---
app.use(securityMiddleware)

app.use('/api', authRoutes)

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() })
})

// --- CSRF Token Endpoint ---
// This endpoint is essential for frontends and Postman to get the XSRF-TOKEN cookie.
// It should be placed after cookieParser but before stricter security checks.
app.get('/api/csrf-token', (req, res) => {
  // Generate a random token. For production, consider a more robust library
  // or a secure random string generator.
  const csrfToken =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)

  // Set the cookie with appropriate security flags
  res.cookie('XSRF-TOKEN', csrfToken, {
    httpOnly: process.env.NODE_ENV === 'production',
    secure: process.env.NODE_ENV === 'production', // Use secure: true in production with HTTPS
    sameSite: process.env.NODE_ENV === 'production' ? 'lax' : 'none', // Adjust based on your CORS needs
    maxAge: 60 * 60 * 1000, // 1 hour, or match your session expiry
  })

  res.status(200).json({
    responseType: 'SUCCESS',
    responseMessage: 'CSRF token set in cookie',
    responseData: null,
  })
})

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

app.listen(port, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`)
  console.log(`CORS origin set to: ${process.env.CLIENT_URL}`) // For debugging
})
