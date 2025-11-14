export interface Scan {
  id: string
  user_id: string
  clerk_user_id: string
  image_url: string
  crop_type?: string
  disease_detected: string
  confidence: number
  severity: 'None' | 'Mild' | 'Moderate' | 'Severe'
  symptoms: string[]
  treatment: string[]
  prevention: string[]
  organic_treatment: string[]
  cost_estimate: string
  scientific_name?: string
  created_at: string
}

export interface Disease {
  name: string
  crop: string
  severity: 'None' | 'Mild' | 'Moderate' | 'Severe'
  scientific_name: string
  description: string
  symptoms: string[]
  treatment: string[]
  prevention: string[]
  organic_treatment: string[]
  cost_estimate: string
}

export interface DetectionResult {
  success: boolean
  scan_id: string
  disease: string
  confidence: number
  severity: 'None' | 'Mild' | 'Moderate' | 'Severe'
  description: string
  symptoms: string[]
  treatment: string[]
  prevention: string[]
  organic_treatment: string[]
  cost_estimate: string
  scientific_name: string
  image_url: string
  timestamp: string
}

export interface UserStats {
  total_scans: number
  last_scan_date: string | null
  most_common_disease: string | null
  average_confidence: number
  scans_by_month: { month: string; count: number }[]
  disease_distribution: { disease: string; count: number }[]
}

export interface APIResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export const CROP_TYPES = [
  'Tomato',
  'Potato', 
  'Corn',
  'Pepper',
  'Apple',
  'Grape',
  'Wheat',
  'Rice'
] as const

export type CropType = typeof CROP_TYPES[number]

export const SEVERITY_COLORS = {
  None: 'bg-green-100 text-green-800 border-green-200',
  Mild: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  Moderate: 'bg-orange-100 text-orange-800 border-orange-200',
  Severe: 'bg-red-100 text-red-800 border-red-200'
} as const