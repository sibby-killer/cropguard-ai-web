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

        // Get recent scans (last 3) for the current user
        const scans = await Scan.find({ clerk_user_id: userId })
            .sort({ created_at: -1 })
            .limit(3)
            .lean()

        // Transform scans to match expected format
        const transformedScans = scans.map(scan => ({
            id: scan._id.toString(),
            disease_detected: scan.disease_detected,
            confidence: scan.confidence,
            severity: scan.severity,
            crop_type: scan.crop_type,
            created_at: scan.created_at,
            image_url: scan.image_url
        }))

        return NextResponse.json(transformedScans)

    } catch (error) {
        console.error('Recent scans API error:', error)

        return NextResponse.json(
            { success: false, error: 'Failed to fetch recent scans' },
            { status: 500 }
        )
    }
}
