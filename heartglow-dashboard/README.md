# HeartGlow Dashboard

A modern, responsive dashboard for the HeartGlow AI platform.

## Development

To run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment

The dashboard is automatically deployed when changes are pushed to the main branch. The deployment process is handled by a GitHub Actions workflow that:

1. Builds the dashboard
2. Copies the built files to the /dashboard directory in GitHub Pages
3. Preserves the main site, which is hosted in the root directory

### Manual Deployment

If you need to deploy manually, you can use the deployment script:

```bash
# From the root directory
./deploy-to-github.sh
```

This script:
1. Builds the dashboard
2. Copies the built files to the /dashboard directory
3. Commits and pushes the changes to the gh-pages branch

## Structure

- `/components` - React components
- `/pages` - Next.js pages
- `/public` - Static assets
- `/styles` - CSS styles
- `/lib` - Utility functions
- `/hooks` - Custom React hooks

## Important Notes

- Always test changes locally before pushing
- The dashboard is deployed to `/dashboard` on the production site
- The main site is separate and should not be modified when working on the dashboard 