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

import { securityMiddleware, apiRateLimiter, authenticate } from './middleware/security'

// import legacyApp from './legacy/app.js'


import authRoutes from './routes/auth.routes'
import mastersRoutes from './routes/masters.routes'
import userRoutes from './routes/user.routes'

import logger from './config/logger'
import { setCookie } from './utils/setCookie'
import { generateRandomToken } from './utils/jwt'

import cors from 'cors'
import { corsOrigin } from './utils/corsOrgin'

const app = express()
const port = process.env.PORT || 4000

app.set('trust proxy', 1);
app.use(cookieParser())

app.use(cors({
  origin: corsOrigin,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-CSRF-Token'],
  credentials: true,
  exposedHeaders: ['set-cookie'], // Important for CSRF cookie visibility
  maxAge: 24 * 60 * 60 * 1000,
}))

// --- CSRF Token Endpoint ---
app.get('/api/csrf-token', (req, res) => {
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

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date(), message: '30/06/2025, 05:05' })
})

app.use(securityMiddleware)

app.use('/api', authRoutes)

// app.use('/', authenticate,  apiRateLimiter, legacyApp);

app.use('/api/masters', authenticate, apiRateLimiter, mastersRoutes) // Production
app.use('/api/user', authenticate, apiRateLimiter, userRoutes) // Production




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

console.log('CORS Origin:', corsOrigin)

app.listen(port, () => {
  const os = require('os');
  const interfaces = os.networkInterfaces();
  const addresses: string[] = [];

  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] || []) {
      if (iface.family === 'IPv4' && !iface.internal) {
        addresses.push(iface.address);
      }
    }
  }

  console.log(`\nLocal:   http://localhost:${port}`);
  addresses.forEach(addr => {
    console.log(`Network: http://${addr}:${port}`);
  });
});
