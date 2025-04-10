#!/bin/bash

# ===================================================
# HeartGlow AI Dashboard - Safe GitHub Pages Deployment
# ===================================================
# This script handles the building and deployment of the HeartGlow AI dashboard to GitHub Pages
# IMPORTANT: This script preserves the main landing page and only updates the /dashboard directory

echo "=== HeartGlow AI Dashboard - Safe GitHub Pages Deployment ==="
echo "This script will safely deploy the dashboard to the /dashboard subdirectory"
echo "The main landing page at the root will be preserved"

# Check if we're on the right branch
CURRENT_BRANCH=$(git symbolic-ref --short HEAD)
if [ "$CURRENT_BRANCH" != "main" ] && [ "$CURRENT_BRANCH" != "master" ]; then
  echo "⚠️ Warning: You're not on the main/master branch. Current branch: $CURRENT_BRANCH"
  read -p "Do you want to continue anyway? (y/n) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Deployment aborted."
    exit 1
  fi
fi

# Ensure gh-pages branch exists locally
echo "🔍 Checking for gh-pages branch..."
if ! git show-ref --verify --quiet refs/heads/gh-pages; then
  echo "📂 Creating local gh-pages branch from remote..."
  git fetch origin gh-pages:gh-pages || {
    echo "❌ Failed to fetch gh-pages branch. Creating new one..."
    git checkout --orphan gh-pages
    git reset --hard
    git commit --allow-empty -m "Initial gh-pages branch"
    git checkout "$CURRENT_BRANCH"
  }
fi

# Navigate to dashboard directory
echo "📂 Navigating to dashboard directory..."
cd heartglow-dashboard || {
  echo "❌ Failed to navigate to heartglow-dashboard directory. Aborting."
  exit 1
}

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Set up environment variables for GitHub Pages
echo "⚙️ Setting up environment variables for production..."
echo "NEXT_PUBLIC_BASE_PATH=/dashboard" > .env.production.local

# Build the Next.js app
echo "🔨 Building dashboard..."
npm run build

# Create a temporary directory for deployment
echo "📂 Preparing temporary deployment directory..."
cd ..
rm -rf temp_deploy
mkdir -p temp_deploy

# Clone only the gh-pages branch into the temp directory
echo "🔄 Cloning current gh-pages branch content..."
git worktree prune # Clean any leftover worktrees
git worktree add temp_deploy gh-pages

# Ensure the dashboard directory exists in the temporary deployment directory
echo "🔧 Preparing dashboard directory..."
mkdir -p temp_deploy/dashboard

# Clean dashboard directory but preserve all other content
echo "🧹 Cleaning only the dashboard directory..."
rm -rf temp_deploy/dashboard/*

# Create .nojekyll file to bypass Jekyll processing
echo "📝 Creating .nojekyll file..."
touch heartglow-dashboard/out/.nojekyll
touch temp_deploy/.nojekyll

# Copy the out directory contents to the dashboard subdirectory
echo "📋 Moving built files to dashboard directory only..."
cp -r heartglow-dashboard/out/* temp_deploy/dashboard/
cp heartglow-dashboard/out/.nojekyll temp_deploy/dashboard/

# Commit the changes from the temporary directory
echo "💾 Committing changes to gh-pages branch..."
cd temp_deploy
git add dashboard/ .nojekyll
git commit -m "Update HeartGlow AI Dashboard in /dashboard subdirectory"

# Push to GitHub Pages
echo "🚀 Pushing only dashboard updates to gh-pages branch..."
git push origin gh-pages

# Clean up
echo "🧹 Cleaning up..."
cd ..
git worktree remove temp_deploy
rm -rf temp_deploy

# Return to original branch
echo "⬅️ Returning to original branch..."
git checkout "$CURRENT_BRANCH"

echo "✅ Deployment complete! Your HeartGlow AI Dashboard is now available at:"
echo "✅ https://heartglowai.com/dashboard/"
echo "✅ The main landing page remains unaffected." 