// src/routes/auth.routes.ts
import { Router } from 'express'
import { AuthController } from '../controllers/auth.controller'
import { validate } from '../middleware/validation'
import {
  loginSchema,
  registerSchema,
  deleteUserSchema,
  verifyEmailSchema,
  resetPasswordSchema,
  forgotPasswordSchema,
} from '../validation/auth.schema'
import { authRateLimiter } from '../middleware/security'

const router = Router()

// Authentication routes
// router.post('/register', validate(registerSchema), AuthController.register)
// router.post('/login', validate(loginSchema), AuthController.login)
// router.post('/refresh-token', AuthController.refreshToken)
// router.post('/forgot-password', AuthController.forgotPassword)
// router.post('/reset-password', AuthController.resetPassword)

// Registration
router.post('/register', authRateLimiter, validate(registerSchema), AuthController.register)

// Email verification
router.get(
  '/verify-email/:token', authRateLimiter,
  validate(verifyEmailSchema),
  AuthController.verifyEmail
)

// Login
router.post('/login', authRateLimiter, validate(loginSchema), AuthController.login)

// Refresh token
router.post('/refresh', AuthController.refreshToken)

router.post(
  '/forgot-password', authRateLimiter,
  validate(forgotPasswordSchema),
  AuthController.forgotPassword
)

router.post(
  '/reset-password', authRateLimiter,
  validate(resetPasswordSchema),
  AuthController.resetPassword
)

router.delete(
  '/delete/user/:id',
  validate(deleteUserSchema),
  AuthController.deleteUser
)

router.post('/logout', AuthController.logout)

// // Legacy endpoint (to deprecate)
// router.post(
//   '/window_createAccountNew',
//   validate(registerSchema),
//   AuthController.register
// )

// Test route
// router.get('/test', (req, res) => {
//   res.send('Test route works!')
// })

export default router
