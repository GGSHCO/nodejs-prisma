declare module 'express-mongo-sanitize' {
  import { RequestHandler } from 'express'
  interface Options {
    replaceWith?: string | symbol
    onSanitize?: (params: { req: Express.Request; key: string }) => void
  }
  function mongoSanitize(options?: Options): RequestHandler
  export = mongoSanitize
}
