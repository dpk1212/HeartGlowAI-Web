#!/bin/bash

# Build the Next.js app
echo "Building the dashboard..."
npm run export

# Create the destination directory if it doesn't exist
echo "Preparing destination directory..."
mkdir -p ../public/dashboard

# Copy the build files to the public directory
echo "Copying build files to public/dashboard..."
cp -r out/* ../public/dashboard/

echo "Dashboard deployed to public/dashboard/"
echo "You can now access it at https://yoursite.com/dashboard/" 