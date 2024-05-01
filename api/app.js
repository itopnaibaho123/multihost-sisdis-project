const PORT = 3000
const HOST = 'http://127.0.0.1'
const express = require('express')
const cors = require('cors')
const app = express()

const router = require('./routes/index.js')
const { enrollAdmin, registerAdminKementrian } = require('./services/user.js')

app.use(express.json())
app.use(cors())
app.use('/api/v1/', router)

app.get('/test', (req, res) => res.send('Hello World!'))
app.post('/test-post', (req, res) => res.send('Received data:', req.body))

app.listen(PORT, async () => {
  try {
    console.log(`Express app running on host ${HOST}:${PORT}`)
    await enrollAdmin('admin', 'adminpw', 'Kementrian')
    await enrollAdmin('admin', 'adminpw', 'SupplyChain')
    await registerAdminKementrian(
      'adminkm',
      'adminkmcarbon@gmail.com',
      'Kementrian',
      'admin-kementerian'
    )
  } catch {}
})

process.on('uncaughtException', (error) => {
  console.log(error)
})
