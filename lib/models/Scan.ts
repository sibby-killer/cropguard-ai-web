import mongoose, { Document, Model, Schema } from 'mongoose'

export interface IScan extends Document {
  clerkUserId: string
  imageUrl: string
  imagePublicId?: string // For Cloudinary
  cropType?: string
  diseaseDetected: string
  confidence: number
  severity: 'None' | 'Mild' | 'Moderate' | 'Severe'
  symptoms: string[]
  treatment: string[]
  prevention: string[]
  organicTreatment: string[]
  costEstimate: string
  scientificName?: string
  createdAt: Date
  updatedAt: Date
}

const ScanSchema = new Schema<IScan>({
  clerkUserId: {
    type: String,
    required: true,
    index: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  imagePublicId: String, // For Cloudinary image management
  cropType: {
    type: String,
    enum: ['Tomato', 'Potato', 'Corn', 'Pepper', 'Apple', 'Grape', 'Wheat', 'Rice']
  },
  diseaseDetected: {
    type: String,
    required: true,
    index: true
  },
  confidence: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  severity: {
    type: String,
    enum: ['None', 'Mild', 'Moderate', 'Severe'],
    required: true,
    index: true
  },
  symptoms: [String],
  treatment: [String],
  prevention: [String],
  organicTreatment: [String],
  costEstimate: String,
  scientificName: String
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
})

// Create compound indexes for better query performance
ScanSchema.index({ clerkUserId: 1, createdAt: -1 })
ScanSchema.index({ clerkUserId: 1, diseaseDetected: 1 })
ScanSchema.index({ clerkUserId: 1, severity: 1 })
ScanSchema.index({ clerkUserId: 1, cropType: 1 })

// Text search index for disease names and symptoms
ScanSchema.index({
  diseaseDetected: 'text',
  symptoms: 'text',
  cropType: 'text'
})

const Scan: Model<IScan> = mongoose.models.Scan || mongoose.model<IScan>('Scan', ScanSchema)

export default Scan