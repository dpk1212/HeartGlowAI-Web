# HeartGlowAI Project Rules

> Number 1 Rule and most important - "Think carefully and only action the specific task I have given you with the most concise and elegant solution that changes as little code as possible."
Number 2 - Check for already existing files, functions, pages that may already exist relevant to the question
Number 3 - ALWAYS USE THE SAFE DEPLOYMENT PROCESS documented below for deploying updates correctly

This guiding principle applies to all code contributions, feature implementations, and bug fixes within the HeartGlowAI project.

## CRITICAL: Safe Deployment Process

⚠️ **IMPORTANT:** Improper deployment can break both the main site and dashboard. Always follow this process.

### Step 1: Always work from the main branch

```bash
# Start with a clean working directory
git checkout main
git pull origin main

# Make your changes
# ...

# Commit your changes
git add .
git commit -m "Descriptive commit message"
git push origin main
```

### Step 2: Use the safe-deploy.sh script for deployment

```bash
# Execute the safe deployment script
./safe-deploy.sh
```

When prompted, select the appropriate option:
- Option 1: **Deploy dashboard only** (recommended for most changes)
- Option 2: **Deploy entire site** (use only when updating main landing page)
- Option 3: **Restore from stable deployment** (if something breaks)

### Step 3: Verify the deployment

After deployment, always verify that:
1. The main landing page (heartglowai.com) still works correctly
2. The dashboard (heartglowai.com/dashboard) functions as expected
3. No console errors appear in either environment

### Emergency Recovery

If a deployment breaks the site:

```bash
# Run the safe deployment script
./safe-deploy.sh

# Select option 3 (Restore from stable deployment)
# Choose "verified-deployment" as the restore point
```

### Important Rules:

1. **NEVER** manually push to gh-pages branch
2. **NEVER** delete critical branches (main, verified-deployment)
3. **ALWAYS** use the safe-deploy.sh script for deployments
4. If modifying deployment scripts, test thoroughly before pushing

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for more detailed information. 