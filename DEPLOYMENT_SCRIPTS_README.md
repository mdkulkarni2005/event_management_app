# 🚀 Quick Deployment Scripts

I've created automated scripts to help you deploy to Vercel!

## 📋 Available Scripts

### Option 1: Complete Automated Deployment (RECOMMENDED)
```bash
./deploy-all.sh
```
This script will:
- ✅ Walk you through Vercel login
- ✅ Deploy backend
- ✅ Deploy frontend
- ✅ Guide you through setting environment variables
- ✅ Test the deployment

### Option 2: Deploy Individual Components

**Deploy Backend Only:**
```bash
./deploy-backend.sh
```

**Deploy Frontend Only:**
```bash
./deploy-frontend.sh
```

**Configure MongoDB Access:**
```bash
./setup-mongodb.sh
```

## 🎯 Step-by-Step Instructions

### Before You Start

1. **Ensure you have a Vercel account**: https://vercel.com/signup
2. **MongoDB Atlas configured**: Run `./setup-mongodb.sh` for instructions

### Deploy Everything

```bash
# 1. Run the complete deployment script
./deploy-all.sh

# 2. Follow the prompts - the script will guide you through:
#    - Logging into Vercel (browser will open)
#    - Deploying backend
#    - Setting environment variables
#    - Testing backend
#    - Deploying frontend
```

### Manual Alternative (If Scripts Don't Work)

If you prefer to do it manually or scripts have issues:

1. **Login to Vercel:**
   ```bash
   vercel login
   ```

2. **Deploy Backend:**
   ```bash
   cd backend
   vercel --prod
   # Copy the deployment URL
   cd ..
   ```

3. **Set Backend Environment Variables:**
   - Go to https://vercel.com/dashboard
   - Click your backend project
   - Settings → Environment Variables
   - Add: `MONGODB_URI` with your connection string
   - Redeploy

4. **Deploy Frontend:**
   ```bash
   cd frontend
   vercel --prod -e VITE_API_BASE_URL="https://your-backend-url.vercel.app"
   cd ..
   ```

## 🔧 Environment Variables Reference

### Backend (.env)
```bash
MONGODB_URI=mongodb+srv://kedarmanas171_db_user:Dxw3ouo1KV5tOxMI@cluster0.07xptlx.mongodb.net/event_management_app?retryWrites=true&w=majority
```

### Frontend (.env)
```bash
VITE_API_BASE_URL=https://your-backend-url.vercel.app
```

## ✅ Verification

After deployment, test your app:

**Test Backend:**
```bash
curl https://your-backend-url.vercel.app/api/health
```
Expected: `{"ok":true,"time":"..."}`

**Test Frontend:**
- Visit your frontend URL
- Open DevTools (F12) → Console
- Create a test profile
- Create a test event
- Verify timezone conversions work

## 🐛 Troubleshooting

### "DEPLOYMENT_NOT_FOUND" Error
- **Cause**: Project not created in Vercel yet
- **Fix**: Use the scripts above, they handle this automatically

### Backend returns 500 error
- **Check**: MongoDB environment variable set correctly in Vercel dashboard
- **Check**: MongoDB Network Access allows 0.0.0.0/0
- **Check**: Deployment logs in Vercel dashboard

### Frontend can't reach backend
- **Check**: `VITE_API_BASE_URL` environment variable in frontend project
- **Check**: No CORS errors in browser console
- **Fix**: Redeploy frontend with correct backend URL

### MongoDB connection timeout
- **Check**: Network Access in MongoDB Atlas allows connections from anywhere
- **Run**: `./setup-mongodb.sh` for detailed instructions

## 📚 Additional Resources

- [FIXED_DEPLOYMENT_GUIDE.md](./FIXED_DEPLOYMENT_GUIDE.md) - Detailed deployment guide
- [VERCEL_DEPLOYMENT_CHECKLIST.md](./VERCEL_DEPLOYMENT_CHECKLIST.md) - Checklist
- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)

## 🆘 Need Help?

If you encounter issues:
1. Check deployment logs in Vercel dashboard
2. Review browser console for errors
3. Verify environment variables are set correctly
4. Ensure MongoDB Network Access is configured

---

**Ready to deploy? Run `./deploy-all.sh` and follow the prompts! 🚀**
