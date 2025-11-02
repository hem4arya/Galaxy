# Vercel Deployment Guide

## What I Fixed

1. ✅ Created `vercel.json` with proper build configuration
2. ✅ Updated `svelte.config.js` with Vercel adapter settings
3. ✅ Configured Node.js 20.x runtime

## Steps to Deploy

### 1. Set Environment Variables in Vercel

Go to your Vercel project settings and add these environment variables:

- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key

**How to add them:**

1. Go to your project on Vercel dashboard
2. Click "Settings" → "Environment Variables"
3. Add both variables for all environments (Production, Preview, Development)

### 2. Redeploy

After setting the environment variables:

```bash
# Option 1: Push to your git repository (recommended)
git add .
git commit -m "Fix Vercel deployment configuration"
git push

# Option 2: Use Vercel CLI
vercel --prod
```

### 3. Verify Build Settings

In Vercel dashboard, ensure:

- **Framework Preset**: SvelteKit
- **Build Command**: `npm run build`
- **Output Directory**: `.vercel/output` (auto-detected)
- **Install Command**: `npm install`

## Common Issues

### 404 Error

- Make sure environment variables are set in Vercel
- Ensure the build completed successfully
- Check that `@sveltejs/adapter-vercel` is in package.json

### Build Fails

- Run `npm run build` locally to test
- Check build logs in Vercel dashboard
- Ensure all dependencies are in package.json

### Supabase Connection Issues

- Verify environment variables are correct
- Check Supabase project is active
- Ensure CORS is configured in Supabase

## Testing Locally

Before deploying, test the production build:

```bash
npm run build
npm run preview
```

Visit http://localhost:4173 to see the production build.
