#!/bin/bash

# ===================================================
# HeartGlow AI - Safe Deployment Manager
# ===================================================
# This script provides a safe, guided approach to deploying
# both the main site and the dashboard while preventing conflicts

# Text formatting for better readability
bold=$(tput bold)
red=$(tput setaf 1)
green=$(tput setaf 2)
yellow=$(tput setaf 3)
blue=$(tput setaf 4)
purple=$(tput setaf 5)
reset=$(tput sgr0)

# Banner
echo "${bold}${purple}========================================================"
echo "      HeartGlow AI - Safe Deployment Manager"
echo "========================================================${reset}"

# Function to check git status
check_git_status() {
  if [ -n "$(git status --porcelain)" ]; then
    echo "${bold}${yellow}⚠️  Warning: You have uncommitted changes.${reset}"
    git status
    read -p "Do you want to continue anyway? (y/n): " confirm
    if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
      echo "${bold}${red}❌ Deployment cancelled.${reset}"
      exit 1
    fi
  else
    echo "${bold}${green}✅ Working directory is clean.${reset}"
  fi
}

# Function to backup current state
backup_current_state() {
  local branch_name="backup-$(date +%Y%m%d%H%M%S)"
  echo "${bold}${blue}📦 Creating backup branch: ${branch_name}...${reset}"
  git checkout -b $branch_name
  git add .
  git commit -m "Automatic backup before deployment"
  git checkout -
  echo "${bold}${green}✅ Backup created as branch: ${branch_name}${reset}"
}

# Function to deploy dashboard safely
deploy_dashboard() {
  echo "${bold}${blue}🔄 Preparing to deploy dashboard only...${reset}"

  # Make sure main branch has latest deployment script
  echo "${bold}${blue}🔍 Checking for the latest deployment script...${reset}"
  git checkout main
  
  if [ ! -f "deploy-to-github.sh" ]; then
    echo "${bold}${red}❌ Deployment script not found in main branch!${reset}"
    echo "Please restore the deployment script first."
    exit 1
  fi
  
  # Execute the dashboard deployment script
  echo "${bold}${blue}🚀 Executing dashboard deployment script...${reset}"
  chmod +x deploy-to-github.sh
  ./deploy-to-github.sh
  
  # Verify the deployment
  echo "${bold}${blue}🔍 Verifying deployment...${reset}"
  git checkout gh-pages
  
  if [ ! -d "dashboard" ] || [ ! -f "dashboard/index.html" ]; then
    echo "${bold}${red}❌ Dashboard deployment verification failed!${reset}"
    echo "Dashboard directory or index.html is missing."
    echo "Rolling back to previous state..."
    git reset --hard HEAD@{1}
    echo "${bold}${yellow}⚠️ Rolled back to previous state.${reset}"
    exit 1
  else
    echo "${bold}${green}✅ Dashboard deployment verified successfully!${reset}"
  fi
  
  # Return to main branch
  git checkout main
}

# Function to deploy the entire site
deploy_entire_site() {
  echo "${bold}${yellow}⚠️ CAUTION: This will deploy the entire site, including the main landing page.${reset}"
  echo "${bold}${yellow}⚠️ This operation will overwrite everything on gh-pages.${reset}"
  
  read -p "Are you ABSOLUTELY sure you want to continue? (yes/no): " confirm
  if [[ "$confirm" != "yes" ]]; then
    echo "${bold}${red}❌ Full site deployment cancelled.${reset}"
    exit 1
  fi
  
  # Create a backup point
  backup_current_state
  
  # Deploy the entire site
  echo "${bold}${blue}🚀 Deploying the entire site to gh-pages...${reset}"
  
  # Save current branch
  CURRENT_BRANCH=$(git symbolic-ref --short HEAD)
  
  # Create/update gh-pages branch
  git checkout gh-pages || git checkout -b gh-pages
  
  # Merge from main
  git merge main -m "Full site deployment"
  
  # Push to GitHub
  git push origin gh-pages --force
  
  # Return to original branch
  git checkout $CURRENT_BRANCH
  
  echo "${bold}${green}✅ Full site deployment complete!${reset}"
}

# Function to restore from a stable point
restore_stable_deployment() {
  echo "${bold}${blue}🔄 Preparing to restore from a stable deployment...${reset}"
  
  # Fetch all branches to make sure we have the latest
  git fetch --all
  
  # List available branches for restoration
  echo "${bold}${blue}📋 Available branches for restoration:${reset}"
  git branch -a | grep -E 'stable|backup|restore'
  
  # Ask for the branch to restore from
  read -p "Enter the branch name to restore from (e.g., stable-dashboard-deployment): " restore_branch
  
  # Check if branch exists
  if ! git show-ref --verify --quiet refs/heads/$restore_branch && \
     ! git show-ref --verify --quiet refs/remotes/origin/$restore_branch; then
    echo "${bold}${red}❌ Branch '$restore_branch' not found!${reset}"
    exit 1
  fi
  
  echo "${bold}${yellow}⚠️ This will restore the gh-pages branch from '$restore_branch'.${reset}"
  read -p "Confirm restoration? (y/n): " confirm
  if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
    echo "${bold}${red}❌ Restoration cancelled.${reset}"
    exit 1
  fi
  
  # Create a backup of current gh-pages
  echo "${bold}${blue}📦 Creating backup of current gh-pages...${reset}"
  git checkout gh-pages
  git checkout -b gh-pages-backup-$(date +%Y%m%d%H%M%S)
  
  # Force gh-pages to match the stable branch
  git checkout $restore_branch
  git push -f origin $restore_branch:gh-pages
  
  echo "${bold}${green}✅ Successfully restored gh-pages from $restore_branch!${reset}"
  
  # Return to main branch
  git checkout main
}

# Main menu
echo "${bold}${blue}Please select an option:${reset}"
echo "1. ${bold}Deploy dashboard only${reset} (safe, preserves main site)"
echo "2. ${bold}Deploy entire site${reset} (caution: overwrites everything)"
echo "3. ${bold}Restore from stable deployment${reset} (recover from issues)"
echo "4. ${bold}Exit${reset}"

read -p "Enter your choice (1-4): " choice

case $choice in
  1)
    echo "${bold}${blue}Starting safe dashboard deployment...${reset}"
    check_git_status
    backup_current_state
    deploy_dashboard
    ;;
  2)
    echo "${bold}${yellow}Starting full site deployment...${reset}"
    check_git_status
    deploy_entire_site
    ;;
  3)
    echo "${bold}${blue}Starting restoration process...${reset}"
    restore_stable_deployment
    ;;
  4)
    echo "${bold}${green}Exiting without changes.${reset}"
    exit 0
    ;;
  *)
    echo "${bold}${red}Invalid option. Exiting.${reset}"
    exit 1
    ;;
esac

echo "${bold}${green}✅ Operation completed successfully!${reset}"
echo "${bold}${purple}Remember to verify your changes on the live site.${reset}" 