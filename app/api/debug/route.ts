import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

export async function GET() {
  try {
    const { userId } = auth()
    
    // Check basic environment setup
    const debug = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      vercel_env: process.env.VERCEL_ENV,
      
      // Environment variables presence (don't expose values)
      env_vars: {
        groq_api_key: {
          present: !!process.env.GROQ_API_KEY,
          length: process.env.GROQ_API_KEY?.length || 0,
          starts_with_gsk: process.env.GROQ_API_KEY?.startsWith('gsk_') || false
        },
        mongodb_uri: {
          present: !!process.env.MONGODB_URI,
          length: process.env.MONGODB_URI?.length || 0,
          starts_with_mongodb: process.env.MONGODB_URI?.startsWith('mongodb') || false
        },
        cloudinary: {
          cloud_name: !!process.env.CLOUDINARY_CLOUD_NAME,
          api_key: !!process.env.CLOUDINARY_API_KEY,
          api_secret: !!process.env.CLOUDINARY_API_SECRET
        }
      },
      
      // Authentication check
      auth: {
        user_id: userId,
        authenticated: !!userId
      }
    }
    
    // Test basic Groq connection without making actual API call
    let groq_basic_test = false
    try {
      const Groq = require('groq-sdk')
      const groq = new Groq({
        apiKey: process.env.GROQ_API_KEY!,
      })
      groq_basic_test = true
    } catch (error) {
      console.error('Groq initialization error:', error)
    }
    
    return NextResponse.json({
      status: 'debug_info',
      ...debug,
      groq_initialization: groq_basic_test,
      recommendations: [
        ...(debug.env_vars.groq_api_key.length === 0 ? ['❌ GROQ_API_KEY is missing'] : []),
        ...(debug.env_vars.groq_api_key.present && !debug.env_vars.groq_api_key.starts_with_gsk ? ['❌ GROQ_API_KEY should start with gsk_'] : []),
        ...(debug.env_vars.mongodb_uri.length === 0 ? ['❌ MONGODB_URI is missing'] : []),
        ...(debug.env_vars.mongodb_uri.present && !debug.env_vars.mongodb_uri.starts_with_mongodb ? ['❌ MONGODB_URI should start with mongodb://'] : []),
        ...(!debug.env_vars.cloudinary.cloud_name ? ['❌ CLOUDINARY_CLOUD_NAME is missing'] : []),
        ...(!debug.env_vars.cloudinary.api_key ? ['❌ CLOUDINARY_API_KEY is missing'] : []),
        ...(!debug.env_vars.cloudinary.api_secret ? ['❌ CLOUDINARY_API_SECRET is missing'] : []),
      ]
    })
    
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}