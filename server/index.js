import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import { fetchDashboard } from './db.js'

dotenv.config()

const app = express()
const port = process.env.PORT || 4174

app.use(cors())
app.use(express.json())

app.get('/api/health', (_request, response) => {
  response.json({ ok: true, service: 'family-office-api' })
})

app.get('/api/dashboard', async (_request, response) => {
  const dashboard = await fetchDashboard()
  response.json(dashboard)
})

app.listen(port, () => {
  console.log(`Family office API running on http://localhost:${port}`)
})
