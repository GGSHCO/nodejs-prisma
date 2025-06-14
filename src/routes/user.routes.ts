// src/routes/user.routes.ts
import { Router } from 'express'
import { UserController } from '../controllers/user.controller'
import { validate } from '../middleware/validation'
import {
  getUserByIdSchema,
  getCurrentUserSchema,
} from '../validation/user.schema'

const router = Router()

// POST /api/user/getUserById
router.post('/getUserById', validate(getUserByIdSchema), UserController.getUserById)

// GET /api/user/me (no input, just token)
router.get('/me', validate(getCurrentUserSchema), UserController.getCurrentUser)

router.get('/company', validate(getCurrentUserSchema), UserController.getUserCompany)

export default router
