import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database operations
export const db = {
  // Create a new scan record
  async createScan(scanData: {
    clerk_user_id: string
    image_url: string
    crop_type?: string
    disease_detected: string
    confidence: number
    severity: string
    symptoms: string[]
    treatment: string[]
    prevention: string[]
    organic_treatment: string[]
    cost_estimate: string
    scientific_name?: string
  }) {
    const { data, error } = await supabase
      .from('scans')
      .insert([scanData])
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Get user's scans with pagination
  async getUserScans(
    clerkUserId: string,
    options: {
      limit?: number
      offset?: number
      crop_type?: string
      severity?: string
      search?: string
    } = {}
  ) {
    let query = supabase
      .from('scans')
      .select('*')
      .eq('clerk_user_id', clerkUserId)
      .order('created_at', { ascending: false })

    if (options.crop_type) {
      query = query.eq('crop_type', options.crop_type)
    }

    if (options.severity) {
      query = query.eq('severity', options.severity)
    }

    if (options.search) {
      query = query.ilike('disease_detected', `%${options.search}%`)
    }

    if (options.limit) {
      query = query.limit(options.limit)
    }

    if (options.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 50) - 1)
    }

    const { data, error, count } = await query

    if (error) throw error
    return { data, count }
  },

  // Get user statistics
  async getUserStats(clerkUserId: string) {
    const { data: scans, error } = await supabase
      .from('scans')
      .select('disease_detected, confidence, created_at')
      .eq('clerk_user_id', clerkUserId)

    if (error) throw error

    if (!scans || scans.length === 0) {
      return {
        total_scans: 0,
        last_scan_date: null,
        most_common_disease: null,
        average_confidence: 0,
        scans_by_month: [],
        disease_distribution: []
      }
    }

    // Calculate statistics
    const totalScans = scans.length
    const lastScanDate = scans[0]?.created_at
    const averageConfidence = scans.reduce((acc, scan) => acc + scan.confidence, 0) / totalScans

    // Most common disease
    const diseaseCount = scans.reduce((acc: Record<string, number>, scan) => {
      acc[scan.disease_detected] = (acc[scan.disease_detected] || 0) + 1
      return acc
    }, {})
    const mostCommonDisease = Object.entries(diseaseCount)
      .sort(([,a], [,b]) => b - a)[0]?.[0]

    // Scans by month (last 6 months)
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
    
    const scansByMonth = scans
      .filter(scan => new Date(scan.created_at) >= sixMonthsAgo)
      .reduce((acc: Record<string, number>, scan) => {
        const month = new Date(scan.created_at).toLocaleString('default', { month: 'short', year: 'numeric' })
        acc[month] = (acc[month] || 0) + 1
        return acc
      }, {})

    return {
      total_scans: totalScans,
      last_scan_date: lastScanDate,
      most_common_disease: mostCommonDisease,
      average_confidence: Math.round(averageConfidence * 100) / 100,
      scans_by_month: Object.entries(scansByMonth).map(([month, count]) => ({ month, count })),
      disease_distribution: Object.entries(diseaseCount).map(([disease, count]) => ({ disease, count }))
    }
  },

  // Delete a scan
  async deleteScan(scanId: string, clerkUserId: string) {
    const { error } = await supabase
      .from('scans')
      .delete()
      .eq('id', scanId)
      .eq('clerk_user_id', clerkUserId)

    if (error) throw error
  },

  // Upload image to storage
  async uploadImage(file: File, fileName: string) {
    const { data, error } = await supabase.storage
      .from('scan-images')
      .upload(fileName, file, {
        upsert: true,
        contentType: file.type
      })

    if (error) throw error

    const { data: { publicUrl } } = supabase.storage
      .from('scan-images')
      .getPublicUrl(fileName)

    return publicUrl
  },

  // Delete image from storage
  async deleteImage(fileName: string) {
    const { error } = await supabase.storage
      .from('scan-images')
      .remove([fileName])

    if (error) throw error
  }
}