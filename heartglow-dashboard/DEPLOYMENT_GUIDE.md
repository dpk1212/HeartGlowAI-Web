# HeartGlow AI Dashboard Deployment Guide

This guide explains how to deploy the HeartGlow AI dashboard alongside the existing landing page without modifying the landing page itself.

## Overview

The HeartGlow AI dashboard is configured to be deployed to a `/dashboard` subdirectory of your main website. This approach has several advantages:

1. The existing landing page remains completely untouched
2. The dashboard can be accessed via a simple URL: `https://yoursite.com/dashboard/`
3. Both systems can coexist without interference

## Files and Configuration

The following files have been modified/created to support subdirectory deployment:

- `next.config.js`: Contains subdirectory configuration (`basePath: '/dashboard'`)
- `.env.local`: Contains `NEXT_PUBLIC_BASE_PATH=/dashboard`
- `src/pages/_app.tsx`: Includes helper function for path resolution
- `deploy.sh`: Deployment script that builds and copies files to the right location

## Deployment Steps

### One-time Setup

1. Ensure your main website has a `public` directory where static files are served
2. Create a `dashboard` subdirectory inside it: `mkdir -p public/dashboard`

### For Each Deployment

1. Build and deploy the dashboard:

   ```bash
   # Navigate to dashboard directory
   cd heartglow-dashboard
   
   # Run the deployment script
   ./deploy.sh
   ```

2. The script will:
   - Build the Next.js application
   - Create the destination directory if it doesn't exist
   - Copy the build files to `../public/dashboard/`

3. Deploy your main website normally

### Manual Deployment

If you prefer to deploy manually:

1. Build the dashboard:
   ```bash
   npm run export
   ```

2. Copy the contents of the `out` directory to the `public/dashboard` directory of your main website:
   ```bash
   cp -r out/* ../public/dashboard/
   ```

## Testing Locally

To test the deployment locally:

1. Run a local server in your main project directory:
   ```bash
   cd ..
   npx http-server
   ```

2. Access the dashboard at `http://localhost:8080/dashboard/`

## Troubleshooting

- If assets fail to load, check that all URLs in the dashboard properly include the `/dashboard` prefix
- If routing issues occur, verify that all internal links use the `getRouteWithBasePath` helper function
- For API calls, ensure the basePath is properly configured in your API client

## Next Steps

After successful deployment, you can:

1. Add a link from your main site to the dashboard: `<a href="/dashboard">Dashboard</a>`
2. Test user authentication flow between the two systems
3. Consider implementing a more seamless style transition between the landing page and dashboard 