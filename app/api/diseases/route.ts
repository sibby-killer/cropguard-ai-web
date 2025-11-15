import { NextRequest, NextResponse } from 'next/server'
import { getAllDiseases, getDiseasesByCrop, searchDiseases } from '@/lib/disease-database'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const crop = searchParams.get('crop')
    const sort = searchParams.get('sort') || 'name'

    let diseases = getAllDiseases()

    // Apply filters
    if (search) {
      diseases = searchDiseases(search)
    } else if (crop) {
      diseases = getDiseasesByCrop(crop)
    }

    // Apply sorting
    diseases.sort((a, b) => {
      switch (sort) {
        case 'severity':
          const severityOrder = { 'None': 0, 'Mild': 1, 'Moderate': 2, 'Severe': 3 }
          return severityOrder[b.severity] - severityOrder[a.severity]
        case 'crop':
          return a.crop.localeCompare(b.crop)
        case 'name':
        default:
          return a.name.localeCompare(b.name)
      }
    })

    return NextResponse.json({
      success: true,
      diseases,
      total: diseases.length
    })

  } catch (error) {
    console.error('Diseases API error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch diseases',
        diseases: [],
        total: 0
      },
      { status: 500 }
    )
  }
}