# HeartGlow AI

A modern AI platform for crafting personalized messages for your important relationships.

## About

HeartGlow AI helps users craft meaningful, personalized messages for the important people in their lives. Our AI-powered platform understands relationships and helps people communicate more authentically.

## Features

- **Personalized Messages**: Tailored to each relationship in your life
- **Emotional Intelligence**: AI that understands the nuances of human relationships
- **Message Library**: Save your special messages for future reference

## Beta Program

We're currently accepting beta users. [Sign up on our website](https://heartglowai.com) to get:

- Early access to all features
- Opportunity to shape the product
- Personalized onboarding session
- Extended free trial when we launch

## Development

This repository contains the landing page for HeartGlow AI beta signups. The application is built with:

- HTML5
- CSS3
- JavaScript (ES6+)

## Quick Start

```bash
# Clone the repository
git clone https://github.com/dpk1212/HeartGlowAI-Web.git

# Navigate to the directory
cd HeartGlowAI-Web

# Open the landing page in your browser
open index.html
```

## Deployment

The site is deployed using GitHub Pages with a custom domain:

- Primary domain: [heartglowai.com](https://heartglowai.com)
- Repository URL: [github.com/dpk1212/HeartGlowAI-Web](https://github.com/dpk1212/HeartGlowAI-Web)

## Important Deployment Notice

**CRITICAL:** Always use the `safe-deploy.sh` script for deployments to prevent issues with the main site and dashboard.

```bash
# To deploy safely
./safe-deploy.sh
```

## Verified Deployment Branch

The `verified-deployment` branch contains a stable and verified version of the codebase that has been tested and confirmed to deploy correctly. If you encounter issues with the gh-pages branch, you can restore from this branch using:

```bash
# Option 1: Use the safe deployment script
./safe-deploy.sh 
# Then select option 3 and choose "verified-deployment"

# Option 2: Manual restoration (advanced users only)
git push -f origin verified-deployment:gh-pages
```

## Repository Structure

- Main landing page: Root directory (`index.html` and assets)
- Dashboard application source: `heartglow-dashboard/` directory
- Deployed dashboard: `dashboard/` directory in the gh-pages branch

## Getting Started

For detailed information about deploying changes, see the [Deployment Guide](DEPLOYMENT_GUIDE.md).

## License

Copyright © 2023 HeartGlow AI. All rights reserved. 