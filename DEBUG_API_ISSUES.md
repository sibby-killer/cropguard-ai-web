# 🔍 Debug API Issues - CropGuard AI

## 🚨 Current Issues Analysis

Based on the console errors, here are the main problems:

### **1. API Detect Endpoint Returning 500 Error**
- `/api/detect` is failing with internal server error
- Need to check logs to see exact failure point

### **2. Missing Manifest File** ✅ FIXED
- Added `public/manifest.json` for PWA functionality

### **3. Deprecated Clerk Props** ✅ FIXED  
- Updated `redirectUrl` → `fallbackRedirectUrl`
- Updated `signUpUrl` → `signUpFallbackRedirectUrl`

### **4. Development Keys Warning**
- Using development Clerk keys (expected for testing)

## 🔧 Debugging Steps

### **Step 1: Check Service Health**
Visit this URL to check all services:
```
https://cropguard-ai-web.vercel.app/api/health
```

This will show:
- ✅/❌ Groq AI connection
- ✅/❌ MongoDB connection  
- ✅/❌ Cloudinary connection
- ✅/❌ Environment variables

### **Step 2: Check Vercel Logs**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your CropGuard AI project
3. Go to "Functions" tab
4. Click on `/api/detect` function
5. View real-time logs

### **Step 3: Test Each Service Individually**

#### **Test Groq AI:**
```bash
curl -X POST https://api.groq.com/openai/v1/chat/completions \
  -H "Authorization: Bearer YOUR_GROQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"test"}],"model":"llama-3.2-90b-vision-preview","max_tokens":10}'
```

#### **Test MongoDB:**
Check connection string format:
```
mongodb+srv://username:password@cluster.mongodb.net/cropguard-ai
```

#### **Test Cloudinary:**
```bash
curl -X GET https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/resources/image \
  -u "YOUR_API_KEY:YOUR_API_SECRET"
```

## 🔍 Most Likely Issues

### **1. Environment Variables Missing**
Check Vercel dashboard has all required variables:
```
GROQ_API_KEY=gsk_...
MONGODB_URI=mongodb+srv://...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

### **2. Groq API Key Invalid**
- Copy-paste error in API key
- API key disabled/expired
- Rate limiting (30 requests/minute on free tier)

### **3. MongoDB Connection Issues**
- Wrong connection string format
- IP address not whitelisted
- Network access restrictions
- Invalid credentials

### **4. TypeScript/Import Issues**
- Module import failures
- Sharp library issues on Vercel
- Missing dependencies

## 🚀 Quick Fixes to Try

### **Fix 1: Check Environment Variables**
```bash
# In Vercel Dashboard, verify all env vars are set:
echo $GROQ_API_KEY
echo $MONGODB_URI  
echo $CLOUDINARY_CLOUD_NAME
```

### **Fix 2: Regenerate API Keys**
1. **Groq:** Generate new API key at console.groq.com
2. **MongoDB:** Check connection string format
3. **Cloudinary:** Verify all 3 credentials

### **Fix 3: Test Locally First**
```bash
# Test locally with your .env.local
npm run dev

# Try uploading an image
# Check console for detailed error logs
```

### **Fix 4: Simplified Error Test**
Add this temporary test endpoint to identify the issue:

```typescript
// app/api/test-detect/route.ts
import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

export async function POST() {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Test each service one by one
    const tests = {
      auth: !!userId,
      groq_key: !!process.env.GROQ_API_KEY,
      mongodb_uri: !!process.env.MONGODB_URI,
      cloudinary: !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY)
    }

    return NextResponse.json({
      success: true,
      userId,
      tests,
      environment: process.env.NODE_ENV
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
```

## 📊 Expected Behavior

### **Working Flow:**
```
1. User uploads image ✅
2. Frontend calls /api/detect ✅  
3. Backend authenticates user ✅
4. Parse form data ✅
5. Process image with Sharp ❌ (likely failing here)
6. Call Groq AI ❌
7. Save to MongoDB ❌
8. Return result ❌
```

### **Error Location:**
Most likely failing at step 5 (Sharp processing) or step 6 (Groq AI call).

## 🎯 Action Plan

1. **✅ Check /api/health endpoint** - See which services are failing
2. **🔍 Check Vercel function logs** - See exact error message
3. **⚡ Test simplified endpoint** - Isolate the failing component
4. **🔧 Fix specific issue** - Address root cause
5. **✅ Test end-to-end** - Verify complete functionality

## 📞 Next Steps

After deploying these debugging improvements:

1. **Visit the health endpoint** to see service status
2. **Check Vercel logs** for detailed error information  
3. **Let me know the specific error** from the logs
4. **I'll provide targeted fix** based on the exact issue

The detailed logging will now show exactly where the API is failing, making it much easier to fix! 🔧✨