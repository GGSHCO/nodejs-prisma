// src/middleware/validation.ts
import { Request, Response, NextFunction } from 'express'
import { AnyZodObject, ZodError, z } from 'zod'

export const validate = (schema: AnyZodObject) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      })

      // Replace request data with sanitized values
      res.locals.sanitized = {
        body: result.body || req.body,
        query: result.query || req.query,
        params: result.params || req.params,
      }

      next()
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          status: 'fail',
          errors: error.errors.map((e) => ({
            path: e.path.join('.'),
            message: e.message,
          })),
        })
      } else {
        next(error)
      }
    }
  }
}
