// src/validation/auth.schema.ts
import { z } from 'zod'

// Sanitization functions
const sanitizeString = (value: string) => value.trim().replace(/[<>{}]/g, '')
const sanitizeEmail = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-zA-Z0-9@._-]/g, '')

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,128}$/

export const registerSchema = z.object({
  body: z.object({
    data: z.object({
      name: z
        .string()
        .min(1, 'Name is required')
        .regex(/^[a-zA-Z\s'-]+$/, 'Name contains invalid characters')
        .transform(sanitizeString),
      email: z
        .string()
        .refine((v) => z.string().email().safeParse(v).success, {
          message: 'Invalid email address',
        })
        .transform(sanitizeEmail),
      password: z
        .string()

        .min(8, 'Password must be at least 8 characters')
        .regex(passwordRegex, {
          message:
            'Password must contain uppercase, lowercase, number, and special character',
        })
        .transform(sanitizeString),
    }),
  }),
})

export const loginSchema = z.object({
  body: z.object({
    data: z.object({
      email: z
        .string()
        .transform(sanitizeEmail)
        .refine(
          (v) => z.string().email().safeParse(v).success,
          'Invalid email address'
        ),

      password: z
        .string()
        .min(1, 'Password is required')
        .transform(sanitizeString),
    }),
  }),
})

export const verifyEmailSchema = z.object({
  params: z.object({
    // Validate the 'params' object for URL parameters
    token: z
      .string()
      .min(1, 'Verification token is required')
      // .length(64, 'Invalid token length') // Assuming your token is a 32-byte hex string (32 * 2 = 64 chars)
      // .regex(/^[a-f0-9]+$/, 'Invalid token format') // Ensure it's a hex string
      .transform(sanitizeString), // Apply sanitization if needed, though for a hex token it's less critical
  }),
})

export const deleteUserSchema = z.object({
  params: z.object({
    id: z
      .string()
      .transform((v) => v.replace(/\D/g, '')) // Remove non-digit characters
      .refine((v) => v.length > 0, 'ID must contain at least one number')
      .transform(Number)
      .refine((n) => n > 0, 'ID must be positive number'),
  }),
})

export const forgotPasswordSchema = z.object({
  body: z.object({
    data: z.object({
      email: z
        .string()
        .transform(sanitizeEmail)
        .refine(
          (v) => z.string().email().safeParse(v).success,
          'Invalid email address'
        ),
    }),
  }),
})

export const resetPasswordSchema = z.object({
  body: z.object({
    data: z.object({
      token: z
        .string()
        .min(1, 'Token is required')
        .length(64, 'Invalid token length')
        .regex(/^[a-f0-9]+$/, 'Invalid token format'),
      newPassword: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(passwordRegex, {
          message:
            'Password must contain uppercase, lowercase, number, and special character',
        })
        .transform(sanitizeString),
    }),
  }),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
