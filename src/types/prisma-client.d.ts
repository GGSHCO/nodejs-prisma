import { PrismaClient } from '@prisma/client/edge'

declare module '@prisma/client/edge' {
  interface PrismaClient {
    $on(
      event: 'warn' | 'error',
      callback: (params: { message: string }) => void
    ): void
  }
}
