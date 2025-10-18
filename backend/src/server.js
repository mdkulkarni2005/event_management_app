import 'dotenv/config'
import app from './app.js'
import { connectDB } from './config/db.js'

const PORT = process.env.PORT || 4000

async function start() {
  try {
    await connectDB()
  } catch (e) {
    console.warn('[server] starting without DB connection:', e.message)
  }
  app.listen(PORT, () => {
    console.log(`[server] listening on http://localhost:${PORT}`)
  })
}

start()
