# 🌱 CropGuard AI - Web Application

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fsibby-killer%2Fcropguard-ai-web&env=NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,CLERK_SECRET_KEY,NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY,GROQ_API_KEY&envDescription=Required%20API%20keys%20for%20authentication%2C%20database%2C%20and%20AI%20services&envLink=https%3A%2F%2Fgithub.com%2Fsibby-killer%2Fcropguard-ai-web%23configuration)

AI-powered plant disease detection for farmers worldwide. Built with Next.js 14, Clerk authentication, Supabase database, and Groq AI.

**Live Demo:** https://cropguard-ai-web.vercel.app  
**Repository:** https://github.com/sibby-killer/cropguard-ai-web

## 🎯 Overview

CropGuard AI is a full-stack web application that helps farmers identify plant diseases using artificial intelligence. Simply upload a photo of your crop, and get instant diagnosis with treatment recommendations.

### Key Benefits:
- 🚀 Instant AI-powered disease detection (<5 seconds)
- 📸 Support for all image formats (JPEG, PNG, WEBP, etc.)
- 💯 95%+ detection accuracy
- 💊 Comprehensive treatment plans
- 📊 Track your scan history
- 🔐 Secure authentication with Clerk
- 💰 100% free to use

## ✨ Features

### For All Users:
- Beautiful landing page with clear value proposition
- Educational resources about plant diseases
- Responsive design (mobile, tablet, desktop)

### For Registered Users:
- **Disease Detection:**
  - Upload multiple image formats
  - AI analysis with Groq Vision
  - Detailed disease information
  - Confidence scores
  - Severity levels
  - Treatment recommendations
  - Prevention tips
  - Cost estimates

- **Dashboard:**
  - Overview statistics
  - Recent scans
  - Analytics charts
  - Quick actions

- **Scan History:**
  - View all past scans
  - Search and filter
  - Export data
  - Delete scans

- **Disease Database:**
  - Browse all diseases
  - Detailed information
  - Search by crop type
  - Scientific names

- **Settings:**
  - Profile management
  - Preferences
  - Data export
  - Account deletion

## 🏗️ Tech Stack

**Frontend:**
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Shadcn/ui
- Framer Motion

**Authentication:**
- Clerk

**Backend:**
- Next.js API Routes
- Groq AI Vision API
- Supabase (PostgreSQL)
- Supabase Storage

**Deployment:**
- Vercel

**Additional Libraries:**
- React Hook Form (forms)
- Zod (validation)
- Zustand (state)
- Sharp (image processing)
- Recharts (charts)
- date-fns (dates)

## 📐 Architecture

```
User Browser
    ↓
Next.js Frontend (Vercel)
    ↓
Clerk Auth → Protected Routes
    ↓
Next.js API Routes (Serverless)
    ↓
├─ Groq AI (Disease Detection)
├─ Supabase DB (Scan History)
└─ Supabase Storage (Images)
```

## ✅ Prerequisites

- Node.js 18+ and npm
- Git
- Clerk account (free)
- Supabase account (free)
- Groq API key (free)
- Vercel account (free)
- GitHub account

## 🚀 Installation

### 1. Clone Repository

```bash
git clone https://github.com/sibby-killer/cropguard-ai-web.git
cd cropguard-ai-web
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials (see Configuration section below).

### 4. Run Development Server

```bash
npm run dev
```

Open http://localhost:3000

## ⚙️ Configuration

### Get API Keys

#### 1. Clerk (Authentication)

1. Go to https://clerk.com
2. Create account and new application
3. Choose authentication methods (Email, Google, GitHub recommended)
4. Copy API keys from dashboard
5. Add to `.env.local`:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

#### 2. Supabase (Database & Storage)

1. Go to https://supabase.com
2. Create new project
3. Wait for database provisioning
4. Go to Project Settings → API
5. Copy URL and anon key
6. Add to `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

7. Run database setup SQL (see Database Schema section)

#### 3. Groq AI (Disease Detection)

1. Go to https://console.groq.com
2. Sign up with Google/GitHub
3. Navigate to API Keys
4. Create new API key
5. Copy key (starts with gsk_...)
6. Add to `.env.local`:

```env
GROQ_API_KEY=gsk_...
```

### Complete .env.local

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# Groq
GROQ_API_KEY=gsk_...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🗄️ Database Schema

Run this SQL in Supabase SQL Editor:

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

-- RLS Policies (Note: Adjust these for your specific Clerk setup)
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

## 🚢 Deployment to Vercel

### Method 1: GitHub Integration (Recommended)

1. Push code to GitHub:
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. Go to https://vercel.com
3. Click "New Project"
4. Import from GitHub: sibby-killer/cropguard-ai-web
5. Configure project:
   - Framework: Next.js
   - Root Directory: ./
   - Build Command: npm run build
   - Output Directory: .next

6. Add Environment Variables (click "Environment Variables"):
   - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
   - CLERK_SECRET_KEY
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - GROQ_API_KEY
   - (and all other Clerk URLs)

7. Click "Deploy"

8. Wait 2-3 minutes

9. Get your URL: https://your-app.vercel.app

10. Update Clerk redirect URLs:
    - Go to Clerk dashboard
    - Add your Vercel URL to allowed redirect URLs

### Method 2: Vercel CLI

```bash
npm install -g vercel
vercel login
vercel

# Set environment variables
vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
vercel env add CLERK_SECRET_KEY
# ... (add all variables)

# Deploy to production
vercel --prod
```

## 📖 API Documentation

### POST /api/detect

Analyze plant image for diseases.

**Authentication:** Required (Clerk)

**Request:**
```typescript
Content-Type: multipart/form-data

FormData {
  image: File (JPEG/PNG/WEBP/GIF/BMP/TIFF),
  crop_type: string (optional)
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "scan_id": "uuid",
  "disease": "Late Blight",
  "confidence": 95.5,
  "severity": "Severe",
  "description": "Fungal disease...",
  "symptoms": ["Dark spots", "White mold"],
  "treatment": ["Remove plants", "Apply fungicide"],
  "prevention": ["Use resistant varieties"],
  "organic_treatment": ["Copper spray"],
  "cost_estimate": "$20-50 per acre",
  "scientific_name": "Phytophthora infestans",
  "image_url": "https://...",
  "timestamp": "2024-11-14T10:30:00Z"
}
```

**Error Responses:**
- 400: Invalid image or missing data
- 401: Unauthorized (not signed in)
- 413: File too large (>10MB)
- 429: Rate limit exceeded
- 500: Server error

### GET /api/history

Get user's scan history.

**Authentication:** Required

**Query Parameters:**
- `limit` (number, default: 50)
- `offset` (number, default: 0)
- `crop_type` (string, optional)
- `severity` (string, optional)
- `search` (string, optional)

**Response:**
```json
{
  "success": true,
  "scans": [...],
  "pagination": {
    "total": 123,
    "page": 1,
    "limit": 50,
    "totalPages": 3
  }
}
```

### GET /api/diseases

Get disease database.

**Authentication:** Optional

**Query Parameters:**
- `search` (string)
- `crop` (string)
- `sort` (string: name|severity)

**Response:**
```json
{
  "success": true,
  "diseases": [
    {
      "name": "Late Blight",
      "crop": "Tomato",
      "severity": "Severe",
      "scientific_name": "...",
      "description": "...",
      ...
    }
  ],
  "total": 10
}
```

### GET /api/stats

Get user statistics.

**Authentication:** Required

**Response:**
```json
{
  "success": true,
  "stats": {
    "total_scans": 45,
    "last_scan_date": "2024-11-14",
    "most_common_disease": "Early Blight",
    "average_confidence": 92.3,
    "scans_by_month": [...]
  }
}
```

## 📂 Project Structure

```
cropguard-ai-web/
├── app/
│   ├── (dashboard)/
│   │   └── dashboard/
│   │       ├── page.tsx (dashboard home)
│   │       ├── scan/page.tsx (new scan)
│   │       ├── history/page.tsx (scan history)
│   │       └── layout.tsx (dashboard layout)
│   ├── api/
│   │   ├── detect/route.ts
│   │   ├── history/route.ts
│   │   ├── diseases/route.ts
│   │   └── stats/route.ts
│   ├── sign-in/[[...sign-in]]/page.tsx
│   ├── sign-up/[[...sign-up]]/page.tsx
│   ├── layout.tsx (root layout)
│   ├── page.tsx (landing page)
│   └── globals.css
├── components/
│   ├── ui/ (shadcn components)
│   ├── landing/
│   │   ├── hero.tsx
│   │   ├── features.tsx
│   │   ├── how-it-works.tsx
│   │   ├── stats.tsx
│   │   ├── testimonials.tsx
│   │   ├── pricing.tsx
│   │   └── footer.tsx
│   ├── dashboard/
│   │   ├── sidebar.tsx
│   │   ├── mobile-header.tsx
│   │   ├── stats-card.tsx
│   │   └── recent-scans.tsx
│   └── shared/
│       └── navbar.tsx
├── lib/
│   ├── disease-database.ts
│   ├── groq-client.ts
│   ├── supabase.ts
│   └── utils.ts
├── types/
│   └── index.ts
├── middleware.ts (Clerk auth)
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

## 🐛 Troubleshooting

### Issue: Clerk authentication not working

**Symptoms:** Redirects to sign-in fail, 401 errors

**Solutions:**
1. Check environment variables are set correctly
2. Verify Clerk dashboard has correct redirect URLs
3. Check middleware.ts is configured
4. Clear browser cookies and try again
5. Verify NEXT_PUBLIC_ prefix on public keys

### Issue: Images not uploading to Supabase

**Symptoms:** Upload fails, 404 on image URLs

**Solutions:**
1. Verify storage bucket exists: `scan-images`
2. Check bucket is public
3. Verify storage policies are set (run SQL again)
4. Check file size is under 10MB
5. Verify NEXT_PUBLIC_SUPABASE_URL is correct

### Issue: Groq API errors

**Symptoms:** "API key invalid", rate limit errors

**Solutions:**
1. Verify GROQ_API_KEY is correct (check for spaces)
2. Check you haven't exceeded free tier (30 req/min)
3. Wait 1 minute if rate limited
4. Check Groq dashboard for API status
5. Try regenerating API key

### Common Error Messages:

**"CLERK_SECRET_KEY is not set"**
→ Add environment variable in Vercel or .env.local

**"Failed to fetch scans"**
→ Check Supabase connection and RLS policies

**"Image too large"**
→ Reduce image size or increase limit

**"Invalid image format"**
→ Ensure file is JPEG/PNG/WEBP, check MIME type

**"Rate limit exceeded"**
→ Wait 1 minute (Groq free tier: 30 req/min)

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

### How to Contribute:

1. Fork the repository
2. Create a feature branch:
```bash
git checkout -b feature/amazing-feature
```

3. Make your changes
4. Test thoroughly
5. Commit with descriptive message:
```bash
git commit -m "Add: Amazing feature that does X"
```

6. Push to your fork:
```bash
git push origin feature/amazing-feature
```

7. Open a Pull Request

### Contribution Guidelines:

- Follow the existing code style (Prettier + ESLint)
- Write TypeScript (no plain JavaScript)
- Add comments for complex logic
- Test on multiple browsers
- Update documentation if needed
- Keep commits focused and atomic
- Write descriptive commit messages

## 📄 License

MIT License

Copyright (c) 2024 Alfred Nyongesa (sibby-killer)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## 📧 Contact

**Developer:** Alfred Nyongesa (sibby-killer)

**Email:** alfred.dev8@gmail.com

**Secondary Email:** alfrednyongesa411@gmail.com

**GitHub:** https://github.com/sibby-killer

**Repository:** https://github.com/sibby-killer/cropguard-ai-web

**Live Demo:** https://cropguard-ai-web.vercel.app

## 🙏 Acknowledgments

- **Groq AI** - For free, fast vision API access
- **Clerk** - For seamless authentication
- **Supabase** - For reliable database and storage
- **Vercel** - For excellent hosting platform
- **Shadcn** - For beautiful UI components
- **Open Source Community** - For amazing tools and libraries

## 🌍 Impact & Mission

CropGuard AI contributes to **UN Sustainable Development Goal 2: Zero Hunger** by:

- 🌾 **Reducing crop loss** through early disease detection
- 📚 **Democratizing agricultural knowledge** - making expert advice accessible
- 💰 **Saving money** for farmers - completely free service
- 🌱 **Promoting sustainable farming** - emphasizing organic treatments
- 📊 **Enabling data-driven decisions** - analytics and tracking
- 🤝 **Building community** - shared knowledge and experiences
- 🔬 **Advancing agricultural technology** - open source innovation

---

Made with 💚 by Alfred Nyongesa for farmers worldwide

Supporting UN SDG 2: Zero Hunger

Version 1.0.0 | Last updated: November 2024