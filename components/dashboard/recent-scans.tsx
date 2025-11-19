'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Eye, Calendar, Target, Loader2, XCircle } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { SEVERITY_COLORS } from '@/types'
import Link from 'next/link'
import { useState, useEffect } from 'react'

interface Scan {
  id: string
  disease_detected: string
  confidence: number
  severity: 'None' | 'Mild' | 'Moderate' | 'Severe'
  crop_type: string
  created_at: string
  image_url: string
}

export function RecentScans() {
  const [scans, setScans] = useState<Scan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRecentScans = async () => {
      try {
        const response = await fetch('/api/scans/recent')
        if (!response.ok) {
          throw new Error('Failed to fetch scans')
        }
        const data = await response.json()
        setScans(data)
      } catch (err) {
        setError('Failed to load recent scans')
        console.error('Error fetching recent scans:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchRecentScans()
  }, [])

  if (loading) {
    return (
      <div className="text-center py-8">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">Loading recent scans...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        <XCircle className="w-8 h-8 mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">Error</h3>
        <p>{error}</p>
      </div>
    )
  }

  if (scans.length === 0) {
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
      {scans.map((scan) => (
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