#!/bin/bash

# Install MOCK_GEN dependencies
cd MOCK_GEN && npm install && cd ..

# Install root project dependencies
npm install

# Install Playwright browsers
npx playwright install

# Install Playwright system dependencies
npx playwright install-deps
