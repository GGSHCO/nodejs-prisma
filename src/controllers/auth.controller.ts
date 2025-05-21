// src/controllers/auth.controller.ts
import { Request, Response } from 'express'
// import { AuthService } from '../services/auth.service'
import { prisma } from '../config/prisma'
import bcrypt from 'bcryptjs'
import { generateTokens, verifyToken } from '../utils/jwt'
import {
  sendPasswordResetEmail,
  sendVerificationEmail,
} from '../services/email.service'
import crypto from 'crypto'
import logger from '../config/logger'
import { User, UserCheck } from '../interfaces/User'

// Security constants
const PEPPER = process.env.PEPPER_SECRET! // Store in environment variables
const SALT_LENGTH = 64 // 64 bytes = 512 bits
const HASH_ITERATIONS = 12
const PASSWORD_RESET_TOKEN_EXPIRY = 3600000
const EMAIL_VERIFICATION_TOKEN_EXPIRY = 86400000
const ACCOUNT_LOCKOUT_DURATION = 15 * 60 * 1000

export class AuthController {
  /**
   * Enhanced password hashing with multiple layers
   */
  private static async hashPassword(password: string) {
    // Generate unique salt per user
    const uniqueSalt = crypto.randomBytes(SALT_LENGTH).toString('hex')

    // Combine password with pepper and unique salt
    const combined = PEPPER + password + uniqueSalt

    // First layer: SHA-512
    const sha512Hash = crypto
      .createHash('sha512')
      .update(combined)
      .digest('hex')

    // Second layer: bcrypt
    const bcryptHash = await bcrypt.hash(sha512Hash, HASH_ITERATIONS)

    return { bcryptHash, uniqueSalt }
  }

  /**
   * Verify password with multiple layers
   */
  private static async verifyPassword(
    password: string,
    uniqueSalt: string,
    bcryptHash: string
  ) {
    // Recreate SHA-512 hash
    const combined = PEPPER + password + uniqueSalt
    const sha512Hash = crypto
      .createHash('sha512')
      .update(combined)
      .digest('hex')

    // Compare with bcrypt hash
    return bcrypt.compare(sha512Hash, bcryptHash)
  }

  /**
   * Refresh access token using refresh token
   */
  static refreshToken = async (req: Request, res: Response): Promise<void> => {
    try {
      const refreshToken = req.cookies.refreshToken

      if (!refreshToken) {
        res.status(401).json({
          responseType: 'ERROR',
          responseMessage: 'No refresh token provided',
          responseData: null,
        })
        return
      }

      const decoded = verifyToken(refreshToken, 'refresh')

      // Find user and validate token
      const user = await prisma.sYF_USERMASTER.findUnique({
        where: { LID: decoded.id },
      })

      if (!user) {
        res.status(401).json({
          responseType: 'ERROR',
          responseMessage: 'Invalid refresh token',
          responseData: null,
        })
        return
      }

      // Ensure user.EMAIL is not null before token generation
      if (!user.EMAIL) {
        res.status(500).json({
          responseType: 'ERROR',
          responseMessage: 'User email is missing for token generation.',
          responseData: null,
        })
        return
      }
      // Generate new access token
      const newAccessToken = generateTokens({
        id: user.LID,
        email: user.EMAIL,
      }).accessToken

      // Set new access token in cookie
      res.cookie('accessToken', newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: (process.env.NODE_ENV === 'production' ? 'none' : 'lax') as
          | 'none'
          | 'lax',
        domain:
          process.env.NODE_ENV === 'production'
            ? process.env.CLIENT_URL
            : undefined,
        maxAge: 15 * 60 * 1000,
      })

      res.status(200).json({
        responseType: 'SUCCESS',
        responseMessage: 'Token refreshed',
        responseData: null,
      })
    } catch (error) {
      logger.error('Token refresh error:', error)
      res.status(401).json({
        responseType: 'ERROR',
        responseMessage: 'Invalid refresh token',
        responseData: null,
      })
    }
  }

  /**
   * Register a new user
   */
  static register = async (req: Request, res: Response): Promise<void> => {
    // Changed to arrow function
    try {
      const { email, name, password } = res.locals.sanitized.body.data
      const existingUser = await prisma.sYF_USERMASTER.findUnique({
        where: { EMAIL: email },
      })

      if (existingUser) {
        res.status(200).json({
          responseType: 'ERROR',
          responseMessage: 'User already exist',
          responseData: null,
        })
        return
      }

      const { bcryptHash, uniqueSalt } = await this.hashPassword(password)

      const emailVerificationToken = crypto.randomBytes(32).toString('hex')
      const verificationExpires = new Date(
        Date.now() + EMAIL_VERIFICATION_TOKEN_EXPIRY
      )

      const newUser = await prisma.sYF_USERMASTER.create({
        data: {
          EMAIL: email,
          NAME: name,
          PASSWORD: bcryptHash,
          SALT: uniqueSalt,
          ISTALLYSUBSCRIBED: true,
          ZBStatus: 'Not Connected',
          emailVerificationToken: emailVerificationToken,
          verificationExpires: verificationExpires,
          STATUS: 'pending',
        },
      })

      await sendVerificationEmail(name, email, emailVerificationToken)
      logger.info(`User registration for: ${email}`)

      res.status(201).json({
        responseType: 'SUCCESS',
        responseMessage: 'Registered successfully',
        responseData: {
          LID: newUser.LID,
          EMAIL: newUser.EMAIL,
          NAME: newUser.NAME,
        },
      })
    } catch (error) {
      logger.error('Registration error:', error)
      res.status(500).json({
        responseType: 'ERROR',
        responseMessage: 'Internal server error',
        responseData: null,
      })
    }
  }

  /**
   * Verify user email using a token
   */
  static verifyEmail = async (req: Request, res: Response): Promise<void> => {
    try {
      const { token } = req.params // Get the token from the URL parameter

      const user = await prisma.sYF_USERMASTER.findFirst({
        where: {
          emailVerificationToken: token,
          verificationExpires: {
            gt: new Date(), // Token must not be expired (gt = greater than)
          },
        },
      })

      if (!user) {
        res.status(400).json({
          responseType: 'ERROR',
          responseMessage: 'Invalid or expired verification token.',
          responseData: null,
        })
        return
      }

      // If user and valid token found, update status and clear token fields
      await prisma.sYF_USERMASTER.update({
        where: { LID: user.LID },
        data: {
          STATUS: 'active',
          emailVerificationToken: null,
          verificationExpires: null,
        },
      })

      logger.info(`Email verified for user: ${user.EMAIL}`)

      res.status(200).json({
        responseType: 'SUCCESS',
        responseMessage: 'Email verified successfully! You can now log in.',
        responseData: null,
      })
    } catch (error) {
      logger.error('Email verification error:', error)
      res.status(500).json({
        responseType: 'ERROR',
        responseMessage: 'Internal server error during email verification.',
        responseData: null,
      })
    }
  }

  /**
   * Updated login method
   */
  static login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = res.locals.sanitized.body.data

      const user: UserCheck = await prisma.sYF_USERMASTER.findUnique({
        where: { EMAIL: email },
      })

      console.log(user)

      if (!user || !user.PASSWORD || !user.SALT) {
        res.status(401).json({
          responseType: 'ERROR',
          responseMessage: 'Invalid credentials',
          responseData: null,
        })
        return
      }

      // Account lockout check
      if ((user.failedLoginAttempts ?? 0) >= 5) {
        const lockoutExpires = new Date(
          (user.lastFailedLogin?.getTime() || 0) + ACCOUNT_LOCKOUT_DURATION
        )
        if (new Date() < lockoutExpires) {
          res.status(403).json({
            responseType: 'ERROR',
            responseMessage: `Account locked until ${lockoutExpires.toLocaleTimeString()}`,
            responseData: null,
          })
          return
        }
      }

      // Email verification check
      if (user.STATUS !== 'active') {
        res.status(403).json({
          responseType: 'ERROR',
          responseMessage: 'Verify email before login',
          responseData: null,
        })
        return
      }

      // Verify password with multiple layers
      const isValid = await this.verifyPassword(
        password,
        user.SALT,
        user.PASSWORD
      )

      if (!isValid) {
        await prisma.sYF_USERMASTER.update({
          where: { LID: user.LID },
          data: {
            failedLoginAttempts: (user.failedLoginAttempts || 0) + 1,
            lastFailedLogin: new Date(),
          },
        })
        res.status(401).json({
          responseType: 'ERROR',
          responseMessage: 'Invalid credentials',
          responseData: null,
        })
        return
      }

      // Reset failed attempts
      await prisma.sYF_USERMASTER.update({
        where: { LID: user.LID },
        data: {
          failedLoginAttempts: 0,
          lastFailedLogin: null,
          lastLogin: new Date(),
        },
      })

      if (!user.EMAIL) {
        res.status(500).json({
          responseType: 'ERROR',
          responseMessage: 'User email is missing for token generation.',
          responseData: null,
        })
        return
      }

      const userEmail = user.EMAIL

      // Generate tokens
      const tokens = generateTokens({
        id: user.LID,
        email: userEmail,
      })

      // const cookieSettings = {
      //   httpOnly: true,
      //   secure: process.env.NODE_ENV === 'production',
      //   sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      //   domain:
      //     process.env.NODE_ENV === 'production'
      //       ? process.env.CLIENT_URL
      //       : undefined,
      //   maxAge: type === 'access' ? 15 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000,
      // }

      // Set secure cookies
      res.cookie('accessToken', tokens.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        // sameSite: 'strict',
        sameSite: (process.env.NODE_ENV === 'production' ? 'none' : 'lax') as
          | 'none'
          | 'lax',
        domain:
          process.env.NODE_ENV === 'production'
            ? process.env.CLIENT_URL
            : undefined,
        maxAge: 15 * 60 * 1000,
      })

      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: (process.env.NODE_ENV === 'production' ? 'none' : 'lax') as
          | 'none'
          | 'lax',
        domain:
          process.env.NODE_ENV === 'production'
            ? process.env.CLIENT_URL
            : undefined,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/api/refresh',
      })

      res.status(200).json({
        responseType: 'SUCCESS',
        responseMessage: 'Login successful',
        responseData: {
          LID: user.LID,
          EMAIL: user.EMAIL,
          NAME: user.NAME,
        },
      })
    } catch (error) {
      logger.error('Login error:', error)
      res.status(500).json({
        responseType: 'ERROR',
        responseMessage: 'Internal server error',
        responseData: null,
      })
    }
  }

  // static async forgotPassword(req: Request, res: Response): Promise<void> {
  //   try {
  //     const { email } = req.body
  //     const user = await prisma.user.findUnique({ where: { email } })

  //     if (user) {
  //       const resetToken = crypto.randomBytes(32).toString('hex')
  //       const expiresAt = new Date(Date.now() + 3600000) // 1 hour

  //       await prisma.user.update({
  //         where: { id: user.id },
  //         data: { resetToken, resetExpires: expiresAt },
  //       })

  //       await sendPasswordResetEmail(email, resetToken)
  //     }

  //     res.json({
  //       message: 'If the email exists, a reset link has been sent',
  //     })
  //   } catch (error) {
  //     console.error('Forgot password error:', error)
  //     res.status(500).json({ error: 'Internal server error' })
  //   }
  // }

  // static async resetPassword(req: Request, res: Response): Promise<void> {
  //   try {
  //     const { token, newPassword } = req.body
  //     const user = await prisma.user.findFirst({
  //       where: {
  //         resetToken: token,
  //         resetExpires: { gt: new Date() },
  //       },
  //     })

  //     if (!user) {
  //       res.status(400).json({ error: 'Invalid or expired token' })
  //       return // Added return
  //     }

  //     const hashedPassword = await bcrypt.hash(newPassword, 12)
  //     await prisma.user.update({
  //       where: { id: user.id },
  //       data: {
  //         password: hashedPassword,
  //         resetToken: null,
  //         resetExpires: null,
  //       },
  //     })

  //     res.json({ message: 'Password updated successfully' })
  //   } catch (error) {
  //     console.error('Reset password error:', error)
  //     res.status(500).json({ error: 'Internal server error' })
  //   }
  // }

  // static async deleteUser(req: Request, res: Response): Promise<void> {
  //   try {
  //     const { id } = req.params // Added a check to ensure id is a number before parsing
  //     const userId = parseInt(id)
  //     if (isNaN(userId)) {
  //       res.status(400).json({ error: 'Invalid user ID' })
  //       return
  //     }
  //     await prisma.user.delete({ where: { id: userId } })
  //     res.status(204).send() // Use send() for 204 No Content
  //   } catch (error) {
  //     console.error('Delete user error:', error)
  //     // Check if the error is due to the user not being found
  //     // Add a type guard to check if error is an object and has a 'code' property
  //     if (
  //       typeof error === 'object' &&
  //       error !== null &&
  //       'code' in error &&
  //       error.code === 'P2025'
  //     ) {
  //       res.status(404).json({ error: 'User not found' })
  //     } else {
  //       res.status(500).json({ error: 'Internal server error' })
  //     }
  //   }
  // }
}
