import { z } from 'zod'

// Common sanitization
const sanitizeString = (val: string) => val.trim().replace(/[<>{}]/g, '')

export const createAssignmentNatureSchema = z.object({
  body: z.object({
    data: z
      .object({
        assignmentNature: z
          .string()
          .min(1, 'Assignment Nature is required')
          .transform(sanitizeString),

        type: z.string().min(1, 'Type is required').transform(sanitizeString),

        frequency: z
          .string()
          .optional()
          .transform((val) => (val ? sanitizeString(val) : undefined)),

        statutoryAssign: z
          .string()
          .min(1, 'Statutory assign is required')
          .transform((val) => (val ? sanitizeString(val) : undefined)),

        standardPrice: z
          .string()
          .regex(/^\d+(\.\d{1,2})?$/, 'Standard Price must be a number'),

        multiplier: z.coerce.number().optional(),

        companyId: z
          .number({ invalid_type_error: 'companyId must be a number' })
          .positive('Invalid companyId'),

        addeduser: z.string().transform(sanitizeString),

        companyName: z.string().transform(sanitizeString),
      })
      .superRefine((data, ctx) => {
        const type = data.type?.toLowerCase()

        if (type === 'recurring') {
          if (!data.frequency) {
            ctx.addIssue({
              path: ['frequency'],
              code: z.ZodIssueCode.custom,
              message: 'Frequency is required for Recurring type',
            })
          }
          if (data.multiplier === undefined || data.multiplier === null) {
            ctx.addIssue({
              path: ['multiplier'],
              code: z.ZodIssueCode.custom,
              message: 'Multiplier is required for Recurring type',
            })
          }
        }

        if (type === 'non recurring') {
          // Set default values for missing fields
          if (!data.frequency) {
            data.frequency = 'No'
          }
          if (data.multiplier === undefined || data.multiplier === null) {
            data.multiplier = 0
          }
        }
      }),
  }),
})

export const getAssignmentNaturesSchema = z.object({
  body: z.object({
    companyid: z
      .number({ invalid_type_error: 'companyid must be a number' })
      .positive('Invalid companyid')
      .optional(),
  }),
})

export const getAssignmentNatureByIdSchema = z.object({
  params: z.object({
    id: z
      .string()
      .regex(/^\d+$/, 'ID must be numeric')
      .transform(Number)
      .refine((id) => id > 0, 'ID must be a positive number'),
  }),
})

// Types
export type CreateAssignmentNatureInput = z.infer<
  typeof createAssignmentNatureSchema
>
export type GetAssignmentNaturesInput = z.infer<
  typeof getAssignmentNaturesSchema
>
export type GetAssignmentNatureByIdInput = z.infer<
  typeof getAssignmentNatureByIdSchema
>
