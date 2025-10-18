#!/bin/bash

# Deploy Backend to Vercel
# This script will deploy the backend folder to Vercel

echo "======================================"
echo "🚀 Deploying Backend to Vercel"
echo "======================================"
echo ""

# Navigate to backend directory
cd "$(dirname "$0")/backend"

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
echo "📦 Deploying backend..."
echo ""
echo "⚙️  Configuration:"
echo "   - Root Directory: backend/"
echo "   - Framework: Node.js"
echo "   - Entry Point: index.js"
echo ""
echo "⚠️  IMPORTANT: After deployment, set these environment variables in Vercel dashboard:"
echo "   1. Go to your project settings"
echo "   2. Add environment variable:"
echo "      Name: MONGODB_URI"
echo "      Value: mongodb+srv://kedarmanas171_db_user:Dxw3ouo1KV5tOxMI@cluster0.07xptlx.mongodb.net/event_management_app?retryWrites=true&w=majority"
echo ""
echo "Starting deployment..."
echo ""

# Deploy to Vercel (production)
vercel --prod

echo ""
echo "✅ Backend deployment initiated!"
echo ""
echo "📝 Next steps:"
echo "1. Copy the deployment URL from above"
echo "2. Go to Vercel dashboard → Your backend project → Settings → Environment Variables"
echo "3. Add MONGODB_URI with your MongoDB connection string"
echo "4. Redeploy for env vars to take effect"
echo ""
