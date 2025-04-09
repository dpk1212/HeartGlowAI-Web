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
echo "NEXT_PUBLIC_BASE_PATH=/ConnectlyAI" > .env.production.local

# Build the Next.js app
echo "Building dashboard..."
npm run build

# Export the app as static files
echo "Exporting static files..."
npm run export

# Clean or create gh-pages branch
echo "Preparing gh-pages branch..."
git checkout -b gh-pages-temp

# Create .nojekyll file to bypass Jekyll processing
echo "Creating .nojekyll file..."
touch out/.nojekyll

# Copy the out directory contents to the root
echo "Moving built files to root..."
cp -r out/* ../
cp out/.nojekyll ../

# Return to the main directory
cd ..

# Add all files to git
echo "Adding files to git..."
git add .

# Commit the changes
echo "Committing changes..."
git commit -m "Deploy HeartGlow AI Dashboard to GitHub Pages"

# Push to GitHub Pages
echo "Pushing to gh-pages branch..."
git push origin gh-pages-temp:gh-pages -f

# Return to original branch
echo "Returning to original branch..."
git checkout $CURRENT_BRANCH

# Clean up temporary branch
echo "Cleaning up..."
git branch -D gh-pages-temp

echo "Deployment complete! Your HeartGlow AI Dashboard is now available on GitHub Pages."
echo "Visit: https://$(git config --get remote.origin.url | sed -e 's/^git@github.com://' -e 's/.git$//' -e 's/:/\//' -e 's/^https:\/\/github.com\///')" 