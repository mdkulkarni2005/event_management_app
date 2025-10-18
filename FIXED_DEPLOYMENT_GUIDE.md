# ✅ FIXED Deployment Guide - Monorepo Setup

## The Problem
You have a **monorepo** (one Git repository with multiple projects: `backend/` and `frontend/`).
Vercel needs to deploy them as **two separate projects**, each pointing to the correct folder.

---

## 🎯 Solution: Deploy Two Separate Vercel Projects

### **Step 1: Deploy Backend**

1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select your repository: `mdkulkarni2005/event_management_app`
4. **IMPORTANT**: Configure project settings:
   - **Project Name**: `event-management-backend` (or any name)
   - **Root Directory**: `backend` ← **Click "Edit" and select this!**
   - **Framework Preset**: Other
   - **Build Command**: Leave empty (Vercel auto-detects)
   - **Output Directory**: Leave empty
5. Click **"Environment Variables"** section:
   - Add variable:
     - **Name**: `MONGODB_URI`
     - **Value**: `mongodb+srv://kedarmanas171_db_user:Dxw3ouo1KV5tOxMI@cluster0.07xptlx.mongodb.net/event_management_app?retryWrites=true&w=majority`
     - **Environments**: ✅ Production ✅ Preview ✅ Development
6. Click **Deploy**
7. Wait for deployment to complete
8. **Copy your backend URL** (e.g., `https://event-management-backend.vercel.app`)

---

### **Step 2: Deploy Frontend**

1. Go to https://vercel.com/new again
2. Click "Import Git Repository"
3. Select **the same repository**: `mdkulkarni2005/event_management_app`
4. **IMPORTANT**: Configure project settings:
   - **Project Name**: `event-management-frontend` (or any name)
   - **Root Directory**: `frontend` ← **Click "Edit" and select this!**
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. Click **"Environment Variables"** section:
   - Add variable:
     - **Name**: `VITE_API_BASE_URL`
     - **Value**: Your backend URL from Step 1 (e.g., `https://event-management-backend.vercel.app`)
     - **Environments**: ✅ Production ✅ Preview ✅ Development
6. Click **Deploy**
7. Wait for deployment
8. Visit your frontend URL!

---

## 🔧 MongoDB Atlas Configuration

**CRITICAL**: Allow Vercel to connect to MongoDB:

1. Go to https://cloud.mongodb.com/
2. Select your cluster → **Network Access** (left sidebar)
3. Click **"+ ADD IP ADDRESS"**
4. Select **"ALLOW ACCESS FROM ANYWHERE"**
   - IP Address: `0.0.0.0/0`
5. Click **Confirm**

⚠️ *For production, you should whitelist specific Vercel IP ranges instead*

---

## ✅ Verification Steps

### Test Backend
```bash
# Health check
curl https://your-backend-url.vercel.app/api/health

# Expected response:
{"ok":true,"time":"2025-10-18T..."}

# Get profiles
curl https://your-backend-url.vercel.app/api/profiles

# Expected response:
[]  # or your profiles array
```

### Test Frontend
1. Open your frontend URL in browser
2. Open DevTools (F12) → Console tab
3. Look for any errors
4. Check Network tab to verify API calls are going to your backend

---

## 🚨 Common Issues

### Issue: "DEPLOYMENT_NOT_FOUND"
**Cause**: You haven't created the deployment yet, OR you're trying to use CLI without linking the project
**Fix**: Use the dashboard method above (much simpler!)

### Issue: Backend returns 500 or times out
**Cause**: MongoDB connection failing
**Fix**: 
- Verify `MONGODB_URI` is set correctly in Vercel dashboard
- Check MongoDB Network Access allows 0.0.0.0/0
- Check deployment logs for connection errors

### Issue: Frontend can't reach backend (CORS errors)
**Cause**: `VITE_API_BASE_URL` not set or incorrect
**Fix**: 
- Go to frontend project → Settings → Environment Variables
- Verify `VITE_API_BASE_URL` matches your backend URL exactly
- Redeploy frontend after fixing

### Issue: Changes not reflected after git push
**Cause**: Vercel auto-deploy might be disabled
**Fix**: 
- Go to project → Settings → Git
- Ensure "Automatic Deployments" is enabled
- Or manually trigger: Deployments tab → click "..." → Redeploy

---

## 📝 Why This Approach?

**Monorepo Best Practice**:
- ✅ One Git repository
- ✅ Two Vercel projects (each with different root directory)
- ✅ Each project has its own environment variables
- ✅ Independent deployment and scaling
- ✅ Separate URLs for frontend and backend

**Alternative** (Not recommended for beginners):
- Use Vercel CLI with `--cwd` flag to specify directory
- Requires `.vercel` folder for project linking
- More complex to set up and maintain

---

## 🎓 Next Steps After Deployment

1. **Test all functionality**: Create profiles, add events, verify timezone conversions
2. **Set up custom domains** (optional): Vercel Settings → Domains
3. **Monitor logs**: Vercel dashboard → Your project → Logs (Real-time function logs)
4. **Set up production security**:
   - Restrict MongoDB network access to Vercel IPs only
   - Add rate limiting to backend
   - Set up CORS to only allow your frontend domain
5. **Configure redirects** (if needed): Add to `vercel.json`

---

## 🔗 Quick Links

- **Vercel Dashboard**: https://vercel.com/dashboard
- **MongoDB Atlas**: https://cloud.mongodb.com/
- **Your Repository**: https://github.com/mdkulkarni2005/event_management_app
- **Vercel Monorepo Docs**: https://vercel.com/docs/monorepos

---

**Need help?** Check deployment logs in Vercel dashboard for detailed error messages!
