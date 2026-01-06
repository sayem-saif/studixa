# 🚀 Studixa - Local Development & Deployment Guide

## 📋 Prerequisites

Before you begin, ensure you have installed:
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** or **bun** package manager
- **Supabase CLI** - [Installation Guide](https://supabase.com/docs/guides/cli)
- **Git** - [Download](https://git-scm.com/)

## 🔧 Local Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd studixa-main
```

### 2. Install Dependencies

```bash
npm install
# or
bun install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your Supabase credentials:

```env
VITE_SUPABASE_PROJECT_ID="your_project_id"
VITE_SUPABASE_PUBLISHABLE_KEY="your_anon_key"
VITE_SUPABASE_URL="https://your-project.supabase.co"
```

**Get these from:** [Supabase Dashboard](https://app.supabase.com) → Your Project → Settings → API

### 4. Set Up Supabase

#### Option A: Use Cloud Supabase (Recommended for Quick Start)

1. Go to [Supabase](https://app.supabase.com)
2. Create a new project
3. Copy credentials to `.env`
4. Run migrations:

```bash
supabase link --project-ref your_project_id
supabase db push
```

#### Option B: Run Supabase Locally

```bash
# Start local Supabase
supabase start

# Apply migrations
supabase db reset

# Get local credentials
supabase status
```

Update `.env` with local credentials (shown after `supabase status`).

### 5. Configure Supabase Edge Functions

Set up the AI mentor API key:

```bash
# For cloud Supabase
supabase secrets set LOVABLE_API_KEY=your_api_key_here

# For local development, add to .env:
# LOVABLE_API_KEY=your_api_key_here
```

**Get API Key:** Contact your AI provider or use Supabase AI gateway

### 6. Run Development Server

```bash
npm run dev
```

Visit: **http://localhost:8080**

## 🏗️ Build for Production

```bash
npm run build
```

Output will be in the `dist/` folder.

## 🌐 Deployment Options

### Option 1: Vercel (Recommended)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Add environment variables in Vercel Dashboard:
   - Settings → Environment Variables
   - Add all variables from `.env`

### Option 2: Netlify

1. Install Netlify CLI:
```bash
npm i -g netlify-cli
```

2. Deploy:
```bash
netlify deploy --prod
```

3. Set environment variables:
```bash
netlify env:set VITE_SUPABASE_URL your_url
netlify env:set VITE_SUPABASE_PUBLISHABLE_KEY your_key
```

### Option 3: Custom Server (VPS/Cloud)

1. Build the project:
```bash
npm run build
```

2. Upload `dist/` folder to your server

3. Configure Nginx/Apache to serve static files

Example Nginx config:
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /path/to/dist;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## 🔐 Security Checklist

Before deploying to production:

- [ ] Remove `.env` from git tracking
- [ ] Verify `.gitignore` includes `.env`
- [ ] Set up proper RLS policies in Supabase
- [ ] Enable email verification in Supabase Auth settings
- [ ] Configure custom domain and SSL
- [ ] Set up CORS policies in Supabase
- [ ] Review and test all user permissions
- [ ] Enable Supabase database backups

## 📊 Database Migrations

### Apply New Migrations

```bash
supabase db push
```

### Create New Migration

```bash
supabase migration new migration_name
```

### Reset Database (Local)

```bash
supabase db reset
```

## 🐛 Troubleshooting

### Issue: "Supabase URL not defined"
**Solution:** Check that `.env` file exists and contains valid credentials

### Issue: "AI Mentor not working"
**Solution:** 
1. Verify `LOVABLE_API_KEY` is set in Supabase secrets
2. Check Edge Function deployment: `supabase functions deploy ai-mentor`

### Issue: "Authentication errors"
**Solution:** 
1. Verify email confirmation settings in Supabase → Authentication → Email
2. Check redirect URLs are configured correctly

### Issue: TypeScript errors after enabling strict mode
**Solution:** The codebase may need type fixes. Run:
```bash
npm run build
```
Fix any type errors shown.

## 🔄 Updating Dependencies

```bash
npm update
```

Check for breaking changes in major version updates.

## 📝 Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_SUPABASE_URL` | Supabase project URL | `https://xxx.supabase.co` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Public anon key | `eyJhbGc...` |
| `VITE_SUPABASE_PROJECT_ID` | Project ID | `mwrbxsuk...` |

## 🎯 Production Optimizations

1. **Enable Build Optimizations:**
   - Already configured in `vite.config.ts`
   - Minification enabled by default

2. **CDN Setup:**
   - Consider using Cloudflare for static assets
   - Enable caching headers

3. **Performance Monitoring:**
   - Set up Sentry or similar for error tracking
   - Use Lighthouse for performance audits

## 📞 Support

For issues or questions:
- Check [Supabase Documentation](https://supabase.com/docs)
- Review [Vite Documentation](https://vitejs.dev/)
- Open an issue in the repository

## 📄 License

[Your License Here]

---

**Built with ❤️ using React, TypeScript, Vite, and Supabase**
