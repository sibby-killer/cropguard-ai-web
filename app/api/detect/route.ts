import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { detectDisease } from '@/lib/groq-client'
import { getDiseaseByName } from '@/lib/disease-database'
import { db } from '@/lib/database'
import { generateId } from '@/lib/utils'
import sharp from 'sharp'

export const runtime = 'nodejs'
export const maxDuration = 30

export async function POST(request: NextRequest) {
  console.log('🔍 API detect endpoint called')
  
  try {
    // Verify authentication
    const { userId } = auth()
    console.log('👤 User ID from auth:', userId)
    
    if (!userId) {
      console.log('❌ No user ID found - unauthorized')
      return NextResponse.json(
        { success: false, error: 'Unauthorized - please sign in' },
        { status: 401 }
      )
    }

    // Parse form data
    console.log('📋 Parsing form data...')
    const formData = await request.formData()
    const imageFile = formData.get('image') as File
    const cropType = (formData.get('crop_type') as string) || 'Tomato'

    console.log('📸 Image file:', imageFile?.name, imageFile?.size, 'bytes')
    console.log('🌾 Crop type:', cropType)

    if (!imageFile) {
      console.log('❌ No image file found in form data')
      return NextResponse.json(
        { success: false, error: 'No image file provided' },
        { status: 400 }
      )
    }

    // Validate file type and size
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/bmp', 'image/tiff']
    if (!allowedTypes.includes(imageFile.type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Please upload a valid image file.' },
        { status: 400 }
      )
    }

    const maxSize = 10 * 1024 * 1024 // 10MB
    if (imageFile.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'File size too large. Please upload an image under 10MB.' },
        { status: 400 }
      )
    }

    // Convert file to buffer and process with Sharp
    const fileBuffer = await imageFile.arrayBuffer()
    const inputBuffer = new Uint8Array(fileBuffer)
    
    let processedBuffer: Buffer
    try {
      // Process image with Sharp
      processedBuffer = await sharp(inputBuffer)
        .resize(1024, 1024, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 85 })
        .toBuffer()
    } catch (error) {
      console.error('Image processing error:', error)
      // Fallback to original buffer
      processedBuffer = Buffer.from(inputBuffer)
    }

    // Convert to base64 for AI analysis
    const base64Image = processedBuffer.toString('base64')

    // Analyze with Groq AI
    console.log('🤖 Calling Groq AI for disease detection...')
    const aiResult = await detectDisease(base64Image, cropType)
    console.log('✅ AI analysis complete:', aiResult.disease_detected, aiResult.confidence)

    // Get detailed disease information
    console.log('📚 Looking up disease info for:', aiResult.disease_detected)
    const diseaseInfo = getDiseaseByName(aiResult.disease_detected)
    
    if (!diseaseInfo) {
      console.log('❌ Disease not found in database:', aiResult.disease_detected)
      return NextResponse.json(
        { success: false, error: `Disease "${aiResult.disease_detected}" not found in database` },
        { status: 500 }
      )
    }
    console.log('✅ Disease info found:', diseaseInfo.name)

    // Upload image to Cloudinary
    const fileName = `${userId}_${generateId()}`
    let imageUrl = ''
    let imagePublicId = ''
    
    console.log('☁️ Uploading image to Cloudinary...')
    try {
      const uploadResult = await db.uploadImage(processedBuffer, fileName)
      imageUrl = uploadResult.url
      imagePublicId = uploadResult.publicId
      console.log('✅ Image uploaded successfully:', imageUrl)
    } catch (uploadError) {
      console.error('❌ Image upload error:', uploadError)
      imageUrl = 'https://via.placeholder.com/400x300?text=Image+Upload+Failed'
      console.log('⚠️ Using placeholder image URL')
    }

    // Save scan to database
    let scanRecord
    try {
      scanRecord = await db.createScan({
        clerkUserId: userId,
        imageUrl: imageUrl,
        imagePublicId: imagePublicId,
        cropType: cropType,
        diseaseDetected: aiResult.disease_detected,
        confidence: aiResult.confidence,
        severity: aiResult.severity,
        symptoms: diseaseInfo.symptoms,
        treatment: diseaseInfo.treatment,
        prevention: diseaseInfo.prevention,
        organicTreatment: diseaseInfo.organic_treatment,
        costEstimate: diseaseInfo.cost_estimate,
        scientificName: diseaseInfo.scientific_name
      })
    } catch (dbError) {
      console.error('Database error:', dbError)
      // Continue even if database save fails
      scanRecord = { id: generateId() }
    }

    // Return comprehensive response
    const response = {
      success: true,
      scan_id: scanRecord._id?.toString() || scanRecord.id,
      disease: aiResult.disease_detected,
      confidence: Math.round(aiResult.confidence * 100) / 100,
      severity: aiResult.severity,
      description: aiResult.crop_analysis || diseaseInfo.description,
      symptoms: diseaseInfo.symptoms,
      treatment: diseaseInfo.treatment,
      prevention: diseaseInfo.prevention,
      organic_treatment: diseaseInfo.organic_treatment,
      cost_estimate: diseaseInfo.cost_estimate,
      scientific_name: diseaseInfo.scientific_name,
      image_url: imageUrl,
      timestamp: new Date().toISOString(),
      crop_type: cropType
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('❌ Detection API error:', error)
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    
    let errorMessage = 'An unexpected error occurred during analysis'
    let statusCode = 500
    
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        cause: (error as any).cause
      })
      
      if (error.message.includes('rate limit')) {
        errorMessage = 'Rate limit exceeded. Please wait a moment and try again.'
        statusCode = 429
      } else if (error.message.includes('API key') || error.message.includes('authentication')) {
        errorMessage = 'Service configuration error. Please contact support.'
        statusCode = 503
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        errorMessage = 'Network error. Please check your connection and try again.'
        statusCode = 502
      } else {
        errorMessage = error.message
      }
    }

    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.message : String(error) : undefined
      },
      { status: statusCode }
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}