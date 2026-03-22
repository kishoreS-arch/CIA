# 🚀 Your CIA App Deployment - Quick Action Plan

## What I've Prepared
✅ Git repository initialized  
✅ Dockerfile for backend  
✅ Railway configuration  
✅ All deployment configs ready  

## Your Action Items (5 min each)

### 1️⃣ Create GitHub (if needed) & Push Code
```powershell
# Run these commands:
cd "c:\Users\kisho\OneDrive\Pictures\CIA-main\CIA-main"
git add .
git commit -m "Initial commit - CIA app deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/CIA.git
git push -u origin main
```

👉 **Before running:** Create a GitHub repo at https://github.com/new and replace `YOUR_USERNAME`

---

### 2️⃣ Deploy Frontend on Vercel (2 min)
1. Go to https://vercel.com/signup
2. Click "Continue with GitHub" 
3. Select your CIA repository
4. Set Root Directory: `frontend`
5. Click "Deploy"
6. **Copy your Frontend URL** → Example: `https://cia-xyz.vercel.app`

---

### 3️⃣ Deploy Backend on Railway (2 min)
1. Go to https://railway.app/login
2. Sign up with GitHub
3. New Project → "Deploy from GitHub"
4. Select CIA repository
5. Set Root Directory: `backend`
6. Click "Deploy"
7. **Copy your Backend URL** → Example: `https://cia-api.up.railway.app`

---

### 4️⃣ Connect Frontend to Backend (1 min)
1. Go to your Vercel Dashboard
2. Select your CIA project
3. Settings → Environment Variables
4. Add: `VITE_API_BASE_URL` = `<your-railway-backend-url>`
5. Redeploy (Vercel will auto-redeploy)

---

## 🎉 Your Website URLs

After completing above:
- **Frontend (Your App):** https://cia-xyz.vercel.app  ← **USE THIS**
- **Backend API:** https://cia-api.up.railway.app  

---

## Need Help?
- Vercel Docs: https://vercel.com/docs
- Railway Docs: https://railway.app/docs  
- GitHub: https://github.com/login

