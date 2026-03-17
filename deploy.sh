#!/bin/bash
# Findr Deployment Script
set -e

VPS="72.60.34.105"
SSH_KEY="~/.ssh/voltride_vps"

echo "🚀 Deploying Findr to VPS..."

# Sync files to VPS
rsync -avz --exclude node_modules --exclude .next --exclude .git \
  -e "ssh -i $SSH_KEY -o StrictHostKeyChecking=no" \
  ./ root@$VPS:/opt/findr/

# Build and restart on VPS
ssh -i $SSH_KEY root@$VPS << 'REMOTE'
cd /opt/findr

# Install dependencies and build
npm install --production
npm run build

# Stop existing container
docker stop findr-test 2>/dev/null || true
docker rm findr-test 2>/dev/null || true

# Create new image and container
docker build -t findr:latest .
docker run -d \
  --name findr-latest \
  -p 3002:3000 \
  --restart unless-stopped \
  findr:latest

echo "✅ Findr deployed successfully!"
docker ps | grep findr
REMOTE

echo "🎯 Deployment complete!"
