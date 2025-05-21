import { PrismaClient, Prisma } from '../../prisma/generated/prisma/client'
// import { PrismaClient, Prisma } from '@prisma/client'
import logger from './logger'

// Initialize Prisma Client with proper typing
const prisma = new PrismaClient({
  log: [
    { level: 'warn', emit: 'event' },
    { level: 'error', emit: 'event' },
  ],
})

// Type-safe event handling
prisma.$on('warn' as never, (e: Prisma.LogEvent) => {
  logger.warn(`Prisma Warning: ${e.message}`)
})

prisma.$on('error' as never, (e: Prisma.LogEvent) => {
  logger.error(`Prisma Error: ${e.message}`)
})

export { prisma }
