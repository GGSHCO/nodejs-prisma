import { Request, Response } from 'express'
import { prisma } from '../config/prisma'
import logger from '../config/logger'
import {
  CreateAssignmentNatureInput,
  GetAssignmentNaturesInput,
  GetAssignmentNatureByIdInput,
} from '../validation/masters.schema'

export class MastersController {
  /**
   * Get all Assignment Natures
   */
  static getAssignmentNatures = async (
    req: Request<{}, {}, GetAssignmentNaturesInput['body']>,
    res: Response
  ): Promise<void> => {
    try {
      const { companyid } = req.body

      const assignments = await prisma.assignmentNature.findMany({
        where: companyid
          ? {
              companyId: companyid.toString(),
            }
          : undefined,
        select: {
          lid: true,
          assignmentNature: true,
          statutoryAssignment: true,
          assignmentFrequency: true,
          type: true,
        },
        orderBy: {
          assignmentNature: 'asc',
        },
      })

      res.status(200).json({
        responseType: 'SUCCESS',
        responseMessage: 'Fetched assignment natures',
        responseData: assignments,
      })
    } catch (error) {
      logger.error('Error fetching assignment natures:', error)
      res.status(500).json({
        responseType: 'ERROR',
        responseMessage: 'Failed to fetch assignment natures',
        responseData: null,
      })
    }
  }

  /**
   * Create a Assignment Nature
   */
  static createAssignmentNature = async (
    req: Request<{}, {}, CreateAssignmentNatureInput['body']>,
    res: Response
  ): Promise<void> => {
    try {
      const {
        assignmentNature,
        type,
        frequency,
        statutoryAssign,
        standardPrice,
        multiplier,
        companyId,
        addeduser,
        companyName,
      } = res.locals.sanitized.body.data

      const newAssignment = await prisma.assignmentNature.create({
        data: {
          assignmentNature,
          type,
          assignmentFrequency: frequency,
          statutoryAssignment: statutoryAssign,
          standardPrice,
          multiplier,
          companyId: companyId.toString(),
          addedUser: addeduser,
          companyName,
        },
      })

      res.status(201).json({
        responseType: 'SUCCESS',
        responseMessage: 'Assignment Nature created successfully',
        responseData: newAssignment,
      })
    } catch (error: any) {
      if (error.code === 'P2002') {
        res.status(409).json({
          responseType: 'ERROR',
          responseMessage: 'Assignment Nature already exists',
          responseData: null,
        })
      } else {
        logger.error('Error creating assignment nature:', error)
        res.status(500).json({
          responseType: 'ERROR',
          responseMessage: 'Failed to create assignment nature',
          responseData: null,
        })
      }
    }
  }

  /**
   * Get Assignment Nature by ID
   */
  static getAssignmentNatureById = async (
    req: Request<GetAssignmentNatureByIdInput['params']>,
    res: Response
  ): Promise<void> => {
    try {
      const { id } = req.params
      const lid = id // already validated and transformed to number in Zod

      const record = await prisma.assignmentNature.findUnique({
        where: { lid },
      })

      if (!record) {
        res.status(404).json({
          responseType: 'ERROR',
          responseMessage: 'Assignment Nature not found',
          responseData: null,
        })
        return
      }

      res.status(200).json({
        responseType: 'SUCCESS',
        responseMessage: 'Fetched assignment nature',
        responseData: record,
      })
    } catch (error) {
      logger.error('Error fetching assignment nature by ID:', error)
      res.status(500).json({
        responseType: 'ERROR',
        responseMessage: 'Internal server error',
        responseData: null,
      })
    }
  }
}
