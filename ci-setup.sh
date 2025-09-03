#!/bin/bash

# CI Setup Script for SEIS E2E Playwright Tests
# This script ensures the CI environment is properly configured

set -e  # Exit on any error

echo "Starting CI setup for SEIS E2E Playwright Tests..."

# Check if we're in a CI environment
if [[ "$CI" == "true" || "$TF_BUILD" == "True" || -n "$SYSTEM_COLLECTIONID" ]]; then
    echo "✓ CI environment detected"
    
    if [[ "$TF_BUILD" == "True" || -n "$SYSTEM_COLLECTIONID" ]]; then
        echo "✓ Azure DevOps environment detected"
    fi
else
    echo "⚠ Warning: CI environment not detected, proceeding with local setup"
fi

# Check Node.js version
node_version=$(node --version)
echo "✓ Node.js version: $node_version"

# Check npm version
npm_version=$(npm --version)
echo "✓ npm version: $npm_version"

# Install dependencies if not already installed
if [ ! -d "node_modules" ]; then
    echo "Installing npm dependencies..."
    npm ci
    echo "✓ Dependencies installed"
else
    echo "✓ Dependencies already installed"
fi

# Install Playwright browsers with dependencies
echo "Installing Playwright browsers..."
if [[ "$CI" == "true" || "$TF_BUILD" == "True" || -n "$SYSTEM_COLLECTIONID" ]]; then
    # In CI, try without --with-deps first, then fallback to just browsers
    if ! npx playwright install --with-deps chromium; then
        echo "⚠ Warning: Failed to install system dependencies, installing browsers only..."
        npx playwright install chromium
    fi
else
    npx playwright install --with-deps chromium
fi

# Verify Playwright installation
echo "Verifying Playwright installation..."
npx playwright --version

# Create test-results directory if it doesn't exist
mkdir -p test-results

# Validate environment files
echo "Validating environment configuration..."
if [ ! -f "e2e/environments/all-envs.json" ]; then
    echo "❌ Error: Missing environment configuration files"
    exit 1
fi

echo "✓ Environment files validated"

# Check if NODE_ENV is set
if [ -z "$NODE_ENV" ]; then
    echo "⚠ Warning: NODE_ENV not set, will default to 'dev'"
else
    echo "✓ NODE_ENV set to: $NODE_ENV"
fi

echo "✅ CI setup completed successfully!"