'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  Filter, 
  Calendar,
  Download,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  FileX
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { formatDate } from '@/lib/utils'
import { SEVERITY_COLORS, CROP_TYPES } from '@/types'
import type { Scan } from '@/types'
import Image from 'next/image'


export default function HistoryPage() {
  const [scans, setScans] = useState<Scan[]>([])
  const [filteredScans, setFilteredScans] = useState<Scan[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCrop, setSelectedCrop] = useState('')
  const [selectedSeverity, setSelectedSeverity] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const itemsPerPage = 12
  const totalPages = Math.ceil(filteredScans.length / itemsPerPage)
  const paginatedScans = filteredScans.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Fetch real scan history on component mount
  useEffect(() => {
    fetchScanHistory()
  }, [])

  // Filter scans when search/filter criteria change
  useEffect(() => {
    filterScans()
  }, [searchTerm, selectedCrop, selectedSeverity, scans])

  const fetchScanHistory = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/history')
      if (!response.ok) {
        throw new Error('Failed to fetch scan history')
      }
      
      const data = await response.json()
      setScans(data.scans || [])
    } catch (error) {
      console.error('Error fetching scan history:', error)
      setError('Failed to load scan history. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const filterScans = () => {
    let filtered = scans

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(scan =>
        scan.disease_detected.toLowerCase().includes(searchTerm.toLowerCase()) ||
        scan.crop_type?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Crop filter
    if (selectedCrop) {
      filtered = filtered.filter(scan => scan.crop_type === selectedCrop)
    }

    // Severity filter
    if (selectedSeverity) {
      filtered = filtered.filter(scan => scan.severity === selectedSeverity)
    }

    setFilteredScans(filtered)
    setCurrentPage(1) // Reset to first page when filtering
  }

  const deleteScan = async (scanId: string) => {
    if (!confirm('Are you sure you want to delete this scan?')) return

    try {
      setLoading(true)
      
      const response = await fetch('/api/history', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scanId })
      })

      if (response.ok) {
        setScans(scans.filter(scan => scan.id !== scanId))
        toast.success('Scan deleted successfully')
      } else {
        throw new Error('Failed to delete scan')
      }
    } catch (error) {
      toast.error('Failed to delete scan')
    } finally {
      setLoading(false)
    }
  }

  const exportToCSV = () => {
    const csvContent = [
      ['Date', 'Crop', 'Disease', 'Severity', 'Confidence', 'Cost Estimate'].join(','),
      ...filteredScans.map(scan => [
        formatDate(scan.created_at),
        scan.crop_type || 'Unknown',
        scan.disease_detected,
        scan.severity,
        `${scan.confidence}%`,
        scan.cost_estimate
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `cropguard-scan-history-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
    
    toast.success('Scan history exported successfully')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Scan History
        </h1>
        <p className="text-gray-600">
          View and manage your past crop disease scans and results.
        </p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search diseases or crops..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Crop filter */}
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">All Crops</option>
              {CROP_TYPES.map(crop => (
                <option key={crop} value={crop}>{crop}</option>
              ))}
            </select>

            {/* Severity filter */}
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">All Severities</option>
              <option value="None">None (Healthy)</option>
              <option value="Mild">Mild</option>
              <option value="Moderate">Moderate</option>
              <option value="Severe">Severe</option>
            </select>

            {/* Export button */}
            <Button onClick={exportToCSV} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="mb-6">
        <p className="text-sm text-gray-600">
          Showing {paginatedScans.length} of {filteredScans.length} scans
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <Card className="text-center py-12">
          <CardContent>
            <div className="flex items-center justify-center mb-4">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-gray-600">Loading your scan history...</p>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && !loading && (
        <Card className="text-center py-12 border-red-200 bg-red-50">
          <CardContent>
            <div className="text-red-600 mb-4">
              <FileX className="w-16 h-16 mx-auto mb-2" />
              <h3 className="text-lg font-medium">Error Loading History</h3>
            </div>
            <p className="text-red-700 mb-4">{error}</p>
            <Button onClick={fetchScanHistory} variant="outline">
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Scans Grid */}
      <AnimatePresence mode="wait">
        {!loading && !error && filteredScans.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="text-center py-12">
              <CardContent>
                <FileX className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {scans.length === 0 ? 'No scans yet' : 'No scans match your filters'}
                </h3>
                <p className="text-gray-500 mb-6">
                  {scans.length === 0 
                    ? 'Upload your first plant image to get started with disease detection.'
                    : 'Try adjusting your search criteria or clear the filters.'
                  }
                </p>
                {scans.length === 0 && (
                  <Button>
                    Start Your First Scan
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedScans.map((scan, index) => (
              <motion.div
                key={scan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                  {/* Image */}
                  <div className="relative h-48 bg-gradient-to-br from-green-50 to-emerald-50">
                    {scan.image_url ? (
                      <Image
                        src={scan.image_url}
                        alt={`${scan.crop_type} - ${scan.disease_detected}`}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          // Fallback to placeholder on error
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                        }}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-2">
                            <span className="text-lg font-bold text-primary">
                              {scan.crop_type?.substring(0, 2) || 'PL'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{scan.crop_type}</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Confidence badge */}
                    <div className="absolute top-3 right-3">
                      <Badge variant="secondary" className="bg-white/90">
                        {scan.confidence}%
                      </Badge>
                    </div>
                    
                    {/* Crop type overlay */}
                    <div className="absolute bottom-3 left-3">
                      <Badge variant="outline" className="bg-white/90">
                        {scan.crop_type}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    {/* Disease name and severity */}
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {scan.disease_detected}
                      </h3>
                      <Badge className={SEVERITY_COLORS[scan.severity]}>
                        {scan.severity}
                      </Badge>
                    </div>

                    {/* Scientific name */}
                    {scan.scientific_name && scan.scientific_name !== 'N/A' && (
                      <p className="text-xs text-gray-500 italic mb-2">
                        {scan.scientific_name}
                      </p>
                    )}

                    {/* Date */}
                    <div className="flex items-center text-xs text-gray-500 mb-4">
                      <Calendar className="w-3 h-3 mr-1" />
                      {formatDate(scan.created_at)}
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteScan(scan.id)}
                        disabled={loading}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          {[...Array(totalPages)].map((_, i) => (
            <Button
              key={i}
              variant={currentPage === i + 1 ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </Button>
          ))}
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  )
}