import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/database'

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

    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100)
    const offset = parseInt(searchParams.get('offset') || '0')
    const cropType = searchParams.get('crop_type') || undefined
    const severity = searchParams.get('severity') || undefined
    const search = searchParams.get('search') || undefined

    // Get user scans with filters
    const { data: scans, count } = await db.getUserScans(userId, {
      limit,
      offset,
      cropType,
      severity,
      search
    })

    // Calculate pagination info
    const totalPages = Math.ceil((count || 0) / limit)
    const currentPage = Math.floor(offset / limit) + 1

    return NextResponse.json({
      success: true,
      scans: scans || [],
      pagination: {
        total: count || 0,
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

    // Parse request body
    const { scanId } = await request.json()
    
    if (!scanId) {
      return NextResponse.json(
        { success: false, error: 'Scan ID is required' },
        { status: 400 }
      )
    }

    // Delete scan from database
    await db.deleteScan(scanId, userId)

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