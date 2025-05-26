import { Request, Response } from 'express'
import { prisma } from '../config/prisma'
import logger from '../config/logger'

export class MastersController {
  /**
   * Get all Assignment Natures
   */
  static getAssignmentNatures = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const assignments = await prisma.assignmentNature.findMany({
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
   * Get Assignment Nature by ID
   */
  static getAssignmentNatureById = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { id } = req.params
      const lid = parseInt(id)
      if (isNaN(lid)) {
        res.status(400).json({ error: 'Invalid ID format' })
        return
      }

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
