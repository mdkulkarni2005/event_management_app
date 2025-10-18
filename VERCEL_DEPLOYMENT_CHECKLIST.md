# Vercel Deployment Checklist

## Current Status
If you're still seeing a 404 error, follow these steps carefully:

## Backend Deployment

### Step 1: Verify Files Are Committed
```bash
cd /Users/manaskulkarni/event_management_app
git status
git add .
git commit -m "Fix Vercel serverless configuration"
git push origin main
```

### Step 2: Redeploy on Vercel
1. Go to https://vercel.com/dashboard
2. Find your **backend** project
3. Click on it
4. Go to "Deployments" tab
5. Click the three dots (...) on the latest deployment
6. Click "Redeploy"

### Step 3: Set Environment Variables (CRITICAL!)
1. In your backend project on Vercel
2. Go to **Settings** → **Environment Variables**
3. Add this variable:
   - **Name**: `MONGODB_URI`
   - **Value**: `mongodb+srv://kedarmanas171_db_user:Dxw3ouo1KV5tOxMI@cluster0.07xptlx.mongodb.net/event_management_app?retryWrites=true&w=majority`
   - **Environment**: Production, Preview, Development (select all)
4. Click **Save**
5. **IMPORTANT**: After adding env vars, you MUST redeploy (see Step 2)

### Step 4: Verify Backend Deployment
Once deployed, test these endpoints:

**Health Check**:
```
https://your-backend-url.vercel.app/api/health
```
Should return: `{"ok":true,"time":"..."}`

**Get Profiles**:
```
https://your-backend-url.vercel.app/api/profiles
```
Should return: `[]` or your profiles array

## Frontend Deployment

### Step 1: Set Environment Variable
1. In your **frontend** project on Vercel
2. Go to **Settings** → **Environment Variables**
3. Add this variable:
   - **Name**: `VITE_API_BASE_URL`
   - **Value**: `https://your-backend-url.vercel.app` (use your actual backend URL)
   - **Environment**: Production, Preview, Development (select all)
4. Click **Save**
5. Redeploy the frontend

### Step 2: Verify Frontend
Visit your frontend URL and check:
- Browser console for any errors
- Network tab to see if API calls are going to the right backend URL

## Common Issues & Solutions

### Still Getting 404?
1. **Check the deployment logs**:
   - Go to Vercel dashboard → Your backend project → Deployments
   - Click on the latest deployment
   - Check the "Build Logs" and "Function Logs"
   - Look for any error messages

2. **Verify the build succeeded**:
   - The deployment should show "Ready" status
   - Build logs should show "Build Completed"

3. **Check the function route**:
   - In deployment details, click "Functions" tab
   - You should see `index.js` listed
   - Route should be `/*` or `/(.*)`

### MongoDB Connection Issues?
1. **Whitelist Vercel IPs in MongoDB Atlas**:
   - Go to MongoDB Atlas dashboard
   - Network Access → Add IP Address
   - Select "Allow Access from Anywhere" (0.0.0.0/0)
   - Or add Vercel's IP ranges

2. **Verify connection string**:
   - Make sure the MONGODB_URI in Vercel matches exactly
   - Check for typos in username/password
   - Ensure database name is correct

### Function Timeout?
If you see timeout errors:
- MongoDB connection might be slow on cold starts
- This is normal for serverless - first request may take 5-10 seconds
- Subsequent requests should be faster

## Test Commands

After deployment, test with curl:

```bash
# Health check
curl https://your-backend-url.vercel.app/api/health

# Get profiles
curl https://your-backend-url.vercel.app/api/profiles

# Create a profile
curl -X POST https://your-backend-url.vercel.app/api/profiles \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","timezone":"America/New_York"}'
```

## Quick Debug

If nothing works:
1. Check Vercel deployment logs for errors
2. Verify `index.js` exists in root of backend folder
3. Verify `vercel.json` points to `index.js`
4. Ensure environment variables are set
5. Check MongoDB Atlas network access allows Vercel IPs
6. Try redeploying from scratch (delete and re-import from GitHub)
