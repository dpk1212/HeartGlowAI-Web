# HeartGlow AI Deployment Guide

## Overview

This guide explains the deployment process for HeartGlow AI, including how to safely deploy changes to both the main landing page and the dashboard without causing conflicts.

## Repository Structure

- `index.html` and associated files: Main landing page (deployed at root)
- `heartglow-dashboard/`: Next.js dashboard application code (source)
- `dashboard/`: Compiled dashboard files (deployed at /dashboard)

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
2. Choose a stable branch (e.g., `stable-dashboard-deployment`)
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

## Conclusion

Following these guidelines will help ensure smooth deployments of the HeartGlow AI platform and provide quick recovery options when issues arise. 