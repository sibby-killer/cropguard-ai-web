import connectDB from './mongodb'
import User, { IUser } from './models/User'
import Scan, { IScan } from './models/Scan'
import { uploadImage, deleteImage } from './cloudinary'

// Database operations using MongoDB
export const db = {
  // Ensure user exists in database
  async ensureUser(userData: {
    clerkUserId: string
    email: string
    firstName?: string
    lastName?: string
    imageUrl?: string
  }) {
    await connectDB()
    
    const user = await User.findOneAndUpdate(
      { clerkUserId: userData.clerkUserId },
      {
        ...userData,
        lastLogin: new Date()
      },
      { 
        upsert: true, 
        new: true,
        setDefaultsOnInsert: true
      }
    )
    
    return user
  },

  // Create a new scan record
  async createScan(scanData: {
    clerkUserId: string
    imageUrl: string
    imagePublicId?: string
    cropType?: string
    diseaseDetected: string
    confidence: number
    severity: string
    symptoms: string[]
    treatment: string[]
    prevention: string[]
    organicTreatment: string[]
    costEstimate: string
    scientificName?: string
  }) {
    await connectDB()
    
    const scan = new Scan(scanData)
    await scan.save()
    
    return scan.toObject()
  },

  // Get user's scans with pagination
  async getUserScans(
    clerkUserId: string,
    options: {
      limit?: number
      offset?: number
      cropType?: string
      severity?: string
      search?: string
    } = {}
  ) {
    await connectDB()

    const {
      limit = 50,
      offset = 0,
      cropType,
      severity,
      search
    } = options

    // Build query
    const query: any = { clerkUserId }

    if (cropType) {
      query.cropType = cropType
    }

    if (severity) {
      query.severity = severity
    }

    if (search) {
      query.$or = [
        { diseaseDetected: { $regex: search, $options: 'i' } },
        { cropType: { $regex: search, $options: 'i' } }
      ]
    }

    // Execute query with pagination
    const [scans, total] = await Promise.all([
      Scan.find(query)
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit)
        .lean(),
      Scan.countDocuments(query)
    ])

    return { 
      data: scans.map(scan => ({
        ...scan,
        id: scan._id.toString(),
        created_at: scan.createdAt
      })), 
      count: total 
    }
  },

  // Get user statistics
  async getUserStats(clerkUserId: string) {
    await connectDB()

    const scans = await Scan.find({ clerkUserId })
      .select('diseaseDetected confidence createdAt')
      .lean()

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
    const lastScanDate = scans[0]?.createdAt?.toISOString()
    const averageConfidence = scans.reduce((acc, scan) => acc + scan.confidence, 0) / totalScans

    // Most common disease
    const diseaseCount = scans.reduce((acc: Record<string, number>, scan) => {
      acc[scan.diseaseDetected] = (acc[scan.diseaseDetected] || 0) + 1
      return acc
    }, {})
    
    const mostCommonDisease = Object.entries(diseaseCount)
      .sort(([,a], [,b]) => (b as number) - (a as number))[0]?.[0]

    // Scans by month (last 6 months)
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
    
    const scansByMonth = scans
      .filter(scan => new Date(scan.createdAt) >= sixMonthsAgo)
      .reduce((acc: Record<string, number>, scan) => {
        const month = new Date(scan.createdAt).toLocaleString('default', { 
          month: 'short', 
          year: 'numeric' 
        })
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
    await connectDB()
    
    const scan = await Scan.findOne({ 
      _id: scanId, 
      clerkUserId 
    })
    
    if (!scan) {
      throw new Error('Scan not found')
    }

    // Delete image from Cloudinary if exists
    if (scan.imagePublicId) {
      try {
        await deleteImage(scan.imagePublicId)
      } catch (error) {
        console.error('Error deleting image:', error)
        // Continue with scan deletion even if image delete fails
      }
    }

    await Scan.deleteOne({ _id: scanId, clerkUserId })
  },

  // Upload image to Cloudinary
  async uploadImage(file: Buffer, fileName: string) {
    try {
      const result = await uploadImage(file, {
        public_id: fileName,
        folder: 'cropguard-scans'
      })
      
      return {
        url: result.secure_url,
        publicId: result.public_id
      }
    } catch (error) {
      console.error('Image upload error:', error)
      throw new Error('Failed to upload image')
    }
  },

  // Delete image from Cloudinary
  async deleteImageByPublicId(publicId: string) {
    try {
      await deleteImage(publicId)
    } catch (error) {
      console.error('Error deleting image:', error)
      // Don't throw error for delete failures
    }
  }
}