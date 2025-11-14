import { NextResponse } from 'next/server'
import { testGroqConnection } from '@/lib/groq-client'

export async function GET() {
  try {
    console.log('🔍 Health check started')
    
    const checks = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      services: {
        groq: false,
        mongodb: false,
        cloudinary: false
      },
      environment_variables: {
        groq_api_key: !!process.env.GROQ_API_KEY,
        mongodb_uri: !!process.env.MONGODB_URI,
        cloudinary_cloud_name: !!process.env.CLOUDINARY_CLOUD_NAME,
        cloudinary_api_key: !!process.env.CLOUDINARY_API_KEY,
        cloudinary_api_secret: !!process.env.CLOUDINARY_API_SECRET
      }
    }

    // Test Groq connection
    try {
      checks.services.groq = await testGroqConnection()
      console.log('✅ Groq connection:', checks.services.groq)
    } catch (error) {
      console.error('❌ Groq connection failed:', error)
    }

    // Test MongoDB connection
    try {
      const { default: connectDB } = await import('@/lib/mongodb')
      await connectDB()
      checks.services.mongodb = true
      console.log('✅ MongoDB connection successful')
    } catch (error) {
      console.error('❌ MongoDB connection failed:', error)
    }

    // Test Cloudinary
    try {
      const cloudinary = await import('cloudinary')
      const result = await cloudinary.v2.api.ping()
      checks.services.cloudinary = result.status === 'ok'
      console.log('✅ Cloudinary connection:', checks.services.cloudinary)
    } catch (error) {
      console.error('❌ Cloudinary connection failed:', error)
    }

    const allServicesHealthy = Object.values(checks.services).every(status => status)
    const allEnvVarsPresent = Object.values(checks.environment_variables).every(present => present)

    console.log('📊 Health check summary:', {
      services: checks.services,
      env_vars: checks.environment_variables,
      overall_healthy: allServicesHealthy && allEnvVarsPresent
    })

    return NextResponse.json({
      status: allServicesHealthy && allEnvVarsPresent ? 'healthy' : 'degraded',
      checks,
      recommendations: allServicesHealthy && allEnvVarsPresent ? [] : [
        ...(!allEnvVarsPresent ? ['Check environment variables configuration'] : []),
        ...(!checks.services.groq ? ['Verify Groq AI API key and connection'] : []),
        ...(!checks.services.mongodb ? ['Check MongoDB connection string and network access'] : []),
        ...(!checks.services.cloudinary ? ['Verify Cloudinary credentials'] : [])
      ]
    }, {
      status: allServicesHealthy && allEnvVarsPresent ? 200 : 503
    })

  } catch (error) {
    console.error('❌ Health check failed:', error)
    
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, {
      status: 500
    })
  }
}