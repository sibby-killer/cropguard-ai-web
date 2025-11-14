// Simple test to check if the API is working
const fs = require('fs')
const path = require('path')

async function testAPI() {
  console.log('🧪 Testing CropGuard AI API...')
  
  const apiUrl = 'https://cropguard-ai-web.vercel.app'
  
  try {
    // Test 1: Health check
    console.log('\n1️⃣ Testing health endpoint...')
    const healthResponse = await fetch(`${apiUrl}/api/health`)
    const healthData = await healthResponse.json()
    
    console.log('Health Status:', healthData.status)
    console.log('Services Status:')
    console.log('  - Groq AI:', healthData.checks?.services?.groq ? '✅' : '❌')
    console.log('  - MongoDB:', healthData.checks?.services?.mongodb ? '✅' : '❌')
    console.log('  - Cloudinary:', healthData.checks?.services?.cloudinary ? '✅' : '❌')
    
    console.log('Environment Variables:')
    Object.entries(healthData.checks?.environment_variables || {}).forEach(([key, value]) => {
      console.log(`  - ${key}:`, value ? '✅' : '❌')
    })
    
    if (healthData.recommendations && healthData.recommendations.length > 0) {
      console.log('\n⚠️ Recommendations:')
      healthData.recommendations.forEach(rec => console.log(`  - ${rec}`))
    }
    
    // Test 2: Check if we can reach the detect endpoint (without auth)
    console.log('\n2️⃣ Testing detect endpoint accessibility...')
    const detectResponse = await fetch(`${apiUrl}/api/detect`, {
      method: 'POST',
      body: new FormData() // Empty form data
    })
    
    console.log('Detect endpoint status:', detectResponse.status)
    
    if (detectResponse.status === 401) {
      console.log('✅ Detect endpoint requires authentication (expected)')
    } else if (detectResponse.status === 400) {
      console.log('✅ Detect endpoint validates input (expected)')
    } else {
      console.log('❓ Unexpected response from detect endpoint')
    }
    
    // Test 3: Check if the app loads
    console.log('\n3️⃣ Testing main app...')
    const appResponse = await fetch(apiUrl)
    console.log('Main app status:', appResponse.status === 200 ? '✅ Loading' : '❌ Failed')
    
    console.log('\n📊 Test Summary:')
    console.log('- Health endpoint:', healthResponse.status === 200 ? '✅' : '❌')
    console.log('- Services health:', healthData.status === 'healthy' ? '✅' : '⚠️ Issues detected')
    console.log('- App accessibility:', appResponse.status === 200 ? '✅' : '❌')
    
    if (healthData.status !== 'healthy') {
      console.log('\n🔧 Action needed:')
      console.log('Some services are not working properly. Check environment variables in Vercel.')
    } else {
      console.log('\n🎉 All services appear healthy!')
      console.log('If you\'re still getting "failed to analyse image", try:')
      console.log('1. Sign out and sign back in')
      console.log('2. Try a different image (JPEG, under 10MB)')
      console.log('3. Check browser console for new detailed error messages')
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
    console.log('\nThis suggests the API is not accessible or has fundamental issues.')
  }
}

// Run the test
testAPI()