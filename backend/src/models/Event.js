import mongoose from 'mongoose'

const EventSchema = new mongoose.Schema(
  {
    profileIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UserProfile', index: true }],
    timezone: { type: String, required: true },
    startUtc: { type: Date, required: true },
    endUtc: { type: Date, required: true },
    title: { type: String },
    description: { type: String },
  },
  { timestamps: true }
)

EventSchema.index({ startUtc: 1 })
EventSchema.index({ endUtc: 1 })

export default mongoose.model('Event', EventSchema)
