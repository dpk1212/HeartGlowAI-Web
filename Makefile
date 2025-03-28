# HeartGlowAI Security Upgrade Makefile

.PHONY: setup install start dev test backup deploy-staging deploy-prod rollback

# Default target: help
help:
	@echo "HeartGlowAI Security Upgrade Commands:"
	@echo ""
	@echo "  setup         - Run the setup script to prepare the environment"
	@echo "  install       - Install dependencies"
	@echo "  start         - Start the production server"
	@echo "  dev           - Start the development server"
	@echo "  test          - Run tests"
	@echo "  backup        - Create a backup of critical files"
	@echo "  deploy-staging - Deploy to staging environment"
	@echo "  deploy-prod   - Deploy to production environment"
	@echo "  rollback      - Rollback to previous version"
	@echo ""

# Setup the project
setup:
	@echo "Setting up the project..."
	node setup.js

# Install dependencies
install:
	@echo "Installing dependencies..."
	npm install

# Start the production server
start:
	@echo "Starting the production server..."
	NODE_ENV=production node api-server.js

# Start the development server
dev:
	@echo "Starting the development server..."
	NODE_ENV=development npm run dev

# Run tests
test:
	@echo "Running tests..."
	echo "No tests are currently defined."

# Create a backup of critical files
backup:
	@echo "Creating backup..."
	mkdir -p backups/$(shell date +%Y-%m-%d-%H-%M-%S)
	cp web-build/index.html backups/$(shell date +%Y-%m-%d-%H-%M-%S)/index.html
	@echo "Backup created in backups/$(shell date +%Y-%m-%d-%H-%M-%S)"

# Deploy to staging environment
deploy-staging:
	@echo "Deploying to staging environment..."
	@echo "This would typically involve:"
	@echo "1. Creating a git branch"
	@echo "2. Committing changes"
	@echo "3. Pushing to staging remote"
	@echo "4. Running any staging deployment scripts"
	@echo ""
	@echo "Since this is environment-specific, please run the appropriate commands manually."

# Deploy to production environment
deploy-prod:
	@echo "Deploying to production environment..."
	@echo "This would typically involve:"
	@echo "1. Merging staging branch to main"
	@echo "2. Running production deployment scripts"
	@echo ""
	@echo "Since this is environment-specific, please run the appropriate commands manually."

# Rollback to previous version
rollback:
	@echo "Rolling back to previous version..."
	@echo "Available backups:"
	@ls -la backups/
	@echo ""
	@echo "To restore a backup, run:"
	@echo "cp backups/[TIMESTAMP]/index.html web-build/index.html" 