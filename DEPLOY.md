# Deployment Guide

## Prerequisites
- Vercel CLI installed: `npm i -g vercel`
- MongoDB Atlas cluster running

## Backend Deployment

1. Navigate to backend folder:
```bash
cd backend
```

2. Deploy to Vercel:
```bash
vercel
```

3. Set environment variables in Vercel dashboard or CLI:
```bash
vercel env add MONGODB_URI
# Paste: mongodb+srv://kedarmanas171_db_user:<PASSWORD>@cluster0.07xptlx.mongodb.net/event_management_app?retryWrites=true&w=majority

vercel env add PORT
# Enter: 4000
```

4. Redeploy with env vars:
```bash
vercel --prod
```

5. Note your backend URL (e.g., `https://your-backend.vercel.app`)

## Frontend Deployment

1. Navigate to frontend folder:
```bash
cd ../frontend
```

2. Set the API base URL environment variable:
```bash
vercel env add VITE_API_BASE_URL
# Paste your backend URL from step 5 above (e.g., https://your-backend.vercel.app)
```

3. Deploy frontend:
```bash
vercel
```

4. Deploy to production:
```bash
vercel --prod
```

## Quick Deploy (Alternative)

You can also use Vercel dashboard:

### Backend:
1. Go to https://vercel.com/new
2. Import your Git repository
3. Set Root Directory to `backend`
4. Add Environment Variables:
   - `MONGODB_URI`: your full MongoDB connection string
   - `PORT`: 4000
5. Deploy

### Frontend:
1. Create a new project in Vercel
2. Import same Git repository
3. Set Root Directory to `frontend`
4. Framework Preset: Vite
5. Add Environment Variable:
   - `VITE_API_BASE_URL`: your backend URL
6. Deploy

## Local Testing

### Backend:
```bash
cd backend
npm run dev
# Server runs on http://localhost:4000
```

### Frontend:
```bash
cd frontend
npm run dev
# App runs on http://localhost:5173
```

## Notes

- Backend uses serverless functions on Vercel
- MongoDB connection string must include database name (`event_management_app`)
- Frontend calls backend via `VITE_API_BASE_URL` environment variable
- CORS is enabled on backend for all origins (configure in `src/app.js` if needed)
