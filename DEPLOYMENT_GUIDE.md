# 🚀 CropGuard AI Deployment Guide

This guide will help you deploy your CropGuard AI application to production in under 30 minutes.

## 📋 Prerequisites

Before deploying, ensure you have:
- [x] GitHub account
- [x] Vercel account 
- [x] Clerk account
- [x] Supabase account
- [x] Groq account

## 🔧 Step 1: Setup API Keys

### 1.1 Clerk Authentication

1. Go to [Clerk Dashboard](https://clerk.com)
2. Create a new application
3. Choose authentication methods:
   - ✅ Email
   - ✅ Google
   - ✅ GitHub (optional)
4. Copy your API keys:
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   ```

### 1.2 Supabase Database

1. Go to [Supabase](https://supabase.com)
2. Create new project
3. Wait for database to provision (2-3 minutes)
4. Go to Settings → API
5. Copy your credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   ```

6. **IMPORTANT: Run Database Setup**
   - Go to SQL Editor in Supabase
   - Run this SQL:

```sql
-- Users table (handled by Clerk, store Clerk user_id)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clerk_user_id TEXT UNIQUE NOT NULL,
    email TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    last_login TIMESTAMP
);

-- Scans table
CREATE TABLE scans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    clerk_user_id TEXT NOT NULL,
    image_url TEXT NOT NULL,
    crop_type VARCHAR(100),
    disease_detected VARCHAR(200) NOT NULL,
    confidence DECIMAL(5,4) NOT NULL,
    severity VARCHAR(20),
    symptoms JSONB,
    treatment JSONB,
    prevention JSONB,
    organic_treatment JSONB,
    cost_estimate TEXT,
    scientific_name TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_scans_user ON scans(clerk_user_id);
CREATE INDEX idx_scans_created ON scans(created_at DESC);
CREATE INDEX idx_scans_disease ON scans(disease_detected);

-- Enable RLS
ALTER TABLE scans ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own scans"
    ON scans FOR SELECT
    USING (clerk_user_id = auth.jwt() ->> 'sub');

CREATE POLICY "Users can insert own scans"
    ON scans FOR INSERT
    WITH CHECK (clerk_user_id = auth.jwt() ->> 'sub');

CREATE POLICY "Users can delete own scans"
    ON scans FOR DELETE
    USING (clerk_user_id = auth.jwt() ->> 'sub');

-- Storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('scan-images', 'scan-images', true);

-- Storage policies
CREATE POLICY "Authenticated users can upload"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'scan-images' AND auth.role() = 'authenticated');

CREATE POLICY "Public read access"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'scan-images');
```

### 1.3 Groq AI

1. Go to [Groq Console](https://console.groq.com)
2. Sign up with Google/GitHub
3. Navigate to API Keys
4. Create new API key
5. Copy key (starts with `gsk_`):
   ```
   GROQ_API_KEY=gsk_...
   ```

## 🌐 Step 2: Deploy to Vercel

### Option A: One-Click Deploy (Recommended)

1. Click this button:
   
   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fsibby-killer%2Fcropguard-ai-web)

2. Connect your GitHub account
3. Give your project a name
4. Add environment variables:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
   - `NEXT_PUBLIC_CLERK_SIGN_IN_URL` = `/sign-in`
   - `NEXT_PUBLIC_CLERK_SIGN_UP_URL` = `/sign-up`
   - `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` = `/dashboard`
   - `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` = `/dashboard`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `GROQ_API_KEY`

5. Click "Deploy"
6. Wait 2-3 minutes
7. Get your live URL!

### Option B: Manual Deploy

1. Fork this repository to your GitHub
2. Go to [Vercel](https://vercel.com)
3. Click "New Project"
4. Import your forked repository
5. Add environment variables (same as above)
6. Click "Deploy"

## ⚙️ Step 3: Configure Clerk Redirects

1. Go to your Clerk Dashboard
2. Navigate to "Domains"
3. Add your Vercel domain:
   ```
   https://your-app-name.vercel.app
   ```
4. Update redirect URLs in Clerk settings

## 🧪 Step 4: Test Your Application

1. Visit your deployed app
2. Test user registration
3. Test image upload and disease detection
4. Check dashboard functionality
5. Verify scan history

## 🔍 Verification Checklist

- [ ] Landing page loads correctly
- [ ] User can sign up/sign in
- [ ] Dashboard shows after login
- [ ] Image upload works
- [ ] AI disease detection returns results
- [ ] Scan history displays correctly
- [ ] Mobile version is responsive

## 🐛 Common Issues & Solutions

### Issue: "Clerk authentication fails"
**Solution:** Check Clerk domain configuration and environment variables

### Issue: "Database connection error"
**Solution:** Verify Supabase URL and run database schema SQL

### Issue: "AI detection fails"
**Solution:** Check Groq API key and rate limits (30 requests/minute on free tier)

### Issue: "Images not uploading"
**Solution:** Verify Supabase storage bucket and policies are set correctly

## 📊 Monitoring & Analytics

### Enable Vercel Analytics
1. Go to your Vercel dashboard
2. Select your project
3. Go to Analytics tab
4. Enable Web Analytics

### Monitor API Usage
- **Groq:** Check console.groq.com for usage stats
- **Clerk:** Monitor user signups in dashboard
- **Supabase:** Check database usage in project dashboard

## 🚀 Going Live

### Custom Domain (Optional)
1. Purchase domain (e.g., cropguard-ai.com)
2. In Vercel, go to Settings → Domains
3. Add your custom domain
4. Update DNS records as instructed
5. Update Clerk domain settings

### Performance Optimization
- Enable Vercel Speed Insights
- Set up proper caching headers
- Optimize images for web
- Monitor Core Web Vitals

## 🔒 Security Checklist

- [ ] All environment variables are secure
- [ ] No API keys in client-side code
- [ ] HTTPS enforced (Vercel does this automatically)
- [ ] Database RLS policies enabled
- [ ] File upload validation working
- [ ] Rate limiting configured

## 📈 Next Steps

1. **Monitor Usage:** Check analytics and user feedback
2. **Add Features:** Implement additional crops and diseases
3. **Optimize:** Improve AI accuracy with more training data
4. **Scale:** Add premium features or enterprise solutions
5. **Community:** Build farmer community features

## 🆘 Support

If you need help:
1. Check the troubleshooting section in README.md
2. Create an issue on GitHub
3. Email: alfred.dev8@gmail.com

---

## 🎉 Congratulations!

Your CropGuard AI application is now live and helping farmers worldwide! 🌱

**Live URL:** https://your-app-name.vercel.app

Share your app and help farmers protect their crops with AI technology!

---

Made with 💚 by Alfred Nyongesa for farmers worldwide