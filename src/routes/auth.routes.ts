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

const router = Router()

// Authentication routes
// router.post('/register', validate(registerSchema), AuthController.register)
// router.post('/login', validate(loginSchema), AuthController.login)
// router.post('/refresh-token', AuthController.refreshToken)
// router.post('/forgot-password', AuthController.forgotPassword)
// router.post('/reset-password', AuthController.resetPassword)

// Registration
router.post('/register', validate(registerSchema), AuthController.register)

// Email verification
router.get(
  '/verify-email/:token',
  validate(verifyEmailSchema),
  AuthController.verifyEmail
)

// Login
router.post('/login', validate(loginSchema), AuthController.login)

// Refresh token
router.post('/refresh', AuthController.refreshToken)

router.post(
  '/forgot-password',
  validate(forgotPasswordSchema),
  AuthController.forgotPassword
)

router.post(
  '/reset-password',
  validate(resetPasswordSchema),
  AuthController.resetPassword
)

router.delete(
  '/delete/user/:id',
  validate(deleteUserSchema),
  AuthController.deleteUser
)

// // Logout
// router.post('/logout', AuthController.logout)

// // Forgot password
// router.post(
//   '/forgot-password',
//   validate(forgotPasswordSchema),
//   AuthController.forgotPassword
// )

// // Reset password
// router.post(
//   '/reset-password',
//   validate(resetPasswordSchema),
//   AuthController.resetPassword
// )

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
