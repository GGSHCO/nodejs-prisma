// To run this file, use the command: npx ts-node src/query/migratePasswords.ts

import { prisma } from '../config/prisma'
import { AuthController } from '../controllers/auth.controller'

async function migratePasswords() {
  try {
    const users = await prisma.sYF_USERMASTER.findMany({
      where: {
        encPassword: null,
        salt: null,
      },
      select: {
        LID: true,
        PASSWORD: true, // base64-encoded old password
      },
    })

    console.log(`Found ${users.length} users to migrate.`)

    for (const user of users) {
      try {
        const decodedPassword = Buffer.from(
          user.PASSWORD ?? '',
          'base64'
        ).toString('utf-8')
        const { bcryptHash, uniqueSalt } = await AuthController['hashPassword'](
          decodedPassword
        )

        await prisma.sYF_USERMASTER.update({
          where: { LID: user.LID },
          data: {
            encPassword: bcryptHash,
            salt: uniqueSalt,
            STATUS: 'login',
            failedLoginAttempts: 0,
          },
        })

        console.log(`✅ Updated user ID: ${user.LID}`)
      } catch (err) {
        console.error(`❌ Failed to update user ID: ${user.LID}`, err)
      }
    }

    console.log('🎉 Migration completed.')
  } catch (err) {
    console.error('Migration failed:', err)
  } finally {
    await prisma.$disconnect()
  }
}

migratePasswords()
