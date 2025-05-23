import express from 'express'

const app = express()
const port = process.env.PORT || 3000

// --- Register routes ---
app.post('/test-post', (req, res) => {
  res.status(200).send('POST test from home')
})

app.get('/test-get', (req, res) => {
  res.status(200).json({ status: 'ok' })
})

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() })
})

app.listen(port, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`)
})
