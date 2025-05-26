import { Router } from 'express'
import { MastersController } from '../controllers/masters.controller'

const router = Router()

// Fetch Assignment natures data for a company
router.post('/getAssignmentNatures', MastersController.getAssignmentNatures)

export default router
