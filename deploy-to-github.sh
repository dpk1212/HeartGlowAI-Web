#!/bin/bash

# HeartGlow AI Dashboard Deployment Script for GitHub Pages
# This script handles the building and deployment of the HeartGlow AI dashboard to GitHub Pages

echo "Starting HeartGlow AI Dashboard deployment to GitHub Pages..."

# Check if we're on the right branch
CURRENT_BRANCH=$(git symbolic-ref --short HEAD)
if [ "$CURRENT_BRANCH" != "main" ] && [ "$CURRENT_BRANCH" != "master" ]; then
  echo "Warning: You're not on the main/master branch. Current branch: $CURRENT_BRANCH"
  read -p "Do you want to continue anyway? (y/n) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Deployment aborted."
    exit 1
  fi
fi

# Navigate to the dashboard directory
cd heartglow-dashboard

# Install dependencies
echo "Installing dependencies..."
npm install

# Set up environment variables for GitHub Pages
echo "Setting up environment variables for production..."
echo "NEXT_PUBLIC_BASE_PATH=/dashboard" > .env.production.local

# Build the Next.js app
echo "Building dashboard..."
npm run build

# Export the app as static files
echo "Exporting static files..."
npm run export

# Fetch current gh-pages branch to a temporary directory
echo "Fetching current gh-pages branch..."
cd ..
git fetch origin gh-pages:gh-pages || true
mkdir -p temp_deploy
git worktree add temp_deploy gh-pages || git worktree add temp_deploy -b gh-pages

# Create dashboard directory in gh-pages if it doesn't exist
echo "Preparing dashboard directory..."
mkdir -p temp_deploy/dashboard

# Clean dashboard directory but preserve other content
echo "Cleaning dashboard directory..."
rm -rf temp_deploy/dashboard/*

# Create .nojekyll file to bypass Jekyll processing
echo "Creating .nojekyll file..."
touch heartglow-dashboard/out/.nojekyll
touch temp_deploy/.nojekyll

# Copy the out directory contents to the dashboard subdirectory
echo "Moving built files to dashboard directory..."
cp -r heartglow-dashboard/out/* temp_deploy/dashboard/
cp heartglow-dashboard/out/.nojekyll temp_deploy/dashboard/

# Create simple redirect from dashboard root to dashboard/index.html
echo "Creating dashboard redirect..."
cat > temp_deploy/dashboard/index.html << EOF
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="refresh" content="0;url=index.html">
  <title>HeartGlow AI Dashboard</title>
</head>
<body>
  <p>Redirecting to dashboard...</p>
</body>
</html>
EOF

# Commit and push the changes from the temporary directory
echo "Committing changes..."
cd temp_deploy
git add .
git commit -m "Deploy HeartGlow AI Dashboard to /dashboard subdirectory"

# Push to GitHub Pages
echo "Pushing to gh-pages branch..."
git push origin gh-pages

# Clean up
echo "Cleaning up..."
cd ..
git worktree remove temp_deploy
rm -rf temp_deploy

# Return to original branch
echo "Returning to original branch..."
git checkout $CURRENT_BRANCH

echo "Deployment complete! Your HeartGlow AI Dashboard is now available at:"
echo "https://heartglowai.com/dashboard/" 