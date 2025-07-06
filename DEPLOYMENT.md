# MyLittleBank - Vercel + Neon Deployment Guide

## Prerequisites
- GitHub account
- Vercel account (sign up at vercel.com)
- Neon account (sign up at neon.tech)

## Step 1: Set Up Neon Database

1. **Create Neon Project**
   - Go to https://neon.tech and sign up
   - Create a new project called "mylittlebank"
   - Choose a region close to your users

2. **Get Database Connection String**
   - In your Neon dashboard, go to "Connection Details"
   - Copy the connection string (starts with `postgresql://`)
   - It should look like: `postgresql://user:password@host/database?sslmode=require`

3. **Initialize Database Schema**
   - You'll run `npm run db:push` after deployment to create tables

## Step 2: Push Code to GitHub

1. **Create GitHub Repository**
   - Go to GitHub and create a new repository called "mylittlebank"
   - Don't initialize with README (we'll push existing code)

2. **Push Your Code**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - MyLittleBank app"
   git branch -M main
   git remote add origin https://github.com/YOURUSERNAME/mylittlebank.git
   git push -u origin main
   ```

## Step 3: Deploy to Vercel

1. **Connect to Vercel**
   - Go to https://vercel.com and sign up with GitHub
   - Click "New Project"
   - Import your "mylittlebank" repository

2. **Configure Build Settings**
   - Framework Preset: Other
   - Build Command: `npm run build` (should auto-detect from vercel.json)
   - Output Directory: `client/dist` (should auto-detect from vercel.json)
   - Install Command: `npm install`

3. **Add Environment Variables**
   - In Vercel dashboard, go to Project Settings → Environment Variables
   - Add: `DATABASE_URL` = your Neon connection string
   - Add: `NODE_ENV` = `production`

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete

## Step 4: Initialize Database

1. **Access Vercel CLI** (or use Vercel dashboard)
   ```bash
   npx vercel env pull .env.local
   npm run db:push
   ```

2. **Verify Database**
   - Your app should now work with the Neon database
   - All tables (users, chores, goals, transactions) will be created

## Step 5: Configure PWA

1. **Update Domain References**
   - Your app will be available at: `https://mylittlebank.vercel.app`
   - The PWA icon and manifest should work automatically

2. **Test Installation**
   - Visit your Vercel URL on mobile
   - Add to home screen
   - Your custom "My Little Bank" icon should appear

## Environment Variables Needed

```env
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
NODE_ENV=production
```

## File Structure for Vercel

```
mylittlebank/
├── server/           # API routes (serverless functions)
├── client/           # React frontend
├── shared/           # Shared types and schema
├── vercel.json       # Vercel configuration
└── package.json      # Dependencies
```

## Troubleshooting

### Database Connection Issues
- Check your DATABASE_URL format
- Ensure Neon database is running
- Verify connection string includes `?sslmode=require`

### Build Failures
- Check Node.js version compatibility
- Ensure all dependencies are in package.json
- Review build logs in Vercel dashboard

### PWA Issues
- Verify manifest.json is accessible
- Check that icon files exist in public folder
- Test on actual mobile device

## Cost Estimate

- **Neon**: Free tier (512MB database, 3GB transfer)
- **Vercel**: Free tier (100GB bandwidth, serverless functions)
- **Total**: $0/month for personal use

Your app will be fully functional with the same features as the Replit version!