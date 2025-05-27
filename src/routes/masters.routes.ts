import { Router } from 'express'
import { MastersController } from '../controllers/masters.controller'

import { validate } from '../middleware/validation'
import {
  createAssignmentNatureSchema,
  getAssignmentNaturesSchema,
  getAssignmentNatureByIdSchema,
} from '../validation/masters.schema'

const router = Router()

router.post(
  '/getAssignmentNatures',
  validate(getAssignmentNaturesSchema),
  MastersController.getAssignmentNatures
)

router.post(
  '/createAssignmentNature',
  validate(createAssignmentNatureSchema),
  MastersController.createAssignmentNature
)

// router.get(
//   '/getAssignmentNatureById/:id',
//   validate(getAssignmentNatureByIdSchema),
//   MastersController.getAssignmentNatureById
// )

export default router
