# FinTrack Deployment Guide for Putty Server (185.220.204.117)

## Prerequisites

Before deploying FinTrack, ensure your server has the following installed:

### 1. Update System
```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Install Node.js (v18 or higher)
```bash
# Install Node.js using NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

### 3. Install PM2 (Process Manager)
```bash
sudo npm install -g pm2
pm2 --version
```

### 4. Install Git
```bash
sudo apt install git -y
git --version
```

### 5. Install PostgreSQL Client (if needed for database connectivity)
```bash
sudo apt install postgresql-client -y
```

## Deployment Steps

### Step 1: Clone the Repository
```bash
# Navigate to your desired directory (e.g., home directory)
cd ~

# Clone the FinTrack repository
git clone https://github.com/TerryB26/fintrack.git

# Navigate to the project directory
cd fintrack
```

### Step 2: Make the Deployment Script Executable
```bash
# Make the webhook.sh script executable
chmod +x webhook.sh
```

### Step 3: Run the Deployment Script
```bash
# Execute the deployment script
./webhook.sh
```

The script will:
- ✅ Check for Node.js installation
- 📦 Install PM2 if not present
- 📦 Install backend dependencies
- 🗄️ Set up the database
- 🔨 Build the backend
- 📦 Install frontend dependencies
- 📝 Configure production environment
- 🔨 Build the frontend for production
- 📝 Create PM2 ecosystem configuration
- 📦 Install serve for frontend serving
- 🗄️ Create logs directory
- 🚀 Start both services with PM2

### Step 4: Verify Deployment
```bash
# Check PM2 process status
pm2 status

# View application logs
pm2 logs

# Check if services are running on correct ports
netstat -tlnp | grep -E ':(1452|1453)'
```

### Step 5: Access the Application

Once deployment is complete, you can access FinTrack at:
- **Frontend**: http://185.220.204.117:1452
- **Backend API**: http://185.220.204.117:1453

## PM2 Management Commands

### View Status
```bash
pm2 status
```

### View Logs
```bash
# View all logs
pm2 logs

# View specific service logs
pm2 logs fintrack-backend
pm2 logs fintrack-frontend
```

### Restart Services
```bash
# Restart all services
pm2 restart ecosystem.config.js

# Restart specific service
pm2 restart fintrack-backend
pm2 restart fintrack-frontend
```

### Stop Services
```bash
# Stop all services
pm2 stop ecosystem.config.js

# Stop specific service
pm2 stop fintrack-backend
```

### Monitor Resources
```bash
pm2 monit
```

## Troubleshooting

### If Deployment Fails

1. **Check Node.js Version**
   ```bash
   node --version  # Should be v18 or higher
   ```

2. **Check Dependencies**
   ```bash
   # In backend directory
   cd backend && npm install

   # In frontend directory
   cd ../frontend && npm install
   ```

3. **Check Database Connection**
   ```bash
   # Test database connectivity
   psql "postgresql://postgres:@TerryB9003518@185.220.204.117:5432/fintrack" -c "SELECT 1;"
   ```

4. **Check Logs**
   ```bash
   pm2 logs --lines 100
   ```

### If Services Don't Start

1. **Check Port Availability**
   ```bash
   sudo netstat -tlnp | grep -E ':(1452|1453)'
   ```

2. **Kill Existing Processes**
   ```bash
   sudo fuser -k 1452/tcp 1453/tcp 2>/dev/null || true
   ```

3. **Restart PM2**
   ```bash
   pm2 kill
   pm2 start ecosystem.config.js
   ```

### If Frontend Shows API Errors

1. **Check Backend Status**
   ```bash
   pm2 status fintrack-backend
   ```

2. **Check Backend Logs**
   ```bash
   pm2 logs fintrack-backend --lines 50
   ```

3. **Test API Endpoint**
   ```bash
   curl http://localhost:1453/api/auth/me
   ```

## File Structure After Deployment

```
fintrack/
├── backend/
│   ├── dist/          # Compiled backend code
│   └── node_modules/  # Backend dependencies
├── frontend/
│   ├── build/         # Built frontend assets
│   └── node_modules/  # Frontend dependencies
├── logs/              # PM2 log files
├── ecosystem.config.js # PM2 configuration
├── webhook.sh         # Deployment script
└── README.md          # Documentation
```

## Security Notes

- The application is configured to run on ports 1452 (frontend) and 1453 (backend)
- CORS is configured to allow requests from the frontend domain
- Database credentials are stored in environment variables
- Consider setting up a reverse proxy (nginx) for production use
- Regularly update dependencies and monitor logs

## Support

If you encounter issues:
1. Check the logs: `pm2 logs`
2. Verify system resources: `htop` or `top`
3. Test individual components manually
4. Check network connectivity to database

## Quick Status Check

```bash
# One-liner to check everything is running
echo "=== PM2 Status ===" && pm2 jlist && echo -e "\n=== Port Check ===" && netstat -tlnp | grep -E ':(1452|1453)' && echo -e "\n=== Recent Logs ===" && pm2 logs --lines 10
```