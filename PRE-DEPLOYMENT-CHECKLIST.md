# FinTrack Pre-Deployment Checklist for Putty/PM2

## 📋 **Required Files in Repository**
✅ All files are now in the repository:
- ✅ `backend/.env` - Backend environment variables
- ✅ `frontend/.env` - Frontend development environment
- ✅ `frontend/.env.production` - Frontend production environment
- ✅ `frontend/build/` - Pre-built frontend (no server build needed!)
- ✅ `frontend/public/` - Static assets and index.html
- ✅ `backend/src/` - All backend source code
- ✅ `backend/database/` - Database schema and seed files
- ✅ `webhook.sh` - Automated deployment script

## 🖥️ **Server Prerequisites**

### 1. Node.js v20+ (Required)
```bash
# Check current version
node --version

# If version is less than v20, upgrade:
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
node --version  # Should show v20.x.x
```

### 2. Git (Required)
```bash
# Check if installed
git --version

# If not installed:
sudo apt install git -y
```

### 3. PostgreSQL Client (Required)
```bash
# Check if installed
psql --version

# If not installed:
sudo apt install postgresql-client -y
```

### 4. PM2 (Will be auto-installed by script)
```bash
# Check if installed
pm2 --version

# If not installed, the webhook.sh script will install it
```

### 5. NestJS CLI (Will be auto-installed by script)
```bash
# Check if installed
nest --version

# If not installed, the webhook.sh script will install it
```

## 📝 **Deployment Steps on Putty Server**

### Step 1: Clean Start (if redeploying)
```bash
# Remove old installation (if exists)
cd ~/B26_Warehouse
rm -rf fintrack

# Kill any existing PM2 processes
pm2 kill
```

### Step 2: Clone Repository
```bash
cd ~/B26_Warehouse
git clone https://github.com/TerryB26/fintrack.git
cd fintrack
```

### Step 3: Verify Files Exist
```bash
# Check that all required files are present
ls -la backend/.env
ls -la frontend/.env
ls -la frontend/.env.production
ls -la frontend/build/
ls -la frontend/public/
ls -la webhook.sh
```

### Step 4: Run Deployment Script
```bash
# Make script executable
chmod +x webhook.sh

# Run deployment
./webhook.sh
```

## ✅ **Expected Results**

### During Deployment:
1. Node.js version check (warns if < v20)
2. PM2 installation (if needed)
3. NestJS CLI installation (if needed)
4. Backend dependencies installed
5. Database setup (tables + seed data)
6. Backend built successfully
7. Frontend uses pre-built files (no build step!)
8. PM2 starts both services
9. Health checks pass

### After Deployment:
```bash
# PM2 should show both services running
pm2 status

# Output should look like:
# ┌─────┬──────────────────┬─────────┬─────────┬──────────┬────────┬──────┬───────────┐
# │ id  │ name             │ mode    │ pid     │ uptime   │ ↺      │ status│ cpu       │
# ├─────┼──────────────────┼─────────┼─────────┼──────────┼────────┼──────┼───────────┤
# │ 0   │ fintrack-backend │ fork    │ 12345   │ 5s       │ 0      │ online│ 0%        │
# │ 1   │ fintrack-frontend│ fork    │ 12346   │ 5s       │ 0      │ online│ 0%        │
# └─────┴──────────────────┴─────────┴─────────┴──────────┴────────┴──────┴───────────┘

# Check services are listening on ports
netstat -tlnp | grep -E ':(1452|1453)'

# Test endpoints
curl -I http://localhost:1452
curl -I http://localhost:1453/api/auth/me
```

## 🌐 **Access URLs**
- **Frontend**: http://185.220.204.117:1452
- **Backend API**: http://185.220.204.117:1453

## 🔧 **Test User Credentials**
After deployment, you can log in with:
- Email: `john.doe@example.com`
- Password: `password123`

## 🚨 **Common Issues & Solutions**

### Issue 1: Node.js version too old
**Solution:**
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Issue 2: Database connection failed
**Solution:**
```bash
# Test database connection
psql "postgresql://postgres:@TerryB9003518@185.220.204.117:5432/fintrack" -c "SELECT 1;"

# Check .env file
cat backend/.env
```

### Issue 3: Port already in use
**Solution:**
```bash
# Kill processes on ports
sudo fuser -k 1452/tcp 1453/tcp

# Restart deployment
pm2 restart ecosystem.config.js
```

### Issue 4: Frontend not loading
**Solution:**
```bash
# Check if build directory exists
ls -la frontend/build/

# If missing, pull latest from GitHub
git pull origin main

# Restart frontend
pm2 restart fintrack-frontend
```

## 📊 **PM2 Management Commands**

```bash
# View status
pm2 status

# View logs (real-time)
pm2 logs

# View specific service logs
pm2 logs fintrack-backend
pm2 logs fintrack-frontend

# Restart services
pm2 restart ecosystem.config.js

# Stop services
pm2 stop ecosystem.config.js

# Delete services
pm2 delete ecosystem.config.js

# Monitor resources
pm2 monit

# Save configuration
pm2 save
```

## 🎯 **Success Indicators**

- ✅ PM2 shows both services as "online"
- ✅ Backend responds at http://localhost:1453/api/auth/me
- ✅ Frontend loads at http://localhost:1452
- ✅ Login page is accessible
- ✅ Can log in with test credentials
- ✅ Dashboard displays correctly

## 📝 **Notes**

1. **No Frontend Build Required**: The frontend is pre-built and included in the repository, avoiding memory issues on the server.

2. **Environment Files Included**: All `.env` files are in the repository for easy deployment.

3. **Database Auto-Setup**: The script automatically creates tables and seeds test data.

4. **PM2 Auto-Restart**: Services will automatically restart if they crash or on server reboot.

5. **Logs Available**: All logs are saved in the `./logs` directory for debugging.

## 🔄 **Updating Deployment**

To update after code changes:
```bash
cd ~/B26_Warehouse/fintrack
git pull origin main
./webhook.sh
```
