import { Router } from 'express'
import UserProfile from '../models/UserProfile.js'

const router = Router()

router.get('/', async (req, res, next) => {
  try {
    const list = await UserProfile.find().sort({ name: 1 })
    res.json(list)
  } catch (e) {
    next(e)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const { name, timezone = 'UTC' } = req.body
    if (!name || !name.trim()) return res.status(400).json({ error: 'name required' })
    const created = await UserProfile.create({ name: name.trim(), timezone })
    res.status(201).json(created)
  } catch (e) {
    if (e.code === 11000) return res.status(409).json({ error: 'profile name already exists' })
    next(e)
  }
})

export default router
