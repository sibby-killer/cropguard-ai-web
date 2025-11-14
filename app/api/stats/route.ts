import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/supabase'

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

    // Get user statistics
    const stats = await db.getUserStats(userId)

    return NextResponse.json({
      success: true,
      stats
    })

  } catch (error) {
    console.error('Stats API error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch statistics',
        stats: {
          total_scans: 0,
          last_scan_date: null,
          most_common_disease: null,
          average_confidence: 0,
          scans_by_month: [],
          disease_distribution: []
        }
      },
      { status: 500 }
    )
  }
}