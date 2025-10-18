#!/bin/bash

# Deploy Frontend to Vercel
# This script will deploy the frontend folder to Vercel

echo "======================================"
echo "🚀 Deploying Frontend to Vercel"
echo "======================================"
echo ""

# Navigate to frontend directory
cd "$(dirname "$0")/frontend"

echo "📁 Current directory: $(pwd)"
echo ""

# Check if user is logged in
echo "🔐 Checking Vercel authentication..."
if ! vercel whoami &> /dev/null; then
    echo ""
    echo "⚠️  You are not logged into Vercel!"
    echo "Please run: vercel login"
    echo ""
    read -p "Press Enter after you've logged in..."
fi

echo ""
echo "⚠️  REQUIRED: Enter your backend URL"
echo "   (e.g., https://your-backend.vercel.app)"
echo ""
read -p "Backend URL: " BACKEND_URL

if [ -z "$BACKEND_URL" ]; then
    echo "❌ Backend URL is required!"
    exit 1
fi

echo ""
echo "📦 Deploying frontend..."
echo ""
echo "⚙️  Configuration:"
echo "   - Root Directory: frontend/"
echo "   - Framework: Vite"
echo "   - Backend API: $BACKEND_URL"
echo ""
echo "Starting deployment..."
echo ""

# Deploy to Vercel (production) with environment variable
vercel --prod -e VITE_API_BASE_URL="$BACKEND_URL"

echo ""
echo "✅ Frontend deployment initiated!"
echo ""
echo "📝 Verification steps:"
echo "1. Visit your frontend URL (shown above)"
echo "2. Open browser DevTools (F12) → Console"
echo "3. Check for any errors"
echo "4. Try creating a profile to test the connection"
echo ""
