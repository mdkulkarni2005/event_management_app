import mongoose from 'mongoose'

export async function connectDB(uri) {
  const mongoUri = uri || process.env.MONGODB_URI
  if (!mongoUri) {
    console.warn('[db] MONGODB_URI not set. Provide it in .env or pass to connectDB(uri).')
    return null
  }
  mongoose.set('strictQuery', true)
  await mongoose.connect(mongoUri, { autoIndex: true })
  console.log('[db] connected')
  return mongoose.connection
}

export async function disconnectDB() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect()
    console.log('[db] disconnected')
  }
}
