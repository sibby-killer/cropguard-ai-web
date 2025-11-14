'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Eye, Calendar, Target } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { SEVERITY_COLORS } from '@/types'
import Link from 'next/link'

// Mock data - replace with real data from API
const mockScans = [
  {
    id: '1',
    disease_detected: 'Early Blight',
    confidence: 94.5,
    severity: 'Moderate' as const,
    crop_type: 'Tomato',
    created_at: '2024-11-10T10:30:00Z',
    image_url: '/placeholder-plant.jpg'
  },
  {
    id: '2',
    disease_detected: 'Healthy Plant',
    confidence: 98.2,
    severity: 'None' as const,
    crop_type: 'Potato',
    created_at: '2024-11-08T14:15:00Z',
    image_url: '/placeholder-plant.jpg'
  },
  {
    id: '3',
    disease_detected: 'Late Blight',
    confidence: 91.7,
    severity: 'Severe' as const,
    crop_type: 'Tomato',
    created_at: '2024-11-05T09:45:00Z',
    image_url: '/placeholder-plant.jpg'
  }
]

export function RecentScans() {
  if (mockScans.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Target className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No scans yet</h3>
        <p className="text-gray-500 mb-4">Upload your first plant image to get started</p>
        <Button asChild>
          <Link href="/dashboard/scan">Start Your First Scan</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {mockScans.map((scan) => (
        <div
          key={scan.id}
          className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center space-x-4">
            {/* Image placeholder */}
            <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center">
              <span className="text-xs font-medium text-green-700">
                {scan.crop_type.substring(0, 2)}
              </span>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h4 className="text-sm font-medium text-gray-900 truncate">
                  {scan.disease_detected}
                </h4>
                <Badge 
                  variant={scan.severity === 'None' ? 'success' : 'default'}
                  className={SEVERITY_COLORS[scan.severity]}
                >
                  {scan.severity}
                </Badge>
              </div>
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <span className="flex items-center">
                  <Target className="w-3 h-3 mr-1" />
                  {scan.confidence}% confidence
                </span>
                <span className="flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  {formatDate(scan.created_at)}
                </span>
                <span>{scan.crop_type}</span>
              </div>
            </div>
          </div>

          <Button variant="ghost" size="sm" asChild>
            <Link href={`/dashboard/history?scan=${scan.id}`}>
              <Eye className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      ))}

      <div className="text-center pt-2">
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/history">View All Scans</Link>
        </Button>
      </div>
    </div>
  )
}