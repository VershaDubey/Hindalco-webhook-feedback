#!/bin/bash

echo "🚀 Preparing Hindalco Webhook for Render Deployment"

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📝 Initializing git repository..."
    git init
    git add .
    git commit -m "Initial commit: Hindalco webhook setup"
fi

# Check for uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo "📝 Committing latest changes..."
    git add .
    git commit -m "Update: Ready for Render deployment"
fi

echo "✅ Repository is ready for deployment!"
echo ""
echo "📋 Next Steps:"
echo "1. Push to GitHub: git remote add origin <your-repo-url> && git push -u origin main"
echo "2. Go to render.com and create new Web Service"
echo "3. Connect your GitHub repository"
echo "4. Add environment variables from RENDER-DEPLOYMENT.md"
echo "5. Deploy and test!"
echo ""
echo "🔗 Your webhook endpoints will be:"
echo "   Health: https://your-app.onrender.com/ping"
echo "   Hindalco: https://your-app.onrender.com/hindalco-webhook"