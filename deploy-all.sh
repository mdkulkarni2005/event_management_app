#!/bin/bash

# Complete Deployment Guide
# Run this script to deploy both backend and frontend

echo "╔════════════════════════════════════════════════════════╗"
echo "║   Event Management App - Vercel Deployment Guide      ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# Step 1: Login
echo "📋 STEP 1: Vercel Login"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "First, you need to login to Vercel."
echo ""
read -p "Press Enter to open Vercel login (will open in browser)..."
vercel login
echo ""

# Wait for confirmation
echo "✓ Login complete!"
echo ""
sleep 2

# Step 2: Deploy Backend
echo "📋 STEP 2: Deploy Backend"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Now deploying the backend..."
echo ""
read -p "Press Enter to start backend deployment..."
./deploy-backend.sh

# Save backend URL
echo ""
read -p "📝 Enter the backend URL you just got (e.g., https://xxx.vercel.app): " BACKEND_URL
echo ""

if [ -z "$BACKEND_URL" ]; then
    echo "❌ Backend URL is required to continue!"
    exit 1
fi

echo "✓ Backend URL saved: $BACKEND_URL"
echo ""
sleep 2

# Step 3: Set Environment Variables
echo "📋 STEP 3: Configure Backend Environment Variables"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "⚠️  CRITICAL: You must set environment variables in Vercel dashboard!"
echo ""
echo "Do this NOW:"
echo "1. Open: https://vercel.com/dashboard"
echo "2. Click on your backend project"
echo "3. Go to: Settings → Environment Variables"
echo "4. Add this variable:"
echo ""
echo "   Name: MONGODB_URI"
echo "   Value: mongodb+srv://kedarmanas171_db_user:Dxw3ouo1KV5tOxMI@cluster0.07xptlx.mongodb.net/event_management_app?retryWrites=true&w=majority"
echo "   Environments: ✓ Production ✓ Preview ✓ Development"
echo ""
echo "5. Click Save"
echo "6. Click the 'Redeploy' button (in Deployments tab)"
echo ""
read -p "Press Enter after you've set the environment variable and redeployed..."
echo ""
echo "✓ Environment variables configured!"
echo ""
sleep 2

# Step 4: Test Backend
echo "📋 STEP 4: Test Backend"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Testing backend health endpoint..."
echo ""
echo "Making request to: $BACKEND_URL/api/health"
echo ""

HEALTH_RESPONSE=$(curl -s "$BACKEND_URL/api/health")
echo "Response: $HEALTH_RESPONSE"
echo ""

if echo "$HEALTH_RESPONSE" | grep -q "\"ok\":true"; then
    echo "✅ Backend is working!"
else
    echo "⚠️  Backend might not be ready yet. Check deployment logs."
    echo "Continue anyway? (y/n)"
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi
echo ""
sleep 2

# Step 5: Deploy Frontend
echo "📋 STEP 5: Deploy Frontend"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Now deploying the frontend..."
echo ""
echo "The frontend will use this backend URL: $BACKEND_URL"
echo ""
read -p "Press Enter to start frontend deployment..."
echo ""

# Deploy frontend
cd frontend
vercel --prod -e VITE_API_BASE_URL="$BACKEND_URL"
cd ..

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 DEPLOYMENT COMPLETE!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ Backend deployed at: $BACKEND_URL"
echo "✅ Frontend deployed (see URL above)"
echo ""
echo "📝 Next steps:"
echo "1. Visit your frontend URL"
echo "2. Test creating a profile"
echo "3. Test creating an event"
echo "4. Check timezone conversions"
echo ""
echo "🔍 Troubleshooting:"
echo "- Check browser console (F12) for errors"
echo "- View Vercel logs: https://vercel.com/dashboard"
echo "- Verify MongoDB Network Access allows 0.0.0.0/0"
echo ""
echo "Happy deploying! 🚀"
echo ""
