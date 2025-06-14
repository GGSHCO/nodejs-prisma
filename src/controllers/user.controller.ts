// src/controllers/user.controller.ts
import { Request, Response } from 'express'
import { prisma } from '../config/prisma'
import logger from '../config/logger'
import {
  GetUserByIdSchemaInput,
  GetCurrentUserSchemaInput,
} from '../validation/user.schema'

export class UserController {
  // Get user by ID (via body.id)
  static getUserById = async (
    req: Request<{}, {}, GetUserByIdSchemaInput['body']>,
    res: Response
  ): Promise<void> => {
    try {
      const { id } = res.locals.sanitized.body.data

      const user = await prisma.sYF_USERMASTER.findUnique({
        where: { LID: id },
        select: {
          LID: true,
          NAME: true,
          EMAIL: true,
          STATUS: true,
        },
      })

      if (!user) {
        res.status(404).json({
          responseType: 'ERROR',
          responseMessage: 'User not found',
          responseData: null,
        })
        return
      }

      res.status(200).json({
        responseType: 'SUCCESS',
        responseMessage: 'User fetched successfully',
        responseData: user,
      })
    } catch (error) {
      logger.error('Error fetching user by ID:', error)
      res.status(500).json({
        responseType: 'ERROR',
        responseMessage: 'Failed to fetch user',
        responseData: null,
      })
    }
  }

  // Get currently authenticated user from token
  static getCurrentUser = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const userId = (req as any).user?.id

      const user = await prisma.sYF_USERMASTER.findUnique({
        where: { LID: userId },
        select: {
          LID: true,
          NAME: true,
          EMAIL: true,
        },
      })

      if (!user) {
        res.status(404).json({
          responseType: 'ERROR',
          responseMessage: 'User not found',
          responseData: null,
        })
        return
      }

      res.status(200).json({
        responseType: 'SUCCESS',
        responseMessage: 'User data',
        responseData: user,
      })
    } catch (error) {
      logger.error('Error fetching current user:', error)
      res.status(500).json({
        responseType: 'ERROR',
        responseMessage: 'Internal server error',
        responseData: null,
      })
    }
  }

   // Get company listing associated with user from token
  static getUserCompany = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const userId = (req as any).user?.id

      const user = await prisma.sYF_USERMASTER.findUnique({
        where: { LID: userId },
        select: {
          LID: true,
          NAME: true,
          EMAIL: true,
          STATUS: true,
        },
      })

      if (!user) {
        res.status(404).json({
          responseType: 'ERROR',
          responseMessage: 'User not found',
          responseData: null,
        })
        return
      }

      res.status(200).json({
        responseType: 'SUCCESS',
        responseMessage: 'User data',
        responseData: user,
      })
    } catch (error) {
      logger.error('Error fetching current user:', error)
      res.status(500).json({
        responseType: 'ERROR',
        responseMessage: 'Internal server error',
        responseData: null,
      })
    }
  }
}
