# HeartGlow AI GitHub Pages Deployment Guidelines

This document explains the structure of our GitHub Pages deployment and the guidelines to follow when making changes to prevent issues with both the main site and dashboard.

## Repository Structure

Our repository is structured as follows:
- Main landing page files in the root directory
- Dashboard files in the `/dashboard` directory

## Deployment Guidelines

### 1. Maintain Separate Concerns

- **NEVER** modify the main landing page when working on the dashboard and vice versa
- Always test changes locally before pushing to GitHub
- Always deploy using the `deploy-to-github.sh` script which is designed to handle the dashboard files correctly

### 2. File Management

- Keep HTML files for different routes properly labeled and separated:
  - `index.html` - Main landing page (root directory)
  - `dashboard/index.html` - Dashboard landing page
  - Any additional pages should be clearly named and properly nested

### 3. Path Management

- Always use relative paths within the dashboard files
- Use the `getRouteWithBasePath()` helper function for dashboard routing
- For the main site, use absolute paths from the root (starting with `/`)

### 4. Avoiding Common Issues

- **DO NOT** modify redirection logic unless absolutely necessary
- **DO NOT** add scripts to the main landing page that affect the dashboard
- **NEVER** deploy changes that modify both areas simultaneously
- Always revert immediately if you notice any issues with either site

### 5. Testing Protocol

Before pushing any changes:
1. Test the main landing page locally
2. Test the dashboard locally
3. Verify that both continue to work together without interference

## Rollback Procedure

If any issues occur after deployment:
1. Identify which commit was the last known good state
2. Use `git reset --hard [commit-hash]` to reset to that state
3. Use `git push --force origin gh-pages` to forcefully update GitHub Pages

## Dashboard Update Instructions

1. Make changes in the `heartglow-dashboard` directory
2. Build using `npm run build` or appropriate build command
3. Use the deployment script: `./deploy-to-github.sh`
4. Verify both the main site and dashboard work correctly after deployment

Following these guidelines will ensure that our GitHub Pages deployment remains stable and that changes to one part of the site do not affect the other.

## Prerequisites

- Git repository with GitHub Pages enabled
- Node.js and npm installed
- Basic command line knowledge

## Automated Deployment (Recommended)

For convenience, we've created a deployment script that automates the process:

```bash
# Make the script executable (only needed once)
chmod +x deploy-to-github.sh

# Run the deployment script
./deploy-to-github.sh
```

The script will:
1. Build the dashboard application
2. Create a `/dashboard` directory in your main repository
3. Copy the built files to this directory
4. Commit and push the changes to the gh-pages branch

## Manual Deployment Steps

If you prefer to deploy manually, follow these steps:

1. **Build the dashboard**

   ```bash
   # Navigate to dashboard directory
   cd heartglow-dashboard
   
   # Build the project
   npm run export
   ```

2. **Copy files to dashboard directory**

   ```bash
   # Create dashboard directory in main repo (if it doesn't exist)
   mkdir -p ../dashboard
   
   # Copy built files
   cp -r out/* ../dashboard/
   ```

3. **Commit and push changes**

   ```bash
   # Navigate to main repo
   cd ..
   
   # Add dashboard files
   git add dashboard
   
   # Commit changes
   git commit -m "Deploy HeartGlow AI Dashboard to /dashboard"
   
   # Push to gh-pages branch
   git push origin gh-pages
   ```

## Verifying the Deployment

After deployment, your dashboard should be available at:

```
https://heartglowai.com/dashboard/
```

Note: It may take a few minutes for GitHub Pages to update after pushing changes.

## Troubleshooting

If you encounter a 404 error:

1. **Check GitHub Pages settings**
   - Ensure GitHub Pages is enabled for your repository
   - Verify the correct branch is being used (gh-pages)

2. **Verify file paths**
   - Make sure `index.html` exists in the `/dashboard` directory
   - Confirm all asset paths are correctly prefixed with `/dashboard/`

3. **Check browser console**
   - Look for any 404 errors on specific resources
   - Verify all JavaScript and CSS files are loading correctly

4. **Clear cache**
   - Try accessing the site in an incognito/private window
   - Clear your browser cache and try again

## Next Steps

- Add a link to the dashboard from your main landing page
- Set up continuous integration for automatic deployment
- Implement user authentication and protected routes 