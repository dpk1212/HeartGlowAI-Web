#!/bin/bash

# Exit on error
set -e

# Display commands
set -x

# Clean and prepare
rm -rf out
rm -rf .next

# Build with timestamp for cache busting
NEXT_PUBLIC_BUILD_TIMESTAMP=$(date +%s) npm run build

# Ensure .nojekyll exists
touch out/.nojekyll

# Make sure we're on gh-pages branch
current_branch=$(git rev-parse --abbrev-ref HEAD)
if [ "$current_branch" != "gh-pages" ]; then
    echo "Error: Not on gh-pages branch. Please switch to gh-pages branch first."
    exit 1
fi

# Add all files from 'out' directory to git
git add -f out/

# Commit with timestamp
git commit -m "Deploy: $(date)"

# Force push the subtree to gh-pages
git push origin `git subtree split --prefix out gh-pages`:gh-pages --force

echo "Deployed successfully!" 