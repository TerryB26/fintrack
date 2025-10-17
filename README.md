# FinTrack

FinTrack is a simplified full-stack banking platform built to demonstrate end-to-end engineering skills — from backend architecture and data integrity to frontend usability. The app simulates real-world financial operations using a double-entry ledger system to ensure transaction accuracy, auditability, and balance consistency.

## Features

- User authentication and authorization
- Account management (EUR/USD currencies)
- Transaction tracking (deposits, withdrawals, transfers, exchanges)
- Real-time balance updates
- Interactive dashboard with charts
- Double-entry ledger system for financial accuracy

## Tech Stack

### Backend
- **Framework**: NestJS (Node.js)
- **Database**: PostgreSQL
- **Authentication**: JWT
- **ORM**: Raw SQL queries with pg library

### Frontend
- **Framework**: React 19
- **UI Library**: Material-UI (MUI)
- **Routing**: React Router
- **Forms**: Formik with Yup validation
- **Charts**: Recharts
- **Styling**: Tailwind CSS

## Prerequisites

Before running the application, make sure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **PostgreSQL** (v12 or higher)
- **Git**

## Initial Setup

### 1. Clone the Repository

```bash
git clone https://github.com/TerryB26/fintrack.git
cd fintrack
```

### 2. Database Setup

The application uses PostgreSQL. You have two options:

#### Option A: Local PostgreSQL Setup
1. Install PostgreSQL on your system
2. Create a database named `fintrack`
3. Update the `DATABASE_URL` in `backend/.env` with your local connection string

#### Option B: Use Remote PostgreSQL (Current Setup)
The project is configured to use a remote PostgreSQL instance. The connection details are already set in `backend/.env`.

### 3. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Set up database (creates tables and seed data)
npm run db:setup

# Start the development server
npm run start:dev
```

The backend will run on `http://localhost:1453`

### 4. Frontend Setup

```bash
# Open a new terminal and navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

The frontend will run on `http://localhost:1452`

### 5. Access the Application

Open your browser and navigate to `http://localhost:1452`

## Available Scripts

### Backend Scripts
- `npm run start:dev` - Start development server with hot reload
- `npm run start:prod` - Start production server
- `npm run build` - Build the application
- `npm run db:setup` - Set up database tables and seed data
- `npm run db:drop` - Drop all database tables
- `npm run db:reset` - Reset database (drop and setup)

### Frontend Scripts
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## Environment Variables

### Backend (.env)
```
DATABASE_URL="postgresql://username:password@host:port/database"
JWT_SECRET="your-secret-key"
PORT=1453
CORS_ORIGIN="http://185.220.204.117:1452"  # For production deployment
```

### Frontend (.env)
```
PORT=1452
REACT_APP_API_URL=http://localhost:1453/api
```

### Frontend Production (.env.production)
```
PORT=1452
REACT_APP_API_URL=http://185.220.204.117:1453/api
```

## API Endpoints

The backend provides RESTful API endpoints:

- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info
- `GET /api/accounts` - Get user accounts
- `GET /api/transactions` - Get user transactions
- `POST /api/transactions/transfer` - Create transfer
- `POST /api/transactions/exchange` - Create currency exchange
- `GET /api/users/search` - Search users for transfers

## Database Schema

The application uses a double-entry ledger system with the following main tables:
- `users` - User accounts
- `accounts` - User bank accounts (EUR/USD)
- `transactions` - All financial transactions
- `ledger_entries` - Double-entry ledger records

## Deployment

### PM2 Deployment (Linux/Production)

For production deployment on Linux servers with PM2, use the provided `webhook.sh` script:

```bash
# Make the script executable (run this on your Linux server)
chmod +x webhook.sh

# Run the deployment script
./webhook.sh
```

The script will:
- Install dependencies for both frontend and backend
- Set up the database
- Build the applications
- Configure PM2 with proper process management
- Start both services on ports 1452 (frontend) and 1453 (backend)

**Production URLs:**
- Frontend: http://185.220.204.117:1452
- Backend API: http://185.220.204.117:1453

### Local Development (Windows)

For local development on Windows, use the provided batch script:

```cmd
setup-windows.bat
```

Then start the services manually:
```cmd
# Terminal 1 - Backend
cd backend
npm run start:dev

# Terminal 2 - Frontend
cd frontend
npm start
```

### Manual Setup

If you prefer manual setup:

1. **Backend Setup:**
   ```bash
   cd backend
   npm install
   npm run db:setup
   npm run start:dev
   ```

2. **Frontend Setup:**
   ```bash
   cd frontend
   npm install
   npm start
   ```

## Environment Configuration

### Backend (.env)
```
DATABASE_URL="postgresql://username:password@host:port/database"
JWT_SECRET="your-secret-key"
PORT=1453
```

### Frontend (.env)
```
PORT=1452
REACT_APP_API_URL=http://localhost:1453/api
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.
