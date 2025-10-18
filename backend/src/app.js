import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import healthRouter from './routes/health.js'
import profilesRouter from './routes/profiles.js'
import eventsRouter from './routes/events.js'

const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

app.use('/api/health', healthRouter)
app.use('/api/profiles', profilesRouter)
app.use('/api/events', eventsRouter)

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' })
})

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err)
  res.status(err.status || 500).json({ error: err.message || 'Server error' })
})

export default app
