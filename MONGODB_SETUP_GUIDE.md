# 🍃 MongoDB Setup Guide for CropGuard AI

This guide will help you set up MongoDB Atlas and Cloudinary for your CropGuard AI application.

## 📋 Overview

We've switched from Supabase to MongoDB for better flexibility and performance:
- **MongoDB Atlas**: Cloud database for storing user data and scan history
- **Cloudinary**: Image storage and optimization service
- **Mongoose**: MongoDB object modeling for Node.js

## 🗄️ MongoDB Atlas Setup

### Step 1: Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Create a new project called "CropGuard AI"

### Step 2: Create Database Cluster

1. Click "Build a Database"
2. Choose **FREE** shared cluster
3. Select your preferred cloud provider and region
4. Name your cluster: `cropguard-cluster`
5. Click "Create Cluster" (takes 3-5 minutes)

### Step 3: Configure Database Access

1. **Create Database User:**
   - Go to "Database Access" in left sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Username: `cropguard-admin`
   - Password: Generate a secure password (save it!)
   - Database User Privileges: "Read and write to any database"
   - Click "Add User"

2. **Configure Network Access:**
   - Go to "Network Access" in left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Click "Confirm"

### Step 4: Get Connection String

1. Go to "Clusters" and click "Connect" on your cluster
2. Choose "Connect your application"
3. Select "Node.js" driver and version 4.1 or later
4. Copy the connection string:
   ```
   mongodb+srv://cropguard-admin:<password>@cropguard-cluster.xxxxx.mongodb.net/
   ```
5. Replace `<password>` with your actual password
6. Add database name at the end: `cropguard-ai`

**Final connection string:**
```
mongodb+srv://cropguard-admin:YOUR_PASSWORD@cropguard-cluster.xxxxx.mongodb.net/cropguard-ai
```

## 📸 Cloudinary Setup

### Step 1: Create Cloudinary Account

1. Go to [Cloudinary](https://cloudinary.com)
2. Sign up for a free account (10GB storage, 25k transformations/month)

### Step 2: Get API Credentials

1. Go to your Cloudinary Dashboard
2. Copy the following values:
   - **Cloud Name**: Found at the top of dashboard
   - **API Key**: Found in "Account Details" section
   - **API Secret**: Click "reveal" to see the secret

### Step 3: Configure Upload Settings (Optional)

1. Go to Settings > Upload
2. Configure upload presets for better organization:
   - Preset name: `cropguard-scans`
   - Folder: `cropguard-scans`
   - Resource type: `image`
   - Access mode: `public`

## 🔧 Environment Variables

Update your `.env.local` file:

```env
# Clerk Authentication (same as before)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# MongoDB Atlas
MONGODB_URI=mongodb+srv://cropguard-admin:YOUR_PASSWORD@cropguard-cluster.xxxxx.mongodb.net/cropguard-ai

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here

# Groq AI (same as before)
GROQ_API_KEY=gsk_your_groq_api_key_here

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🧪 Test Your Setup

### Test MongoDB Connection

Create a test file `test-db.js`:

```javascript
const mongoose = require('mongoose')

const MONGODB_URI = 'your_mongodb_connection_string_here'

async function testConnection() {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('✅ MongoDB connection successful!')
    
    // Test creating a document
    const testSchema = new mongoose.Schema({ test: String })
    const TestModel = mongoose.model('Test', testSchema)
    
    const doc = await TestModel.create({ test: 'Hello MongoDB!' })
    console.log('✅ Document created:', doc)
    
    await TestModel.deleteOne({ _id: doc._id })
    console.log('✅ Document deleted successfully')
    
    await mongoose.disconnect()
    console.log('✅ All tests passed!')
  } catch (error) {
    console.error('❌ Connection failed:', error)
  }
}

testConnection()
```

Run: `node test-db.js`

### Test Cloudinary Upload

Create a test file `test-cloudinary.js`:

```javascript
const cloudinary = require('cloudinary').v2

cloudinary.config({
  cloud_name: 'your_cloud_name',
  api_key: 'your_api_key',
  api_secret: 'your_api_secret'
})

async function testUpload() {
  try {
    // Test uploading a simple image URL
    const result = await cloudinary.uploader.upload(
      'https://via.placeholder.com/300x200.png',
      { folder: 'test' }
    )
    
    console.log('✅ Upload successful!')
    console.log('Image URL:', result.secure_url)
    console.log('Public ID:', result.public_id)
    
    // Clean up test image
    await cloudinary.uploader.destroy(result.public_id)
    console.log('✅ Test image deleted')
    
  } catch (error) {
    console.error('❌ Upload failed:', error)
  }
}

testUpload()
```

Run: `node test-cloudinary.js`

## 📊 Database Schema

The application will automatically create the following collections when first used:

### Users Collection
```javascript
{
  _id: ObjectId,
  clerkUserId: String (unique),
  email: String,
  firstName: String,
  lastName: String,
  imageUrl: String,
  createdAt: Date,
  lastLogin: Date
}
```

### Scans Collection
```javascript
{
  _id: ObjectId,
  clerkUserId: String,
  imageUrl: String,
  imagePublicId: String, // Cloudinary public ID
  cropType: String,
  diseaseDetected: String,
  confidence: Number,
  severity: String, // 'None', 'Mild', 'Moderate', 'Severe'
  symptoms: [String],
  treatment: [String],
  prevention: [String],
  organicTreatment: [String],
  costEstimate: String,
  scientificName: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🚀 Deploy to Vercel

When deploying to Vercel, make sure to add all environment variables:

1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Add all the variables from your `.env.local`
4. Redeploy your application

## 🔍 Monitoring & Management

### MongoDB Atlas Monitoring
- View real-time metrics in Atlas dashboard
- Set up alerts for database usage
- Monitor query performance
- View slow operations

### Cloudinary Management
- Track storage usage in dashboard
- Monitor transformation usage
- Set up delivery optimizations
- Configure auto-backup

## 🐛 Common Issues & Solutions

### Issue: "Connection failed" error
**Solution:** 
- Check your IP is whitelisted in Network Access
- Verify username and password
- Ensure database name is included in connection string

### Issue: "Cloudinary upload failed"
**Solution:**
- Verify API credentials are correct
- Check file size (free tier: 10MB limit)
- Ensure proper image format

### Issue: "Cannot read property '_id'"
**Solution:**
- Make sure MongoDB connection is established before queries
- Check that documents are being created properly

## 💡 Performance Tips

### MongoDB Optimization
- Use indexes for frequently queried fields (already set up)
- Implement proper pagination for large datasets
- Use lean() queries when you don't need full documents
- Consider aggregation for complex queries

### Cloudinary Optimization
- Use auto-format and auto-quality for images
- Implement responsive images with multiple sizes
- Use Cloudinary's CDN for fast global delivery
- Set up automatic backup and version management

## 🆘 Support

If you need help:
- MongoDB Atlas: [Documentation](https://docs.atlas.mongodb.com/)
- Cloudinary: [Documentation](https://cloudinary.com/documentation)
- Mongoose: [Documentation](https://mongoosejs.com/docs/)

---

## ✅ Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Database user configured
- [ ] Network access configured
- [ ] Connection string obtained
- [ ] Cloudinary account created
- [ ] Cloudinary credentials obtained
- [ ] Environment variables set
- [ ] Database connection tested
- [ ] Image upload tested
- [ ] Application deployed and working

**Your CropGuard AI app is now powered by MongoDB and Cloudinary!** 🎉



