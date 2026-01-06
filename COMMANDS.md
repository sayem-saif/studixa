# 🎯 Command Reference Guide

Quick reference for all available commands in the Studixa project.

## 📦 Package Management

```powershell
# Install all dependencies
npm install

# Update all dependencies
npm update

# Check for outdated packages
npm outdated

# Audit for security vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

## 🚀 Development

```powershell
# Start development server (http://localhost:8080)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Check code quality
npm run lint
```

## 🗄️ Supabase (Local Development)

```powershell
# Start local Supabase (Docker required)
npm run supabase:start
# or
supabase start

# Stop local Supabase
npm run supabase:stop
# or
supabase stop

# Reset local database (applies all migrations)
npm run supabase:reset
# or
supabase db reset

# Check Supabase status and get credentials
npm run supabase:status
# or
supabase status

# Link to cloud project
supabase link --project-ref YOUR_PROJECT_ID

# Push migrations to cloud
supabase db push

# Pull schema from cloud
supabase db pull

# Create new migration
supabase migration new migration_name

# Deploy edge function
supabase functions deploy ai-mentor

# View edge function logs
supabase functions logs ai-mentor
```

## 🔧 Setup & Configuration

```powershell
# Run automated setup
npm run setup:local

# Manually copy environment template
cp .env.example .env

# Set Supabase secret
supabase secrets set LOVABLE_API_KEY=your_key_here

# List all secrets
supabase secrets list

# Unset a secret
supabase secrets unset LOVABLE_API_KEY
```

## 🌐 Deployment

### Vercel

```powershell
# Install Vercel CLI globally
npm install -g vercel

# Deploy to Vercel
vercel

# Deploy to production
vercel --prod

# Set environment variable
vercel env add VITE_SUPABASE_URL production

# List deployments
vercel ls

# Remove deployment
vercel rm deployment-url
```

### Netlify

```powershell
# Install Netlify CLI globally
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize site
netlify init

# Deploy
netlify deploy

# Deploy to production
netlify deploy --prod

# Set environment variables
netlify env:set VITE_SUPABASE_URL "your_value"

# List environment variables
netlify env:list

# Open site dashboard
netlify open
```

## 🐛 Debugging & Testing

```powershell
# Check TypeScript errors
npm run build

# Verbose build output
npm run build -- --debug

# Check for console errors
# Open browser DevTools (F12) → Console tab

# View network requests
# Open browser DevTools (F12) → Network tab

# Check Supabase logs (cloud)
# Visit: https://app.supabase.com → Your Project → Logs
```

## 🔐 Git Commands

```powershell
# Remove .env from git tracking (IMPORTANT!)
git rm --cached .env
git commit -m "Remove .env from tracking"
git push

# Check git status
git status

# Stage all changes
git add .

# Commit changes
git commit -m "Your message here"

# Push to remote
git push

# Create new branch
git checkout -b feature-name

# Switch branches
git checkout main

# Merge branch
git merge feature-name

# View commit history
git log --oneline
```

## 📊 Database Management

```powershell
# Connect to local database
psql postgresql://postgres:postgres@localhost:54322/postgres

# Connect to cloud database (get URL from Supabase dashboard)
psql "postgresql://postgres:[PASSWORD]@[HOST]/postgres"

# Backup local database
supabase db dump -f backup.sql

# Restore database
psql -f backup.sql postgresql://...

# View database schema
supabase db diff
```

## 🔍 Troubleshooting Commands

```powershell
# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
Remove-Item -Recurse -Force node_modules
npm install

# Check Node.js version
node --version

# Check npm version
npm --version

# Check Supabase CLI version
supabase --version

# View all environment variables (dev)
Get-Content .env

# Check if port 8080 is in use
netstat -ano | findstr :8080

# Kill process on port (replace PID)
taskkill /F /PID [PID]

# Clear Vite cache
Remove-Item -Recurse -Force node_modules/.vite
```

## 📱 Platform-Specific Commands

### Windows (PowerShell)

```powershell
# Copy files
Copy-Item .env.example .env

# View file contents
Get-Content .env

# Create directory
New-Item -ItemType Directory -Path "folder_name"

# List files
Get-ChildItem

# Find text in files
Select-String -Path "*.tsx" -Pattern "supabase"
```

### Linux/Mac (Bash)

```bash
# Copy files
cp .env.example .env

# View file contents
cat .env

# Create directory
mkdir folder_name

# List files
ls -la

# Find text in files
grep -r "supabase" *.tsx
```

## 🎨 Optional Tools

```powershell
# Format code with Prettier (if configured)
npx prettier --write .

# Analyze bundle size
npm run build -- --analyze

# Check for unused dependencies
npx depcheck

# Interactive dependency updater
npx npm-check-updates -u

# Generate component (if using generator)
npm run generate:component ComponentName
```

## 📚 Documentation Generation

```powershell
# Generate TypeScript documentation (if configured)
npx typedoc --out docs src

# Generate API documentation
# (Add your API doc generator here)
```

## ⚡ Quick Workflows

### First Time Setup
```powershell
git clone <repo-url>
cd studixa-main
npm install
npm run setup:local
# Edit .env with credentials
npm run supabase:start
npm run dev
```

### Daily Development
```powershell
npm run dev
# Make changes
# Test in browser
git add .
git commit -m "Description"
git push
```

### Before Deployment
```powershell
npm run lint
npm run build
# Review CHECKLIST.md
# Set environment variables in platform
# Deploy
```

### After Deployment Issues
```powershell
# Check deployment logs
# Verify environment variables
# Check browser console
# Review Supabase logs
# Test locally: npm run preview
```

---

**Need Help?** Check:
- [QUICKSTART.md](./QUICKSTART.md)
- [DEPLOYMENT.md](./DEPLOYMENT.md)
- [CHECKLIST.md](./CHECKLIST.md)

**Last Updated:** January 6, 2026
