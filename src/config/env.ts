// src/config/env.ts

// dotenv has been loaded in index.ts

import { z } from 'zod'


const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'prod']).default('dev'),
  DATABASE_URL: z.string(),
  PORT: z.preprocess(
    (val) => (typeof val === 'string' ? parseInt(val, 10) : val),
    z.number().int().positive().default(3000)
  ),
  JWT_SECRET: z.string(),
  JWT_ACCESS_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  JWT_EXPIRES_IN: z
    .string()
    .regex(
      /^\d+(ms|s|m|h|d|y)$/,
      'Invalid format for JWT_EXPIRES_IN. Use formats like 15m, 7d, 1h, etc.'
    )
    .default('15m'),
  REFRESH_TOKEN_EXPIRES: z
    .string()
    .regex(
      /^\d+(ms|s|m|h|d|y)$/,
      'Invalid format for REFRESH_TOKEN_EXPIRES. Use formats like 15m, 7d, 1h, etc.'
    )
    .default('7d'),
  SERVER_URL: z.string(),
  CLIENT_URL: z.string(),
  SMTP_HOST: z.string(),
  SMTP_PORT: z.string(),
  SMTP_USER: z.string(),
  SMTP_PASS: z.string(),
  SMTP_FROM: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),

  STYLE_SRC_URLS: z.string(),
  FONT_SRC_URLS: z.string(),
  IMG_SRC_URLS: z.string(),
  CONNECT_SRC_URLS: z.string(),
  DEV_WEBSOCKET_URL: z.string(),
})

// Declare env variable outside the try block
let parsedEnv: z.infer<typeof envSchema>

// Add a try...catch block to log validation errors
try {
  // Validate environment variables against the schema and assign to parsedEnv
  parsedEnv = envSchema.parse(process.env)
  // Removed console.log('Environment variables validated successfully in env.ts.');
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error('❌ Environment variable validation error in env.ts:')
    error.errors.forEach((err) => {
      console.error(` - ${err.path.join('.')}: ${err.message}`)
    })
    process.exit(1) // Exit the process if env validation fails
  } else {
    console.error(
      'An unexpected error occurred during environment variable validation in env.ts:',
      error
    )
    process.exit(1) // Exit for other errors
  }
}

// Export the env variable at the top level
export const env = parsedEnv
