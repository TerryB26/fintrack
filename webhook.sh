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

# Verify Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo "⚠️  Warning: Node.js version is v$NODE_VERSION, but v20+ is recommended."
    echo "📝 To upgrade Node.js to v20, run:"
    echo "   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -"
    echo "   sudo apt-get install -y nodejs"
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo "📦 Installing PM2 globally..."
    npm install -g pm2
fi

# Check if NestJS CLI is installed
if ! command -v nest &> /dev/null; then
    echo "📦 Installing NestJS CLI globally..."
    npm install -g @nestjs/cli
fi

echo "🔍 Checking database connection..."
# Add your database connectivity check here if needed

# Check and configure firewall ports
echo "🔥 Checking firewall configuration..."
if command -v ufw &> /dev/null; then
    echo "📝 Configuring UFW firewall..."
    
    # Check if UFW is active
    if sudo ufw status | grep -q "Status: active"; then
        echo "✅ UFW is active"
        
        # Allow port 1452 (frontend)
        if ! sudo ufw status | grep -q "1452"; then
            echo "🔓 Allowing port 1452 (frontend)..."
            sudo ufw allow 1452/tcp
        else
            echo "✅ Port 1452 already allowed"
        fi
        
        # Allow port 1453 (backend)
        if ! sudo ufw status | grep -q "1453"; then
            echo "🔓 Allowing port 1453 (backend)..."
            sudo ufw allow 1453/tcp
        else
            echo "✅ Port 1453 already allowed"
        fi
        
        echo "✅ Firewall configured successfully"
    else
        echo "ℹ️  UFW is not active. Ports are open by default."
    fi
else
    echo "ℹ️  UFW not installed. Checking if ports are available..."
    
    # Check if ports are already in use
    if netstat -tuln | grep -q ":1452 "; then
        echo "⚠️  Port 1452 is already in use"
        sudo fuser -k 1452/tcp 2>/dev/null || true
    fi
    
    if netstat -tuln | grep -q ":1453 "; then
        echo "⚠️  Port 1453 is already in use"
        sudo fuser -k 1453/tcp 2>/dev/null || true
    fi
fi

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install

# Verify .env file exists
if [ ! -f .env ]; then
    echo "❌ Error: backend/.env file not found!"
    echo "📝 Please create backend/.env with the following variables:"
    echo "   DATABASE_URL=\"postgresql://user:password@host:port/database\""
    echo "   JWT_SECRET=\"your-secret-key\""
    echo "   PORT=1453"
    echo "   CORS_ORIGIN=\"http://185.220.204.117:1452\""
    exit 1
fi
echo "✅ Environment file found"

# Set up database
echo "🗄️ Setting up database..."
npm run db:setup

# Build backend
echo "🔨 Building backend..."
npm run build

# Go back to root directory
cd ..

# Check if frontend build exists
if [ -d "frontend/build" ] && [ "$(ls -A frontend/build)" ]; then
    echo "✅ Using pre-built frontend from repository..."
else
    echo "⚠️  Pre-built frontend not found. Building frontend..."
    cd frontend
    
    # Install frontend dependencies
    echo "📦 Installing frontend dependencies..."
    npm install
    
    # Try to build with increased memory
    echo "🔨 Building frontend (this may take a while)..."
    if NODE_OPTIONS="--max-old-space-size=2048" npm run build; then
        echo "✅ Frontend build completed successfully"
    else
        echo "❌ Frontend build failed. Trying with more memory..."
        if NODE_OPTIONS="--max-old-space-size=4096" npm run build; then
            echo "✅ Frontend build completed successfully"
        else
            echo "❌ Frontend build failed. Please build locally and push to GitHub."
            echo "💡 Run these commands on your local machine:"
            echo "   cd frontend"
            echo "   npm install"
            echo "   npm run build"
            echo "   git add frontend/build"
            echo "   git commit -m 'Add pre-built frontend'"
            echo "   git push origin main"
            exit 1
        fi
    fi
    
    cd ..
fi

# Remove old ecosystem config if it exists (to ensure we use the latest version)
if [ -f ecosystem.config.js ]; then
    echo "�️ Removing old PM2 ecosystem configuration..."
    rm ecosystem.config.js
fi

# Create PM2 ecosystem file
echo "📝 Creating PM2 ecosystem configuration..."

# Install dotenv at root level for ecosystem.config.js
npm install dotenv

cat > ecosystem.config.js << 'EOF'
require('dotenv').config({ path: './backend/.env' });

module.exports = {
  apps: [
    {
      name: 'fintrack-backend',
      script: 'backend/dist/main.js',
      cwd: './',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env_file: './backend/.env',
      env: {
        NODE_ENV: 'production'
      },
      error_file: './logs/backend-error.log',
      out_file: './logs/backend-out.log',
      log_file: './logs/backend.log',
      time: true
    },
    {
      name: 'fintrack-frontend',
      script: 'serve',
      args: '-s frontend/build -p 1452',
      cwd: './',
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

# Setup PM2 to start on system reboot
pm2 startup

# Show status
echo ""
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
echo ""
echo "🧪 Quick health check:"
curl -s http://localhost:1453/api/auth/me > /dev/null && echo "✅ Backend is responding" || echo "❌ Backend health check failed"
curl -s http://localhost:1452 > /dev/null && echo "✅ Frontend is responding" || echo "❌ Frontend health check failed"