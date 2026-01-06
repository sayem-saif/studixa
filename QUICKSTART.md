# Quick Start Guide

## 🚀 Run Locally in 3 Steps

### 1. Install Dependencies
```powershell
npm install
```

### 2. Set Up Environment
```powershell
# Run the setup script
npm run setup:local

# OR manually copy .env.example to .env
cp .env.example .env
```

Edit `.env` with your Supabase credentials from [app.supabase.com](https://app.supabase.com)

### 3. Start Development Server
```powershell
npm run dev
```

Visit **http://localhost:8080**

---

## 🗄️ Database Setup

### Option A: Cloud Supabase (Easiest)
```powershell
# Link your project
supabase link --project-ref YOUR_PROJECT_ID

# Push migrations
supabase db push
```

### Option B: Local Supabase
```powershell
# Start local database
npm run supabase:start

# Apply migrations
npm run supabase:reset

# Check status and get credentials
npm run supabase:status
```

---

## 📚 Full Documentation

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete setup and deployment instructions.

---

## ⚡ Quick Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run supabase:start` | Start local Supabase |
| `npm run supabase:reset` | Reset local database |

---

## 🔑 Required Environment Variables

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key_here
VITE_SUPABASE_PROJECT_ID=your_project_id
```

Get these from your [Supabase Dashboard](https://app.supabase.com) → Settings → API

---

## 🐛 Troubleshooting

**Supabase connection error?**
- Check `.env` file exists and has correct credentials
- Verify Supabase project is active

**AI Mentor not working?**
- Set `LOVABLE_API_KEY` in Supabase Edge Function secrets
- Deploy Edge Function: `supabase functions deploy ai-mentor`

**Port already in use?**
- Change port in `vite.config.ts` → `server.port`

---

For detailed instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)
