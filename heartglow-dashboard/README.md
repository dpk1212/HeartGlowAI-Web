# HeartGlow AI Dashboard

> An emotionally intelligent dashboard for managing your connections and messages.

## IMPORTANT WARNING ⚠️

**DO NOT** deploy this dashboard directly to the root of the GitHub Pages site! This will overwrite the main landing page.

Always use the **provided deployment script** that safely deploys to the `/dashboard` subdirectory:

```bash
# From the root directory of the repository:
./deploy-to-github.sh
```

## Overview

The HeartGlow AI Dashboard is a web application that helps users manage their connections and create personalized, emotionally intelligent messages. It is built with Next.js, Firebase, and Framer Motion.

## Features

- User Authentication (Firebase Auth)
- Connection Management
- Message Creation and Management
- Sentiment Analysis
- Responsive Design

## Development Setup

1. Clone the repository
2. Navigate to the dashboard directory:
   ```bash
   cd heartglow-dashboard
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env.local` file with the following Firebase configuration:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
heartglow-dashboard/
├── src/
│   ├── components/       # Reusable UI components
│   ├── lib/              # Utilities and Firebase setup
│   ├── pages/            # Page components and routing
│   │   ├── connections/  # Connection management pages
│   │   ├── _app.tsx      # App wrapper with Auth context
│   │   ├── dashboard.tsx # Main dashboard page
│   │   └── index.tsx     # Entry point with redirects
│   └── styles/           # Global styles and Tailwind config
├── public/               # Static assets
└── next.config.js        # Next.js configuration
```

## Safe Deployment

The dashboard is deployed to GitHub Pages in the `/dashboard` subdirectory. This ensures that it doesn't interfere with the main landing page at the root of the site.

### Safe Deployment Process

1. Make sure all your changes are committed to the repository
2. Ensure you're on the main branch
3. Run the provided deployment script from the root directory:
   ```bash
   ./deploy-to-github.sh
   ```

This script will:
- Build the Next.js app
- Clone the current gh-pages branch content
- **ONLY** update the `/dashboard` directory
- Preserve all other content in the gh-pages branch
- Push the changes to GitHub

### Testing Locally

For local testing, you can use:

```bash
npm run build
npm run start
```

## Troubleshooting

- If you encounter TypeScript errors in the build, check for any missing imports or type definitions
- If Firebase integration fails, verify your `.env.local` configuration
- For deployment issues, check the GitHub Pages settings in your repository

## License

This project is part of the HeartGlow AI platform and is subject to its licensing terms. 