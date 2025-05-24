import express from 'express'

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

// --- Register routes ---
app.post('/test-post', (req, res) => {
  console.log('POST /test-post called')
  res.status(200).send('POST test from home')
})

app.get('/test-get', (req, res) => {
  console.log('GET /test-get called')
  res.status(200).json({ status: 'ok' })
})

app.get('/greet', (req, res) => {
  const name = req.query.name // Getting 'name' from the query string sc
  console.log(`GET /greet called with name = ${name}`)

  if (name) {
    res.status(200).json({ message: `Hello, ${name}!` })
  } else {
    res.status(200).json({ error: 'Name query parameter is missing' })
  }
})

app.post('/send-json', (req, res) => {
  const data = req.body
  console.log('Received JSON:', data)

  res.status(200).json({ message: 'POST JSON received', data })
})

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() })
})

app.listen(port, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`)
})
