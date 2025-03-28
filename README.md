# HeartGlowAI Secure API Server

This package contains a secure implementation of the HeartGlowAI API server that addresses critical security vulnerabilities.

## Important Security Fix

This release removes exposed Firebase credentials from client-side code and implements a secure API server to handle Firebase operations on the server-side.

## Installation

1. Extract the deployment package to your server
2. Run the installation script:
   ```bash
   ./install.sh
   ```
3. Start the server:
   ```bash
   npm start
   ```

## Configuration

All configuration is stored in the `.env` file. You may need to update the following values:

- `PORT`: The port to run the server on (default: 80)
- `NODE_ENV`: The environment to run the server in (default: production)
- `DEBUG`: Set to `true` for more verbose logging (default: false)

## Starting the Server

- To start in production mode:
  ```bash
  npm start
  ```
- To start in development mode:
  ```bash
  npm run dev
  ```

## Fallback Plan

If you encounter issues with the new implementation, you can revert to the original version:

```bash
npm run restore
```

## Deployment Options

### Option 1: Deploy to a Node.js hosting service

1. Upload the zip file to your hosting service
2. Extract and install dependencies
3. Configure environment variables
4. Start the server

### Option 2: Deploy with Docker

1. Build a Docker image:
   ```bash
   docker build -t heartglowai-secure-api .
   ```
2. Run the container:
   ```bash
   docker run -p 80:80 -d heartglowai-secure-api
   ```

### Option 3: Deploy with PM2

1. Install PM2:
   ```bash
   npm install -g pm2
   ```
2. Start the server with PM2:
   ```bash
   pm2 start start.js --name "heartglowai-api"
   ```
3. Set up PM2 to start on boot:
   ```bash
   pm2 startup
   pm2 save
   ```

## Test After Deployment

After deploying, test the following functionality:

1. Open the application in a browser
2. Sign in with Google Auth
3. Generate a message
4. Verify that message history works
5. Confirm that the feedback system works

## Support

If you encounter any issues, please contact support. 