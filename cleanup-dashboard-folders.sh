#!/bin/bash

# Script to clean up redundant dashboard folders after consolidation
# This should be run AFTER verifying the new deployment works correctly

# Exit on error
set -e

echo "💡 Starting dashboard cleanup process..."

# Verify _dashboard-archive exists as a safety check
if [ ! -d "_dashboard-archive" ]; then
  echo "❌ ERROR: _dashboard-archive not found! Aborting for safety."
  echo "    Run the consolidate-dashboard.sh script first to create backups."
  exit 1
fi

# Remove the original dashboard folder
if [ -d "dashboard" ]; then
  echo "👉 Removing dashboard folder..."
  rm -rf dashboard
  echo "✅ Removed dashboard folder"
else
  echo "ℹ️ dashboard folder already removed"
fi

# Remove the original dashboard-backup folder
if [ -d "dashboard-backup" ]; then
  echo "👉 Removing dashboard-backup folder..."
  rm -rf dashboard-backup
  echo "✅ Removed dashboard-backup folder"
else
  echo "ℹ️ dashboard-backup folder already removed"
fi

echo "✅ Cleanup complete! You now have a cleaner workspace."
echo "ℹ️ The backup of all files is still in _dashboard-archive if needed."
echo "ℹ️ The source code is in heartglow-dashboard and is being used for deployment." 