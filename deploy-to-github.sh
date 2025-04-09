#!/bin/bash
set -e

echo "========== HeartGlow AI Dashboard - GitHub Pages Deployment =========="
echo "This script will deploy the dashboard to GitHub Pages at /dashboard without affecting the main site"

# Step 1: Make sure we're on the gh-pages branch
echo "🔍 Checking current branch..."
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "gh-pages" ]; then
  echo "⚠️ Currently on branch $CURRENT_BRANCH, switching to gh-pages..."
  git checkout gh-pages
fi

# Step 2: Navigate to dashboard directory and build
echo "📂 Navigating to dashboard directory..."
cd heartglow-dashboard

# Step 3: Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  npm install
fi

# Step 4: Build the dashboard
echo "🔨 Building the dashboard..."
npm run export

# Step 5: Return to parent directory
echo "📂 Returning to main repository..."
cd ..

# Step 6: Create or clean the dashboard directory
echo "🧹 Preparing dashboard directory..."
if [ -d "dashboard" ]; then
  rm -rf dashboard
fi
mkdir -p dashboard

# Step 7: Copy the build files to the dashboard directory
echo "📋 Copying build files to dashboard directory..."
cp -r heartglow-dashboard/out/* dashboard/

# Step 8: Create a simple .nojekyll file to prevent Jekyll processing
echo "📝 Creating .nojekyll file in root and dashboard directory..."
touch .nojekyll
touch dashboard/.nojekyll

# Step 9: Add dashboard files to git
echo "📝 Adding dashboard files to git..."
git add dashboard
git add .nojekyll

# Step 10: Commit the changes
echo "💾 Committing changes..."
git commit -m "Deploy HeartGlow AI Dashboard to /dashboard"

# Step 11: Push to GitHub
echo "🚀 Pushing to GitHub Pages (gh-pages branch)..."
git push origin gh-pages

echo "✅ Deployment complete! The dashboard should be available at: heartglowai.com/dashboard/"
echo "✅ The main landing page remains unaffected."
echo "NOTE: It may take a few minutes for GitHub Pages to update." 