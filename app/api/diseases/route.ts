import { NextRequest, NextResponse } from 'next/server'
import { getAllDiseases, getDiseasesByCrop, searchDiseases } from '@/lib/disease-database'
import { connectToDatabase } from '@/lib/mongodb'
import { Scan } from '@/lib/models/Scan'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const crop = searchParams.get('crop')
    const sort = searchParams.get('sort') || 'scan_count'

    // Connect to database and fetch real scan data
    await connectToDatabase()
    
    // Aggregate disease data from real user scans
    const diseaseAggregation = await Scan.aggregate([
      {
        $match: {
          disease_detected: { $ne: 'Healthy Plant' } // Exclude healthy plants
        }
      },
      {
        $group: {
          _id: '$disease_detected',
          name: { $first: '$disease_detected' },
          scan_count: { $sum: 1 },
          avg_confidence: { $avg: '$confidence' },
          crop_types: { $addToSet: '$crop_type' },
          severities: { $addToSet: '$severity' },
          latest_scan: { $max: '$created_at' },
          symptoms: { $push: '$symptoms' },
          treatments: { $push: '$treatment' },
          cost_estimates: { $addToSet: '$cost_estimate' },
          scientific_names: { $addToSet: '$scientific_name' },
          sample_images: { $push: '$image_url' }
        }
      },
      {
        $sort: { scan_count: -1, latest_scan: -1 }
      }
    ])

    // Transform aggregated data into disease format
    const realDiseases = diseaseAggregation.map(disease => ({
      name: disease.name,
      scientific_name: disease.scientific_names.find((name: string) => name && name !== 'N/A') || 'Unknown',
      description: `Real user data: Detected in ${disease.scan_count} scan${disease.scan_count > 1 ? 's' : ''} with ${Math.round(disease.avg_confidence)}% average confidence`,
      crop: disease.crop_types.length === 1 ? disease.crop_types[0] : 'Multiple Crops',
      affected_crops: disease.crop_types,
      severity: getMostCommonSeverity(disease.severities),
      symptoms: flattenAndDedupe(disease.symptoms).slice(0, 8),
      treatment: flattenAndDedupe(disease.treatments).slice(0, 5),
      cost_estimate: disease.cost_estimates.find((cost: string) => cost && cost !== 'No cost') || '$20-40 per acre',
      scan_count: disease.scan_count,
      avg_confidence: Math.round(disease.avg_confidence),
      latest_detection: disease.latest_scan,
      sample_images: disease.sample_images.filter((img: string) => img).slice(0, 3),
      isUserGenerated: true
    }))

    // Get static diseases
    let staticDiseases = getAllDiseases().map(disease => ({
      ...disease,
      isUserGenerated: false,
      scan_count: 0,
      latest_detection: null
    }))

    // Combine both datasets, prioritizing real data
    const combinedDiseases = [...realDiseases, ...staticDiseases]
    
    // Remove duplicates, keeping real data when available
    const uniqueDiseases = combinedDiseases.reduce((acc: any[], current: any) => {
      const existing = acc.find(d => d.name.toLowerCase() === current.name.toLowerCase())
      
      if (!existing) {
        acc.push(current)
      } else if (current.isUserGenerated && !existing.isUserGenerated) {
        // Replace static with real data
        const index = acc.indexOf(existing)
        acc[index] = current
      }
      
      return acc
    }, [])

    // Apply filters
    let filteredDiseases = uniqueDiseases

    if (search) {
      filteredDiseases = uniqueDiseases.filter(disease =>
        disease.name.toLowerCase().includes(search.toLowerCase()) ||
        disease.description.toLowerCase().includes(search.toLowerCase()) ||
        disease.scientific_name.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (crop && crop !== 'all') {
      filteredDiseases = filteredDiseases.filter(disease => 
        disease.crop === crop || 
        disease.crop === 'All' ||
        (disease.affected_crops && disease.affected_crops.includes(crop))
      )
    }

    // Apply sorting
    filteredDiseases.sort((a, b) => {
      switch (sort) {
        case 'scan_count':
          return (b.scan_count || 0) - (a.scan_count || 0)
        case 'severity':
          const severityOrder: { [key: string]: number } = { 'None': 0, 'Mild': 1, 'Moderate': 2, 'Severe': 3 }
          return severityOrder[b.severity] - severityOrder[a.severity]
        case 'crop':
          return a.crop.localeCompare(b.crop)
        case 'recent':
          const aDate = a.latest_detection ? new Date(a.latest_detection).getTime() : 0
          const bDate = b.latest_detection ? new Date(b.latest_detection).getTime() : 0
          return bDate - aDate
        case 'name':
        default:
          return a.name.localeCompare(b.name)
      }
    })

    return NextResponse.json({
      success: true,
      diseases: filteredDiseases,
      total: filteredDiseases.length,
      user_generated_count: realDiseases.length,
      static_count: staticDiseases.length,
      filters_applied: {
        search: search || null,
        crop: crop || null,
        sort: sort
      }
    })

  } catch (error) {
    console.error('Diseases API error:', error)
    
    // Fallback to static diseases only
    let diseases = getAllDiseases()
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const crop = searchParams.get('crop')

    if (search) {
      diseases = searchDiseases(search)
    } else if (crop && crop !== 'all') {
      diseases = getDiseasesByCrop(crop)
    }
    
    return NextResponse.json({
      success: true,
      diseases,
      total: diseases.length,
      error: 'Could not fetch real scan data, showing static diseases only',
      user_generated_count: 0,
      static_count: diseases.length
    })
  }
}

// Helper function to get most common severity
function getMostCommonSeverity(severities: string[]): string {
  if (!severities || severities.length === 0) return 'Moderate'
  
  const counts = severities.reduce((acc: any, severity: string) => {
    acc[severity] = (acc[severity] || 0) + 1
    return acc
  }, {})
  
  return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b)
}

// Helper function to flatten and deduplicate arrays
function flattenAndDedupe(arrayOfArrays: any[]): string[] {
  if (!arrayOfArrays || arrayOfArrays.length === 0) return []
  
  const flattened = arrayOfArrays.flat().filter((item: any) => item && typeof item === 'string')
  return [...new Set(flattened)]
}