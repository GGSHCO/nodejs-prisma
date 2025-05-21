// // src/services/auth.service.ts
// import { prisma } from '../config/prisma'
// import bcrypt from 'bcryptjs'
// import { env } from '../config/env'

// // Add explicit return types
// export const AuthService = {
//   async createUser(
//     email: string,
//     password: string
//   ): Promise<{ id: number; email: string }> {
//     try {
//       // Add try...catch inside createUser
//       const hashedPassword = await bcrypt.hash(password, 12)
//       const user = await prisma.user.create({
//         data: {
//           email,
//           password: hashedPassword,
//         },
//       })
//       return { id: user.id, email: user.email }
//     } catch (error) {
//       console.error('AuthService.ts: Error during createUser:', error) // Log error in createUser
//       throw error // Re-throw the error so AuthController can catch it
//     }
//   },

//   async validateUser(
//     email: string,
//     password: string
//   ): Promise<{ id: number; email: string } | null> {
//     const user = await prisma.user.findUnique({
//       where: { email },
//       select: { id: true, email: true, password: true },
//     })

//     if (!user || !user.password) return null

//     const isValid = await bcrypt.compare(password, user.password)
//     return isValid ? { id: user.id, email: user.email } : null
//   },
// }
