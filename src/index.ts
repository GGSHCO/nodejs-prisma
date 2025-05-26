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
import crypto from 'crypto'
import { securityMiddleware } from './middleware/security'
import authRoutes from './routes/auth.routes'
import mastersRoutes from './routes/masters.routes'
import logger from './config/logger'
import { setCookie } from './utils/setCookie'
import cors from 'cors'

const app = express()
const port = process.env.PORT || 3000

// app.use(cors())

// --- Core Express Middleware ---
app.use(cookieParser()) // Crucial: Parses cookies and populates req.cookies

// --- CSRF Token Endpoint ---
// This endpoint is essential for frontends and Postman to get the XSRF-TOKEN cookie.
// It should be placed after cookieParser but before stricter security checks.
app.get('/api/csrf-token', (req, res) => {
  const csrfToken = crypto.randomBytes(32).toString('hex')

  setCookie(res, 'XSRF-TOKEN', csrfToken, {
    maxAge: 60 * 60 * 1000,
  })

  res.status(200).json({
    responseType: 'SUCCESS',
    responseMessage: 'CSRF token set in cookie',
    responseData: null,
  })
})

// --- Security Middleware (including CSRF) ---
app.use(securityMiddleware)

app.use('/api', authRoutes)
app.use('/api/masters', mastersRoutes)

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() })
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
