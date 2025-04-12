#!/bin/bash

# Script to consolidate dashboard folders and streamline deployment

# Exit on error
set -e

echo "💡 Starting dashboard consolidation process..."

# 1. Ensure the enhanced fix-path.js is in the source
echo "👉 Making sure enhanced fix-path.js is in source..."
if [ -f dashboard/fix-path.js ]; then
  cp dashboard/fix-path.js heartglow-dashboard/public/fix-path.js
  echo "✅ Enhanced fix-path.js copied to source"
else
  echo "⚠️ Warning: Enhanced fix-path.js not found in dashboard/"
fi

# 2. Backup the dashboard-backup folder if needed
echo "👉 Checking for unique files in dashboard-backup..."
mkdir -p _dashboard-archive
if [ -d dashboard-backup ]; then
  cp -r dashboard-backup/* _dashboard-archive/
  echo "✅ Backed up dashboard-backup to _dashboard-archive"
fi

# 3. Backup the dashboard folder
echo "👉 Backing up current dashboard folder..."
if [ -d dashboard ]; then
  cp -r dashboard/* _dashboard-archive/
  echo "✅ Backed up dashboard to _dashboard-archive"
fi

# 4. Make sure our GitHub workflow is updated
echo "👉 Adding modified files to git..."
git add .github/workflows/deploy-all.yml heartglow-dashboard/src/pages/_document.tsx heartglow-dashboard/public/fix-path.js

# 5. Commit changes
echo "👉 Committing changes..."
git commit -m "Consolidate dashboard structure: Integrate enhanced fix-path.js and simplify deployment" || echo "No changes to commit"

echo "✅ Consolidation complete! Push changes to trigger the simplified deployment workflow."
echo "❗ After successful deployment, you can safely remove the backup folders." 