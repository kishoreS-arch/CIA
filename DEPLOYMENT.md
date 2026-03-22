# Deployment Guide - Vercel + Railway

## Quick Start Steps

### Step 1: Create GitHub Account (if don't have)
1. Go to https://github.com/signup
2. Create account with your email
3. Verify email

### Step 2: Create GitHub Repository
1. Go to https://github.com/new
2. Repository name: `CIA` (or any name)
3. Click "Create repository"
4. Copy the repository URL (like `https://github.com/YOUR_USERNAME/CIA.git`)

### Step 3: Push Code to GitHub
Run these commands in PowerShell in your project directory:

```powershell
cd "c:\Users\kisho\OneDrive\Pictures\CIA-main\CIA-main"
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/CIA.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username from step 2.

### Step 4: Deploy Frontend on Vercel
1. Go to https://vercel.com/signup
2. Sign up with GitHub (click "Continue with GitHub")
3. Import your CIA repository
4. Select `frontend` as root directory
5. Click Deploy
6. **Frontend URL will appear** → Copy it (like `https://cia-xyz.vercel.app`)

### Step 5: Deploy Backend on Railway
1. Go to https://railway.app
2. Sign up with GitHub
3. Create a new project → Import from GitHub
4. Select your CIA repository
5. Select `backend` as the root directory
6. Add environment variables:
   - `PORT`: `8081`
   - Database is already configured in application.yml
7. Click Deploy
8. **Backend URL will appear** → Copy it (like `https://cia-backend.up.railway.app`)

### Step 6: Connect Frontend to Backend
1. Go to your Vercel project settings
2. Add environment variable:
   - `VITE_API_BASE_URL`: Your Railway backend URL (from Step 5)
3. Redeploy Vercel project

### Step 7: Your Website URL
- **Frontend**: `https://your-vercel-url.vercel.app` (from Step 4)
- **Backend API**: `https://your-railway-url.up.railway.app` (from Step 5)

Visit your frontend URL to access the app!

---

## Files Created for Deployment
- `.gitignore` - Excluded files from git
- `backend/Dockerfile` - Container configuration
- `railway.json` - Railway deployment config
- This guide

All configuration is ready. Just follow the steps above!
