// src/utils/corsOrigin.ts
// Important: Origins needs full url and cookie needs just domain name

const corsOrigin =
  process.env.NODE_ENV === 'prod'
    ? ['https://speedyourfin.ai', 'https://www.speedyourfin.ai' , 'https://syf.speedyourfin.ai','http://localhost:3080', 'http://desktop-dssus3g:82']
    : ['http://localhost:3080', 'http://desktop-dssus3g:82']

const cookieDomain =
  process.env.NODE_ENV === 'prod' ? '.speedyourfin.ai' : undefined

export { corsOrigin, cookieDomain }
