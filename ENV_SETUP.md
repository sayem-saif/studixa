# Production Environment Variables Template

## For Vercel Deployment

Add these in Vercel Dashboard → Settings → Environment Variables:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_public_key
VITE_SUPABASE_PROJECT_ID=your_project_id
```

## For Netlify Deployment

Add using Netlify CLI or Dashboard:

```bash
netlify env:set VITE_SUPABASE_URL "https://your-project-id.supabase.co"
netlify env:set VITE_SUPABASE_PUBLISHABLE_KEY "your_anon_key"
netlify env:set VITE_SUPABASE_PROJECT_ID "your_project_id"
```

## Supabase Edge Function Secrets

Set in Supabase Dashboard or using CLI:

```bash
supabase secrets set LOVABLE_API_KEY=your_api_key_here
```

## Getting Your Credentials

1. **Supabase URL & Keys**:
   - Go to [Supabase Dashboard](https://app.supabase.com)
   - Select your project
   - Settings → API
   - Copy: Project URL, anon/public key

2. **Project ID**:
   - Same location as above
   - Or from your project URL: `https://PROJECT_ID.supabase.co`

3. **AI API Key** (LOVABLE_API_KEY):
   - Contact your AI provider
   - Or check Supabase AI gateway documentation

## Security Notes

- ✅ **DO** use environment variables for all keys
- ✅ **DO** keep `.env` file in `.gitignore`
- ✅ **DO** use different credentials for production and development
- ❌ **DON'T** commit API keys to git
- ❌ **DON'T** share your `.env` file
- ❌ **DON'T** use production keys in development

## Verification

Test your environment variables:

```bash
# Development
npm run dev
# Should connect to your Supabase project

# Production build
npm run build
# Should build without errors
```

## Troubleshooting

**"Supabase URL not defined" error:**
- Check variable names match exactly (VITE_SUPABASE_URL, not VITE_SUPABASE_API_URL)
- Verify variables are set in deployment platform
- Restart dev server after changing .env

**"Invalid API key" error:**
- Verify you're using the anon/public key (not service_role key)
- Check for extra spaces or quotes in .env file
- Regenerate key if needed from Supabase dashboard

**Edge Function not working:**
- Verify LOVABLE_API_KEY is set in Supabase secrets
- Check function is deployed: `supabase functions list`
- Review function logs: `supabase functions logs ai-mentor`
