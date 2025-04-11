# HeartGlow AI Deployment Guide

## Overview

This guide explains the deployment process for HeartGlow AI, including how to safely deploy changes to both the main landing page and the dashboard without causing conflicts.

## Repository Structure

- `index.html` and associated files: Main landing page (deployed at root)
- `heartglow-dashboard/`: Next.js dashboard application code (source)
- `dashboard/`: Compiled dashboard files (deployed at /dashboard)
- `safe-deploy.sh`: Safe deployment script with multiple options
- `deploy-to-github.sh`: Lower-level deployment script (used by safe-deploy.sh)

## Branch Structure

- `main`: Main development branch, contains all source code
- `verified-deployment`: Stable reference branch for recovery
- `gh-pages`: Live deployment branch (don't modify directly)

## Quick Dashboard Update Method

For making targeted changes to the dashboard quickly:

1. **Make sure you're on the `gh-pages` branch**
   ```bash
   git checkout gh-pages
   git pull origin gh-pages
   ```

2. **Make your changes to the dashboard source code**
   - Edit files in the `heartglow-dashboard/` directory
   - For example, update components in `heartglow-dashboard/src/components/`

3. **Build the dashboard**
   ```bash
   cd heartglow-dashboard
   npm install  # If dependencies have changed
   npm run build
   ```

4. **Deploy using the deploy-to-github.sh script**
   ```bash
   cd ..  # Return to root directory
   bash deploy-to-github.sh
   ```

5. **Confirm you want to continue with dashboard deployment** when prompted

This method is ideal for:
- Quick fixes to dashboard UI components
- Text changes or minor style updates
- Testing dashboard changes without affecting the main landing page

Note that this method only deploys changes to the dashboard while preserving the main landing page.

## Safe Deployment Process

### Standard Deployment Flow

1. **Start with the main branch**
   ```bash
   git checkout main
   git pull origin main
   ```

2. **Make and test your changes locally**

3. **Commit and push to main**
   ```bash
   git add .
   git commit -m "Descriptive message about changes"
   git push origin main
   ```

4. **Run the safe deployment script**
   ```bash
   ./safe-deploy.sh
   ```

5. **Select the appropriate deployment option**
   - Option 1: Dashboard only (recommended for most changes)
   - Option 2: Full site (use with caution)
   - Option 3: Restore from stable deployment

6. **Verify the deployment** by checking both the main site and dashboard

### Automated Deployment via GitHub Actions

The repository includes GitHub Actions workflows that can perform automated deployments:

1. **Dashboard Only Deployments**
   - Triggered by changes to the `heartglow-dashboard/` directory
   - Only deploys to the `/dashboard` subdirectory
   - Preserves the main landing page
   - Uses the `.github/workflows/deploy.yml` workflow

2. **Deployment Verification**
   - Validates deployment scripts and structure
   - Ensures everything is properly configured
   - Uses the `.github/workflows/verify-deployment.yml` workflow

## Common Issues and Solutions

### Issue: Dashboard Deployment Overwrites Main Landing Page

This happens when the deployment process doesn't properly preserve the main landing page while updating the dashboard.

**Solution:**
- Always use `safe-deploy.sh` which has safeguards to prevent this issue
- Option 1 in the script ensures only the dashboard is updated
- The deployment always preserves files outside the `/dashboard` directory

### Issue: TypeScript Errors with Apostrophes

Smart quotes (') can cause TypeScript compilation errors. Always use standard apostrophes (').

**Solution:**
- Replace any smart quotes with standard apostrophes
- Use VSCode's search and replace with regex to find these issues

### Issue: Large File Issues with Git LFS

When working with large assets, Git may struggle with file size limits.

**Solution:**
- Enable Git LFS for large binary files
- Track large assets like images and videos with `.gitattributes`

### Issue: Branch Conflicts Between gh-pages and main

The gh-pages branch can get out of sync with the main branch, causing deployment issues.

**Solution:**
- Always start deployments from a clean state
- Use the safe-deploy.sh script which creates a backup before deployment
- If issues occur, use option 3 in the script to restore from a stable state

## Emergency Recovery Procedure

If the site is broken after a deployment:

1. Run `./safe-deploy.sh` and select option 3
2. Choose a stable branch (e.g., `verified-deployment`)
3. Confirm the restoration
4. Verify the site is working again

## Safe Deployment Best Practices

1. **Always back up before deployment**
   - The script creates automatic backups as dated branches

2. **Only deploy what needs updating**
   - Use option 1 for dashboard-only changes
   - Only use option 2 when you need to update the entire site

3. **Verify deployments immediately**
   - Check both the main landing page and dashboard after deployment
   - Look for broken links, missing styles, and JavaScript errors

4. **Document deployment issues**
   - Record any issues encountered in deployments
   - Update this guide with new solutions

## Using the Safe Deployment Script

The `safe-deploy.sh` script provides a menu-driven interface for managing deployments:

1. **Deploy dashboard only** - Updates only the /dashboard directory
2. **Deploy entire site** - Updates everything (use with caution)
3. **Restore from stable deployment** - Recover from a broken deployment
4. **Exit** - Exit without making changes

To use the script:
```bash
./safe-deploy.sh
```

Then follow the on-screen prompts.

## Deployment Script Details

The `safe-deploy.sh` script includes these key features:

1. **Backup Creation**: Automatically creates backup branches before deployment
2. **Deployment Verification**: Verifies files after deployment to ensure integrity  
3. **Selective Deployment**: Can deploy just the dashboard without affecting the main site
4. **Emergency Recovery**: Can restore from a previous stable state if needed

### Technical Implementation

The script uses Git worktrees and careful file copying to ensure that only the intended files are modified. For dashboard-only deployments, it:

1. Creates a backup branch
2. Clones the gh-pages branch into a temporary directory
3. Builds the dashboard
4. Updates only the dashboard directory in the temporary repo
5. Commits and pushes only those changes
6. Preserves all other files in the gh-pages branch

## Conclusion

Following these guidelines will help ensure smooth deployments of the HeartGlow AI platform and provide quick recovery options when issues arise. 

## Dashboard Build Troubleshooting

### Common Dashboard Build Issues

1. **Path Imports Issue**: 
   - Error: `Module not found: Can't resolve '@/styles/globals.css'`
   - Solution: Change import paths from `@/styles/...` to `../styles/...` in relevant files like `_app.tsx`

2. **Headers Configuration Error**:
   - Error: `Specified "headers" cannot be used with "output: export"`
   - Solution: Remove the `async headers()` function from `next.config.js` when using `output: export`

3. **Webpack Cache Errors**:
   - Error: `Error: ENOENT: no such file or directory, stat '.next/cache/webpack/...'`
   - Solution: Clean the cache and node_modules, then reinstall:
     ```bash
     rm -rf .next
     rm -rf node_modules
     npm install
     npm run build
     ```

4. **Missing Dependencies**:
   - Error: Various import errors for components or libraries
   - Solution: Check `package.json` and install any missing dependencies:
     ```bash
     npm install [missing-package]
     ```

5. **Environment Variables Issues**:
   - Error: `process.env.[VARIABLE] is undefined`
   - Solution: Ensure all required environment variables are set in `.env.local` or in `next.config.js` for build-time variables 