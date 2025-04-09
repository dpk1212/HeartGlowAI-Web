#!/bin/bash

# ===================================================
# HeartGlow AI Dashboard - GitHub Pages Deployment
# ===================================================

# Text formatting
bold=$(tput bold)
red=$(tput setaf 1)
green=$(tput setaf 2)
yellow=$(tput setaf 3)
blue=$(tput setaf 4)
purple=$(tput setaf 5)
reset=$(tput sgr0)

echo "${bold}${purple}========== HeartGlow AI Dashboard - GitHub Pages Deployment ==========${reset}"
echo "This script will deploy the dashboard to GitHub Pages at /dashboard without affecting the main site"

# Ensure proper GitLab Pages structure is maintained
if [ ! -d "dashboard" ]; then
  mkdir -p dashboard
  echo "${bold}${yellow}Created dashboard directory for GitHub Pages deployment${reset}"
fi

# Safety checks
echo "${bold}${blue}🔍 Performing safety checks...${reset}"

# Check if index.html exists (possible main site file)
if [ -f "index.html" ]; then
  echo "${bold}${yellow}⚠️ Main site index.html found. This script is for dashboard deployment only.${reset}"
  echo "${bold}${yellow}⚠️ Changes to the main site should be deployed separately.${reset}"
  read -p "Do you want to continue with dashboard deployment? (y/n): " confirm
  if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
    echo "${bold}${red}❌ Deployment cancelled.${reset}"
    exit 1
  fi
fi

# Check current branch
echo "${bold}${blue}🔍 Checking current branch...${reset}"
current_branch=$(git symbolic-ref --short HEAD)
if [ "$current_branch" != "gh-pages" ]; then
  echo "${bold}${yellow}⚠️ You are not on the gh-pages branch. Switching to gh-pages branch...${reset}"
  git checkout gh-pages || {
    echo "${bold}${red}❌ Failed to switch to gh-pages branch. Aborting.${reset}"
    exit 1
  }
fi

# Navigate to dashboard directory for building
echo "${bold}${blue}📂 Navigating to dashboard directory...${reset}"
cd heartglow-dashboard || {
  echo "${bold}${red}❌ Failed to navigate to heartglow-dashboard directory. Aborting.${reset}"
  exit 1
}

# Build the dashboard
echo "${bold}${blue}🔨 Building the dashboard...${reset}"
npm run export || {
  echo "${bold}${red}❌ Failed to build the dashboard. Aborting.${reset}"
  exit 1
}

# Navigate back to the root
echo "${bold}${blue}📂 Returning to main repository...${reset}"
cd ..

# Check if build was successful
if [ ! -d "heartglow-dashboard/out" ]; then
  echo "${bold}${red}❌ Build output directory not found. Aborting.${reset}"
  exit 1
fi

# Prepare dashboard directory
echo "${bold}${blue}🧹 Preparing dashboard directory...${reset}"
if [ -d "dashboard" ]; then
  # Create a temporary backup of certain files we don't want to lose (if they exist)
  if [ -f "dashboard/.nojekyll" ]; then
    cp dashboard/.nojekyll .nojekyll.tmp
  fi
  
  # Clean directory but preserve git history
  rm -rf dashboard/*
else
  mkdir -p dashboard
fi

# Copy build files to dashboard directory
echo "${bold}${blue}📋 Copying build files to dashboard directory...${reset}"
cp -r heartglow-dashboard/out/* dashboard/

# Create .nojekyll file to prevent Jekyll processing
echo "${bold}${blue}📝 Creating .nojekyll file in root and dashboard directory...${reset}"
touch .nojekyll
touch dashboard/.nojekyll

# Restore any temporarily backed up files
if [ -f ".nojekyll.tmp" ]; then
  mv .nojekyll.tmp dashboard/.nojekyll
fi

# Create a simple redirect from root dashboard to dashboard/
echo "${bold}${blue}📝 Creating dashboard redirect...${reset}"
cat > dashboard-redirect.html << EOF
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="refresh" content="0;url=/dashboard/">
  <title>Redirecting to Dashboard</title>
</head>
<body>
  <p>Redirecting to dashboard...</p>
  <script>
    window.location.href = "/dashboard/";
  </script>
</body>
</html>
EOF

# Add all files to git
echo "${bold}${blue}📝 Adding dashboard files to git...${reset}"
git add dashboard/ .nojekyll dashboard-redirect.html

# Commit changes
echo "${bold}${blue}💾 Committing changes...${reset}"
git commit -m "Deploy HeartGlow AI Dashboard to /dashboard"

# Push to GitHub
echo "${bold}${blue}🚀 Pushing to GitHub Pages (gh-pages branch)...${reset}"
git push origin gh-pages

# Success message
echo "${bold}${green}✅ Deployment complete! The dashboard should be available at: heartglowai.com/dashboard/${reset}"
echo "${bold}${green}✅ The main landing page remains unaffected.${reset}"
echo "NOTE: It may take a few minutes for GitHub Pages to update." 