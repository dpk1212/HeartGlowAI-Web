# HeartGlow AI Dashboard

Post-login dashboard for the HeartGlow AI platform, helping users craft personalized messages with emotional intelligence.

## Overview

This dashboard provides an interface for users to:
- Create new messages
- Use quick templates for common scenarios
- Manage saved recipients (Connections)
- View past messages
- Access future premium features

## Getting Started

### Prerequisites

- Node.js 14.x or later
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd heartglow-dashboard
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Environment Setup
   - Copy `.env.local.example` to `.env.local`
   - Ensure Firebase project is properly set up

4. Run the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deploying to Subdirectory

This dashboard is designed to be deployed to a subdirectory (`/dashboard`) of the main HeartGlowAI website, allowing the existing landing page to remain unchanged.

### Build for Subdirectory Deployment

```bash
# Build the project
npm run export

# Copy the output to your main site's public directory
npm run deploy
```

The build will automatically configure all paths and assets to work correctly within the `/dashboard` subdirectory.

## Technology Stack

- **Frontend**: Next.js, React, TypeScript
- **Styling**: Tailwind CSS, custom brand colors
- **Animation**: Framer Motion
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore

## Project Structure

- `/src/pages` - Next.js pages and routes
- `/src/components` - Reusable React components
- `/src/lib` - Utility functions and Firebase setup
- `/src/styles` - Global styles and Tailwind configuration

## Branding Guidelines

- Font: Inter (400, 500, 700)
- Primary color gradient: #FF4F81 (Warm Pink) to #8C30F5 (Soft Violet)
- Accent color: #5B37EB (Electric Indigo)
- See `tailwind.config.js` for complete color palette

## License

Copyright © HeartGlow AI. All rights reserved. 