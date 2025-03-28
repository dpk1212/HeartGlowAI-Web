FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy application files
COPY . .

# Set permissions
RUN chmod +x start.js revert.js

# Expose the port
EXPOSE 80

# Start the application
CMD ["node", "start.js"] 