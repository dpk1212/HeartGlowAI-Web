#!/bin/bash
# update-gh-pages.sh - Simple script to update GitHub Pages branch

echo "🚀 HeartGlow AI GitHub Pages Updater"

# First, stash any changes to avoid conflicts
git stash

# Build the dashboard
echo "🔨 Building dashboard..."
cd heartglow-dashboard
npm run build || { echo "❌ Build failed"; exit 1; }
cd ..

# Switch to gh-pages branch
echo "🔄 Switching to gh-pages branch..."
git checkout gh-pages || { echo "❌ Failed to switch to gh-pages branch"; exit 1; }
git pull origin gh-pages

# Update dashboard directory
echo "📤 Updating dashboard files..."
# Remove old dashboard directory entirely
rm -rf dashboard
# Move the output directory to be the new dashboard directory
mv heartglow-dashboard/out dashboard || { echo "❌ Failed to move build output"; exit 1; }
# Ensure .nojekyll is present
touch dashboard/.nojekyll

# Commit and push changes
echo "💾 Committing and pushing changes..."
git add dashboard
git commit -m "Update dashboard - $(date '+%Y-%m-%d %H:%M')"
git push origin gh-pages

# Switch back to main branch
echo "⬅️ Returning to main branch..."
git checkout main
git stash pop

echo "✅ GitHub Pages updated successfully!"
echo "🌐 Your site should be live shortly at https://heartglowai.com/dashboard/" 