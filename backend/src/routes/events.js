import { Router } from 'express'
import Event from '../models/Event.js'

const router = Router()

router.get('/', async (req, res, next) => {
  try {
    const { profileId } = req.query
    const filter = profileId ? { profileIds: profileId } : {}
    const list = await Event.find(filter).sort({ startUtc: -1 })
    res.json(list)
  } catch (e) {
    next(e)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const { profileIds, timezone, startUtc, endUtc, title, description } = req.body
    if (!Array.isArray(profileIds) || profileIds.length === 0) return res.status(400).json({ error: 'profileIds required' })
    if (!timezone) return res.status(400).json({ error: 'timezone required' })
    if (!startUtc || !endUtc) return res.status(400).json({ error: 'startUtc and endUtc required' })
    const s = new Date(startUtc)
    const e = new Date(endUtc)
    if (!(s instanceof Date) || isNaN(+s) || !(e instanceof Date) || isNaN(+e)) return res.status(400).json({ error: 'invalid dates' })
    if (e < s) return res.status(400).json({ error: 'end must be >= start' })
    const created = await Event.create({ profileIds, timezone, startUtc: s, endUtc: e, title, description })
    res.status(201).json(created)
  } catch (e) {
    next(e)
  }
})

router.patch('/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    const patch = req.body
    if (patch.startUtc && patch.endUtc) {
      const s = new Date(patch.startUtc)
      const e = new Date(patch.endUtc)
      if (e < s) return res.status(400).json({ error: 'end must be >= start' })
    }
    const updated = await Event.findByIdAndUpdate(id, patch, { new: true })
    if (!updated) return res.status(404).json({ error: 'not found' })
    res.json(updated)
  } catch (e) {
    next(e)
  }
})

router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    const deleted = await Event.findByIdAndDelete(id)
    if (!deleted) return res.status(404).json({ error: 'not found' })
    res.json({ ok: true })
  } catch (e) {
    next(e)
  }
})

export default router
