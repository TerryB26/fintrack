#!/bin/bash

# FinTrack Deployment Script for PM2
# This script sets up and runs the FinTrack application using PM2
# Configured for remote deployment on 185.220.204.117

echo "🚀 Starting FinTrack deployment on 185.220.204.117..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo "📦 Installing PM2 globally..."
    npm install -g pm2
fi

# Check if PostgreSQL is accessible (you may need to adjust this for your setup)
echo "🔍 Checking database connection..."
# Add your database connectivity check here if needed

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install

# Set up database
echo "🗄️ Setting up database..."
npm run db:setup

# Build backend
echo "🔨 Building backend..."
npm run build

# Go back to root directory
cd ..

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install

# Copy production environment file
echo "📝 Setting up production environment..."
cp .env.production .env

# Build frontend for production
echo "🔨 Building frontend for production..."
npm run build

# Go back to root directory
cd ..

# Create PM2 ecosystem file if it doesn't exist
if [ ! -f ecosystem.config.js ]; then
    echo "📝 Creating PM2 ecosystem configuration..."
    cat > ecosystem.config.js << EOF
module.exports = {
  apps: [
    {
      name: 'fintrack-backend',
      script: 'backend/dist/main.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 1453,
        CORS_ORIGIN: 'http://185.220.204.117:1452'
      },
      error_file: './logs/backend-error.log',
      out_file: './logs/backend-out.log',
      log_file: './logs/backend.log',
      time: true
    },
    {
      name: 'fintrack-frontend',
      script: 'serve',
      args: '-s frontend/build -l 1452',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production'
      },
      error_file: './logs/frontend-error.log',
      out_file: './logs/frontend-out.log',
      log_file: './logs/frontend.log',
      time: true
    }
  ]
};
EOF
fi

# Install serve globally for serving the React build
echo "📦 Installing serve for frontend..."
npm install -g serve

# Create logs directory
mkdir -p logs

# Stop existing PM2 processes if they exist
echo "🛑 Stopping existing FinTrack processes..."
pm2 stop ecosystem.config.js 2>/dev/null || true
pm2 delete ecosystem.config.js 2>/dev/null || true

# Start the applications with PM2
echo "🚀 Starting FinTrack with PM2..."
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Show status
echo "📊 PM2 Status:"
pm2 status

# Show logs location
echo ""
echo "📋 Logs are available in the ./logs directory:"
echo "  - Backend logs: ./logs/backend.log"
echo "  - Frontend logs: ./logs/frontend.log"
echo ""
echo "🔍 To view logs in real-time:"
echo "  pm2 logs"
echo ""
echo "🔄 To restart services:"
echo "  pm2 restart ecosystem.config.js"
echo ""
echo "🛑 To stop services:"
echo "  pm2 stop ecosystem.config.js"
echo ""
echo "✅ FinTrack deployment completed!"
echo "🌐 Frontend: http://185.220.204.117:1452"
echo "🔧 Backend API: http://185.220.204.117:1453"