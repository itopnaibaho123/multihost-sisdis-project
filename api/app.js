const PORT = 3000
const HOST = 'http://127.0.0.1'
const express = require('express')
const cors = require('cors')
const app = express()

const router = require('./routes/index.js')
const { enrollAdmin, registerAdminBpn } = require('./services/user.js')

app.use(express.json())
app.use(cors())
app.use('/api/v1/', router)

app.listen(PORT, async () => {
  try {
    console.log(`Express app running on host ${HOST}:${PORT}`)
  } catch {}
})

process.on('uncaughtException', (error) => {
  console.log(error)
})
