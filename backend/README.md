# Backend API

Express + Mongoose API for profiles and events.

## Setup

1. Create `.env` from `.env.example` and set `MONGODB_URI`.
2. Install dependencies and run dev server.

## Endpoints
- GET /api/health
- GET /api/profiles
- POST /api/profiles { name, timezone? }
- GET /api/events?profileId=...
- POST /api/events { profileIds[], timezone, startUtc, endUtc, title?, description? }
- PATCH /api/events/:id
- DELETE /api/events/:id
