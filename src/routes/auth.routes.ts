// src/routes/auth.routes.ts
import { Router } from 'express'
import { AuthController } from '../controllers/auth.controller'
import { validate } from '../middleware/validation'
import {
  loginSchema,
  registerSchema,
  deleteUserSchema,
  verifyEmailSchema,
} from '../validation/auth.schema'

const router = Router()

// Authentication routes
// router.post('/register', validate(registerSchema), AuthController.register)
// router.post('/login', validate(loginSchema), AuthController.login)
// router.post('/refresh-token', AuthController.refreshToken)
// router.post('/forgot-password', AuthController.forgotPassword)
// router.post('/reset-password', AuthController.resetPassword)
// router.delete(
//   '/user/:id',
//   validate(deleteUserSchema),
//   AuthController.deleteUser
// )

// Registration
router.post('/register', validate(registerSchema), AuthController.register)

// Email verification
router.get(
  '/verify-email/:token',
  validate(verifyEmailSchema),
  AuthController.verifyEmail
)

router.get('/test-logger', AuthController.triggerTestError)

// Login
router.post('/login', validate(loginSchema), AuthController.login)

// // Refresh token
// router.post('/refresh', AuthController.refreshToken)

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
