'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Upload, 
  Camera, 
  Loader2, 
  CheckCircle, 
  AlertTriangle,
  Download,
  Share,
  RotateCcw
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { validateImageFile, formatFileSize } from '@/lib/utils'
import { CROP_TYPES, SEVERITY_COLORS } from '@/types'
import Image from 'next/image'
import confetti from 'canvas-confetti'

interface ScanResult {
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
  crop_type: string
}

export default function ScanPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [cropType, setCropType] = useState('Tomato')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<ScanResult | null>(null)
  const [activeTab, setActiveTab] = useState('overview')

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    const validation = validateImageFile(file)
    if (!validation.valid) {
      toast.error(validation.error)
      return
    }

    setSelectedFile(file)
    setPreviewUrl(URL.createObjectURL(file))
    setResult(null)
    toast.success('Image uploaded successfully!')
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif', '.bmp', '.tiff']
    },
    multiple: false,
    maxSize: 10 * 1024 * 1024 // 10MB
  })

  const analyzeImage = async () => {
    if (!selectedFile) return

    setIsAnalyzing(true)
    setProgress(0)
    
    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + Math.random() * 20
      })
    }, 200)

    try {
      const formData = new FormData()
      formData.append('image', selectedFile)
      formData.append('crop_type', cropType)

      const response = await fetch('/api/detect', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (data.success) {
        setProgress(100)
        setTimeout(() => {
          setResult(data)
          setIsAnalyzing(false)
          
          // Show confetti for successful scan
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          })
          
          toast.success('Analysis complete!')
        }, 500)
      } else {
        throw new Error(data.error || 'Analysis failed')
      }
    } catch (error) {
      console.error('Analysis error:', error)
      toast.error(error instanceof Error ? error.message : 'Analysis failed. Please try again.')
      setIsAnalyzing(false)
    } finally {
      clearInterval(progressInterval)
    }
  }

  const resetScan = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    setResult(null)
    setProgress(0)
    setActiveTab('overview')
  }

  const tabs = [
    { id: 'overview', name: 'Overview' },
    { id: 'treatment', name: 'Treatment' },
    { id: 'prevention', name: 'Prevention' },
    { id: 'organic', name: 'Organic Options' },
    { id: 'cost', name: 'Cost Estimate' }
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          New Disease Scan
        </h1>
        <p className="text-gray-600">
          Upload a photo of your plant to get instant AI-powered disease detection and treatment recommendations.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="space-y-6">
          {/* File Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Camera className="w-5 h-5 mr-2" />
                Upload Plant Image
              </CardTitle>
              <CardDescription>
                Drag and drop or click to browse. Supports JPEG, PNG, WEBP, and more.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                {...getRootProps()}
                className={`
                  border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                  ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary'}
                  ${selectedFile ? 'border-green-300 bg-green-50' : ''}
                `}
              >
                <input {...getInputProps()} />
                
                {previewUrl ? (
                  <div className="space-y-4">
                    <div className="relative w-32 h-32 mx-auto rounded-lg overflow-hidden">
                      <Image
                        src={previewUrl}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-green-700">
                        {selectedFile?.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {selectedFile && formatFileSize(selectedFile.size)}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                    <div>
                      <p className="text-lg font-medium text-gray-700">
                        {isDragActive ? 'Drop image here' : 'Upload plant image'}
                      </p>
                      <p className="text-sm text-gray-500">
                        Or click to browse files
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Crop Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Crop Type (Optional)</CardTitle>
              <CardDescription>
                Select your crop type for more accurate results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <select
                value={cropType}
                onChange={(e) => setCropType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {CROP_TYPES.map((crop) => (
                  <option key={crop} value={crop}>
                    {crop}
                  </option>
                ))}
              </select>
            </CardContent>
          </Card>

          {/* Analyze Button */}
          <Button
            onClick={analyzeImage}
            disabled={!selectedFile || isAnalyzing}
            size="lg"
            className="w-full"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5 mr-2" />
                Analyze Disease
              </>
            )}
          </Button>

          {/* Progress */}
          <AnimatePresence>
            {isAnalyzing && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2"
              >
                <div className="flex justify-between text-sm">
                  <span>Analysis Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="w-full" />
                <p className="text-xs text-gray-500">
                  AI is examining your plant image...
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          <AnimatePresence>
            {result ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6 scan-result-enter"
              >
                {/* Main Result */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">
                        {result.disease}
                      </CardTitle>
                      <Badge className={SEVERITY_COLORS[result.severity]}>
                        {result.severity}
                      </Badge>
                    </div>
                    <CardDescription>
                      Confidence: {result.confidence}% | {result.scientific_name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center mb-4">
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Confidence Score</span>
                          <span>{result.confidence}%</span>
                        </div>
                        <Progress value={result.confidence} className="w-full" />
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Download className="w-4 h-4 mr-2" />
                        Download Report
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Share className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                      <Button variant="outline" size="sm" onClick={resetScan}>
                        <RotateCcw className="w-4 h-4 mr-2" />
                        New Scan
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Detailed Information Tabs */}
                <Card>
                  <CardHeader>
                    <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                      {tabs.map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                            activeTab === tab.id
                              ? 'bg-white text-primary shadow-sm'
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          {tab.name}
                        </button>
                      ))}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <AnimatePresence mode="wait">
                      {activeTab === 'overview' && (
                        <motion.div
                          key="overview"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="space-y-4"
                        >
                          <div>
                            <h4 className="font-semibold mb-2">Description</h4>
                            <p className="text-gray-600 text-sm">{result.description}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Symptoms Observed</h4>
                            <ul className="space-y-1">
                              {result.symptoms.slice(0, 5).map((symptom, index) => (
                                <li key={index} className="flex items-start text-sm">
                                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                                  <span className="text-gray-600">{symptom}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </motion.div>
                      )}

                      {activeTab === 'treatment' && (
                        <motion.div
                          key="treatment"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                        >
                          <h4 className="font-semibold mb-3">Recommended Treatment Steps</h4>
                          <div className="space-y-3">
                            {result.treatment.map((step, index) => (
                              <div key={index} className="flex items-start">
                                <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs mr-3 mt-0.5">
                                  {index + 1}
                                </div>
                                <p className="text-sm text-gray-600">{step}</p>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {activeTab === 'prevention' && (
                        <motion.div
                          key="prevention"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                        >
                          <h4 className="font-semibold mb-3">Prevention Tips</h4>
                          <ul className="space-y-2">
                            {result.prevention.map((tip, index) => (
                              <li key={index} className="flex items-start text-sm">
                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                                <span className="text-gray-600">{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}

                      {activeTab === 'organic' && (
                        <motion.div
                          key="organic"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                        >
                          <h4 className="font-semibold mb-3">Organic Treatment Options</h4>
                          <ul className="space-y-2">
                            {result.organic_treatment.map((treatment, index) => (
                              <li key={index} className="flex items-start text-sm">
                                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                                <span className="text-gray-600">{treatment}</span>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}

                      {activeTab === 'cost' && (
                        <motion.div
                          key="cost"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                        >
                          <h4 className="font-semibold mb-3">Estimated Treatment Cost</h4>
                          <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-2xl font-bold text-primary mb-2">{result.cost_estimate}</p>
                            <p className="text-sm text-gray-600">
                              Cost may vary based on farm size, location, and chosen treatment method. 
                              Consider organic alternatives for potentially lower costs.
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <AlertTriangle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Analysis Yet</h3>
                  <p className="text-gray-500">
                    Upload an image and click "Analyze Disease" to see detailed results here.
                  </p>
                </CardContent>
              </Card>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}