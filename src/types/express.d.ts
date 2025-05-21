// src/types/express.d.ts
import { Request } from 'express'
import { TokenPayload } from '../utils/jwt' // Import your TokenPayload interface

// Extend the Express Request interface
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload // Make it optional (`?`) if not all routes will have it
      // Or if you want stricter types:
      // user: TokenPayload; // If `user` will always be present after your middleware
    }
  }
}
