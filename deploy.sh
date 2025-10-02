#!/bin/bash

# === ClearPro Deploy Script ===
# Usage: sudo bash deploy.sh
# Make sure you run this inside the folder with docker-compose.yml

echo "🚀 Starting ClearPro deployment..."

# 1️⃣ Navigate to the project folder (edit this path if needed)
cd "$(dirname "$0")"

# 2️⃣ Pull latest images (optional, skip if you build locally)
echo "📦 Pulling latest Docker images..."
docker-compose pull

# 3️⃣ Build backend & nginx images
echo "🔧 Building updated services..."
docker-compose build

# 4️⃣ Stop existing containers
echo "🛑 Stopping running containers..."
docker-compose down

# 5️⃣ Start everything in detached mode
echo "🚀 Starting services..."
docker-compose up -d

# 6️⃣ Wait a few seconds for services to boot
echo "⏳ Waiting for services to initialize..."
sleep 10

# 7️⃣ Check running containers
echo "📊 Container status:"
docker ps

# 8️⃣ Test backend health endpoint
echo "🔍 Checking backend health endpoint..."
curl -I https://clearproaligner.com/api/health || echo "⚠️ Health check failed. Check backend logs."

echo "✅ Deployment finished!"
echo "Visit: https://portal.clearproaligner.com/health.html"