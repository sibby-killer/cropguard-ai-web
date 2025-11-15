'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, Filter, Book } from 'lucide-react'
import { motion } from 'framer-motion'
import { SEVERITY_COLORS, CROP_TYPES } from '@/types'
import { getAllDiseases } from '@/lib/disease-database'

export default function DiseasesPage() {
  const [diseases, setDiseases] = useState<any[]>([])
  const [filteredDiseases, setFilteredDiseases] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCrop, setSelectedCrop] = useState('')
  const [selectedDisease, setSelectedDisease] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDiseaseData()
  }, [])

  useEffect(() => {
    filterDiseases()
  }, [searchTerm, selectedCrop, diseases])

  const fetchDiseaseData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Fetch disease data from API (includes both static and user-generated data)
      const response = await fetch('/api/diseases')
      
      if (!response.ok) {
        throw new Error('Failed to fetch disease data')
      }
      
      const data = await response.json()
      
      if (data.success) {
        // Use the combined diseases from the API
        setDiseases(data.diseases || [])
      } else {
        throw new Error(data.error || 'Failed to load diseases')
      }
      
    } catch (error) {
      console.error('Error fetching disease data:', error)
      setError('Failed to load disease database. Please try again.')
      
      // Fallback to static diseases only
      try {
        const staticDiseases = getAllDiseases()
        setDiseases(staticDiseases.map(disease => ({
          ...disease,
          isUserGenerated: false,
          scan_count: 0
        })))
      } catch (staticError) {
        console.error('Error loading static diseases:', staticError)
        setDiseases([])
      }
    } finally {
      setLoading(false)
    }
  }

  const filterDiseases = () => {
    let filtered = diseases

    if (searchTerm) {
      filtered = filtered.filter(disease =>
        disease.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        disease.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedCrop) {
      filtered = filtered.filter(disease => 
        disease.crop === selectedCrop || disease.crop === 'All'
      )
    }

    setFilteredDiseases(filtered)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Disease Database
        </h1>
        <p className="text-gray-600">
          Comprehensive information about plant diseases, symptoms, and treatments.
        </p>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Search & Filter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search diseases..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

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
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {loading && (
        <Card className="text-center py-12">
          <CardContent>
            <div className="flex items-center justify-center mb-4">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-gray-600">Loading disease database...</p>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && !loading && (
        <Card className="text-center py-12 border-red-200 bg-red-50">
          <CardContent>
            <div className="text-red-600 mb-4">
              <Book className="w-16 h-16 mx-auto mb-2" />
              <h3 className="text-lg font-medium">Error Loading Database</h3>
            </div>
            <p className="text-red-700 mb-4">{error}</p>
            <Button onClick={fetchDiseaseData} variant="outline">
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Disease List */}
          <div className="lg:col-span-2">
            <div className="grid gap-4">
              {filteredDiseases.map((disease, index) => (
              <motion.div
                key={disease.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card 
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedDisease(disease)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-lg">{disease.name}</h3>
                      <Badge className={SEVERITY_COLORS[disease.severity]}>
                        {disease.severity}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-4 mb-2">
                      <Badge variant="secondary">{disease.crop}</Badge>
                      <span className="text-sm text-gray-500 italic">
                        {disease.scientific_name}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {disease.description}
                    </p>
                    
                    <div className="mt-3">
                      <Button variant="outline" size="sm">
                        <Book className="w-4 h-4 mr-1" />
                        Learn More
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredDiseases.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <Book className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No diseases found
                </h3>
                <p className="text-gray-500">
                  Try adjusting your search criteria or browse all diseases.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Disease Details */}
        <div className="lg:col-span-1">
          {selectedDisease ? (
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {selectedDisease.name}
                  <Badge className={SEVERITY_COLORS[selectedDisease.severity]}>
                    {selectedDisease.severity}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  {selectedDisease.scientific_name}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-2">Description</h4>
                  <p className="text-sm text-gray-600">{selectedDisease.description}</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Symptoms</h4>
                  <ul className="space-y-1">
                    {selectedDisease.symptoms.slice(0, 5).map((symptom: string, index: number) => (
                      <li key={index} className="flex items-start text-sm">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                        <span className="text-gray-600">{symptom}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Treatment</h4>
                  <ul className="space-y-1">
                    {selectedDisease.treatment.slice(0, 3).map((step: string, index: number) => (
                      <li key={index} className="flex items-start text-sm">
                        <div className="w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center text-xs mr-2 mt-0.5">
                          {index + 1}
                        </div>
                        <span className="text-gray-600">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Cost Estimate</h4>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-lg font-bold text-primary">{selectedDisease.cost_estimate}</p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Button className="w-full">
                    View Complete Guide
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <Book className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Select a Disease
                </h3>
                <p className="text-gray-500">
                  Click on any disease from the list to view detailed information.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}