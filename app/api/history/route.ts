import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import connectDB from '@/lib/mongodb'
import { Scan } from '@/lib/models/Scan'

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Connect to MongoDB
    await connectDB()

    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100)
    const offset = parseInt(searchParams.get('offset') || '0')
    const cropType = searchParams.get('crop_type') || undefined
    const severity = searchParams.get('severity') || undefined
    const search = searchParams.get('search') || undefined

    // Build MongoDB query
    let query: any = { clerk_user_id: userId }

    // Add filters if provided
    if (cropType) {
      query.crop_type = cropType
    }
    if (severity) {
      query.severity = severity
    }
    if (search) {
      query.$or = [
        { disease_detected: { $regex: search, $options: 'i' } },
        { crop_type: { $regex: search, $options: 'i' } }
      ]
    }

    // Get total count for pagination
    const total = await Scan.countDocuments(query)

    // Get scans with pagination, sorted by newest first
    const scans = await Scan.find(query)
      .sort({ created_at: -1 })
      .skip(offset)
      .limit(limit)
      .lean()

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit)
    const currentPage = Math.floor(offset / limit) + 1

    // Transform scans to match expected format
    const transformedScans = scans.map(scan => ({
      id: scan._id.toString(),
      user_id: scan.user_id,
      clerk_user_id: scan.clerk_user_id,
      image_url: scan.image_url,
      crop_type: scan.crop_type,
      disease_detected: scan.disease_detected,
      confidence: scan.confidence,
      severity: scan.severity,
      symptoms: scan.symptoms || [],
      treatment: scan.treatment || [],
      prevention: scan.prevention || [],
      organic_treatment: scan.organic_treatment || [],
      cost_estimate: scan.cost_estimate,
      scientific_name: scan.scientific_name,
      created_at: scan.created_at
    }))

    return NextResponse.json({
      success: true,
      scans: transformedScans,
      pagination: {
        total,
        page: currentPage,
        limit,
        totalPages
      }
    })

  } catch (error) {
    console.error('History API error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch scan history',
        scans: [],
        pagination: { total: 0, page: 1, limit: 50, totalPages: 0 }
      },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Verify authentication
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Connect to MongoDB
    await connectDB()

    // Parse request body
    const { scanId } = await request.json()
    
    if (!scanId) {
      return NextResponse.json(
        { success: false, error: 'Scan ID is required' },
        { status: 400 }
      )
    }

    // Delete scan from database (only if it belongs to the user)
    const result = await Scan.findOneAndDelete({
      _id: scanId,
      clerk_user_id: userId
    })

    if (!result) {
      return NextResponse.json(
        { success: false, error: 'Scan not found or unauthorized' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Scan deleted successfully'
    })

  } catch (error) {
    console.error('Delete scan API error:', error)
    
    return NextResponse.json(
      { success: false, error: 'Failed to delete scan' },
      { status: 500 }
    )
  }
}