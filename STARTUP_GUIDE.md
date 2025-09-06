# 🚀 Nursing Conferences - Development Environment Startup Guide

This guide explains how to start both the frontend and backend servers with proper environment variable configuration.

## 📋 Prerequisites

- **Node.js** (v16 or higher) - [Download from nodejs.org](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** (for cloning and version control)

## 🔧 Environment Setup

### 1. Configure Environment Variables

1. **Copy the environment template:**
   ```bash
   cp .env.example .env
   ```

2. **Edit the `.env` file** with your actual values:
   - Replace all `your_*_here` placeholders with real values
   - Get Sanity credentials from [sanity.io/manage](https://sanity.io/manage)
   - Configure SMTP settings for email functionality
   - Add payment gateway credentials if needed

### 2. Critical Environment Variables

**Required for basic functionality:**
- `NEXT_PUBLIC_SANITY_PROJECT_ID` - Your Sanity project ID
- `NEXT_PUBLIC_SANITY_DATASET` - Usually "production"
- `SANITY_API_TOKEN` - API token with write permissions

**Required for email receipts:**
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`
- `FROM_EMAIL`, `EMAIL_FROM`

## 🚀 Starting the Servers

### Option 1: PowerShell Script (Windows - Recommended)

```powershell
# Basic startup with environment variables
.\start-servers.ps1

# Production mode
.\start-servers.ps1 -Production

# Skip environment validation
.\start-servers.ps1 -SkipEnvCheck

# Show help
.\start-servers.ps1 -Help
```

### Option 2: Batch File (Windows - Simple)

```cmd
# Double-click or run from command prompt
start-with-env.bat
```

### Option 3: Shell Script (Linux/macOS/WSL)

```bash
# Make executable (Linux/macOS only)
chmod +x start-dev.sh

# Basic startup
./start-dev.sh

# Production mode
./start-dev.sh --production

# Skip environment validation
./start-dev.sh --skip-env-check

# Show help
./start-dev.sh --help
```

### Option 4: Manual Startup

If you prefer to start servers manually:

```bash
# Terminal 1 - Frontend
cd nextjs-frontend
npm install
npm run dev

# Terminal 2 - Backend
cd SanityBackend
npm install
npm run dev
```

## 🌐 Server URLs

After startup, the following services will be available:

- **Frontend (Next.js):** http://localhost:3000
- **Backend (Sanity CMS):** http://localhost:3333
- **Data Population:** http://localhost:3000/populate-sanity-backend

## 🔍 Environment Variable Validation

The startup scripts will automatically:

✅ **Load** environment variables from `.env` file  
✅ **Validate** critical configuration  
✅ **Report** missing or unconfigured variables  
✅ **Continue** startup even with warnings  

### Validation Results

- **✅ Green:** Variable is properly configured
- **⚠️ Yellow:** Variable is missing or uses placeholder value
- **❌ Red:** Critical error that prevents startup

## 🛠️ Troubleshooting

### Common Issues

**1. "Node.js is not installed"**
- Install Node.js from [nodejs.org](https://nodejs.org/)
- Restart your terminal after installation

**2. "No .env file found"**
- Copy `.env.example` to `.env`
- Configure the required variables

**3. "SANITY_API_TOKEN is missing"**
- Go to [sanity.io/manage](https://sanity.io/manage)
- Navigate to API → Tokens
- Create a new token with Editor/Admin permissions

**4. "SMTP configuration failed"**
- Verify SMTP credentials with your email provider
- Check firewall/antivirus blocking port 465/587

**5. "Port already in use"**
- Kill existing Node.js processes:
  ```bash
  # Windows
  taskkill /f /im node.exe
  
  # Linux/macOS
  pkill node
  ```

### Environment Variable Issues

**Missing Sanity Configuration:**
```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=fl5uetho
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_actual_token_here
```

**Email Not Working:**
```bash
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your_email@domain.com
SMTP_PASS=your_email_password
```

## 📊 Features Enabled by Environment Variables

| Feature | Required Variables | Description |
|---------|-------------------|-------------|
| **CMS Connection** | `NEXT_PUBLIC_SANITY_*` | Connect to Sanity CMS |
| **Data Storage** | `SANITY_API_TOKEN` | Save registration data |
| **Email Receipts** | `SMTP_*` variables | Send payment receipts |
| **PDF Generation** | `SANITY_API_TOKEN` | Store PDF receipts |
| **PayPal Payments** | `PAYPAL_*` variables | Process payments |
| **Razorpay Payments** | `RAZORPAY_*` variables | Indian payment gateway |

## 🔒 Security Notes

- **Never commit `.env` file** to version control
- **Use different tokens** for development and production
- **Rotate API tokens** regularly
- **Use environment-specific** configurations

## 📝 Development Workflow

1. **Start servers** using one of the startup scripts
2. **Open frontend** at http://localhost:3000
3. **Access CMS** at http://localhost:3333
4. **Make changes** to code (auto-reload enabled)
5. **Test features** with proper environment configuration
6. **Stop servers** with Ctrl+C or close terminal windows

## 🚀 Production Deployment

For production deployment, see:
- `PRODUCTION_ENV_VARIABLES.md` - Production environment setup
- `COOLIFY_DEPLOYMENT_GUIDE.md` - Coolify deployment instructions
- `DEPLOYMENT_CONFIG.md` - General deployment configuration

## 💡 Tips

- **Use PowerShell script** for best Windows experience
- **Check terminal output** for detailed error messages
- **Validate environment** before important development sessions
- **Keep `.env.example` updated** when adding new variables
- **Document custom variables** in this guide
