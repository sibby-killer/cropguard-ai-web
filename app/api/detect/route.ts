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
  try {
    // Verify authentication
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Parse form data
    const formData = await request.formData()
    const imageFile = formData.get('image') as File
    const cropType = (formData.get('crop_type') as string) || 'Tomato'

    if (!imageFile) {
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

    // Convert file to buffer
    const arrayBuffer = await imageFile.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Process image with Sharp
    let processedBuffer = buffer
    try {
      processedBuffer = await sharp(buffer)
        .resize(1024, 1024, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 85 })
        .toBuffer()
    } catch (error) {
      console.error('Image processing error:', error)
      // Continue with original buffer if processing fails
    }

    // Convert to base64 for AI analysis
    const base64Image = processedBuffer.toString('base64')

    // Analyze with Groq AI
    const aiResult = await detectDisease(base64Image, cropType)

    // Get detailed disease information
    const diseaseInfo = getDiseaseByName(aiResult.disease_detected)
    
    if (!diseaseInfo) {
      return NextResponse.json(
        { success: false, error: 'Disease not found in database' },
        { status: 500 }
      )
    }

    // Upload image to Cloudinary
    const fileName = `${userId}_${generateId()}`
    let imageUrl = ''
    let imagePublicId = ''
    
    try {
      const uploadResult = await db.uploadImage(processedBuffer, fileName)
      imageUrl = uploadResult.url
      imagePublicId = uploadResult.publicId
    } catch (uploadError) {
      console.error('Image upload error:', uploadError)
      imageUrl = 'https://via.placeholder.com/400x300?text=Image+Upload+Failed'
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
      description: diseaseInfo.description,
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
    console.error('Detection API error:', error)
    
    let errorMessage = 'An unexpected error occurred'
    if (error instanceof Error) {
      if (error.message.includes('rate limit')) {
        errorMessage = 'Rate limit exceeded. Please wait a moment and try again.'
      } else if (error.message.includes('API key')) {
        errorMessage = 'Service configuration error. Please contact support.'
      } else {
        errorMessage = error.message
      }
    }

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
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