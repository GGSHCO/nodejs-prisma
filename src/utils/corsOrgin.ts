// src/utils/corsOrigin.ts

const corsOrigin =
  process.env.NODE_ENV === 'prod'
    ? ['https://www.speedyourfin.ai', 'https://syf-nextjs.vercel.app']
    : ['http://localhost:3001', 'http://192.168.1.15:3001']

const cookieDomain =
  process.env.NODE_ENV === 'prod' ? 'https://syf-nextjs.vercel.app' : undefined
export { corsOrigin, cookieDomain }
