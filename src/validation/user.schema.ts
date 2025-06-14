// src/validation/user.schema.ts
import { z } from 'zod'

const sanitizeString = (val: string) => val.trim().replace(/[<>{}]/g, '')

export const getUserByIdSchema = z.object({
  body: z.object({
    id: z
      .string()
      .regex(/^\d+$/, 'ID must be numeric')
      .transform(Number)
      .refine((id) => id > 0, 'ID must be a positive number'),
  }),
})

export const getCurrentUserSchema = z.object({})

export type GetUserByIdSchemaInput = z.infer<typeof getUserByIdSchema>
export type GetCurrentUserSchemaInput = z.infer<typeof getCurrentUserSchema>
