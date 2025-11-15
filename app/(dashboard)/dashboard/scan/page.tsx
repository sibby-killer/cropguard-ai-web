'use client'

import { useState, useCallback, useEffect } from 'react'
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
  RotateCcw,
  Globe
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { validateImageFile, formatFileSize } from '@/lib/utils'
import { CROP_TYPES, SEVERITY_COLORS } from '@/types'
import { CurrencySelector, PriceDisplay } from '@/components/shared/currency-selector'
import { useCurrency } from '@/lib/hooks/use-currency'
import { convertPrice } from '@/lib/currency-converter'
import { 
  validatePlantImage, 
  validateCropMatch, 
  getCropSuggestions, 
  validateCustomCrop,
  SUPPORTED_CROPS,
  type ImageValidationResult,
  type CropMatchResult
} from '@/lib/image-validator'
import Image from 'next/image'
import confetti from 'canvas-confetti'

// Helper function to parse cost estimate and extract USD amount
function parseCostEstimate(costString: string): { min: number; max: number; unit: string } {
  // Parse strings like "$20-50 per acre", "$15-35 per acre for treatment", etc.
  const match = costString.match(/\$(\d+)-(\d+)\s*(.*)/)
  if (match) {
    return {
      min: parseInt(match[1]),
      max: parseInt(match[2]),
      unit: match[3].trim()
    }
  }
  
  // Fallback for other formats
  const singleMatch = costString.match(/\$(\d+)\s*(.*)/)
  if (singleMatch) {
    const amount = parseInt(singleMatch[1])
    return {
      min: amount,
      max: amount,
      unit: singleMatch[2].trim()
    }
  }
  
  return { min: 20, max: 50, unit: 'per acre' } // Default fallback
}

// Component to convert and display costs in different currencies
function CostConverter({ originalCost, currency }: { originalCost: string; currency: any }) {
  const [convertedCost, setConvertedCost] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const convertCost = async () => {
      try {
        const parsed = parseCostEstimate(originalCost)
        
        // Convert both min and max amounts
        const minConverted = await convertPrice(parsed.min, currency.code)
        const maxConverted = await convertPrice(parsed.max, currency.code)
        
        // Extract just the number from the converted price
        const minAmount = parseFloat(minConverted.replace(/[^\d.]/g, ''))
        const maxAmount = parseFloat(maxConverted.replace(/[^\d.]/g, ''))
        
        const formatted = `${currency.symbol}${Math.round(minAmount)}-${Math.round(maxAmount)} ${parsed.unit}`
        setConvertedCost(formatted)
      } catch (error) {
        console.error('Failed to convert cost:', error)
        setConvertedCost(`${currency.symbol}${originalCost.replace('$', '')}`)
      } finally {
        setIsLoading(false)
      }
    }

    convertCost()
  }, [originalCost, currency])

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 border-2 border-gray-300 border-t-primary rounded-full animate-spin"></div>
        <span className="text-sm text-gray-500">Converting...</span>
      </div>
    )
  }

  return (
    <div className="text-xl font-bold text-primary">
      {convertedCost}
    </div>
  )
}

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
  const [customCrop, setCustomCrop] = useState('')
  const [showCustomInput, setShowCustomInput] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<ScanResult | null>(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [imageValidation, setImageValidation] = useState<ImageValidationResult | null>(null)
  const [cropMatch, setCropMatch] = useState<CropMatchResult | null>(null)
  const [isValidatingImage, setIsValidatingImage] = useState(false)
  const [cropSuggestions, setCropSuggestions] = useState<string[]>([])
  const { selectedCurrency } = useCurrency()

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
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
    setImageValidation(null)
    setCropMatch(null)

    // Convert to base64 for validation
    const reader = new FileReader()
    reader.onload = async (e) => {
      const base64 = e.target?.result as string
      
      // Validate if the image contains a plant
      setIsValidatingImage(true)
      try {
        const plantValidation = await validatePlantImage(base64)
        setImageValidation(plantValidation)
        
        if (!plantValidation.isValid || !plantValidation.isPlant) {
          toast.error("This doesn't look like a plant or crop image. Please upload a clear image of a plant, fruit, or vegetable.", {
            duration: 5000
          })
        } else {
          toast.success('Image uploaded successfully!')
          
          if (plantValidation.detectedCrop) {
            // Check if detected crop matches selected crop
            const currentCrop = showCustomInput ? customCrop : cropType
            const matchResult = validateCropMatch(currentCrop, plantValidation.detectedCrop)
            setCropMatch(matchResult)
            
            if (!matchResult.matches) {
              toast.error(matchResult.message, { duration: 5000 })
            } else {
              toast.success(matchResult.message, { duration: 3000 })
            }
          }
        }
      } catch (error) {
        console.error('Image validation failed:', error)
        // Allow analysis if validation fails
        setImageValidation({
          isValid: true,
          isPlant: true,
          detectedCrop: null,
          confidence: 50,
          error: "Could not validate image"
        })
        toast.success('Image uploaded successfully!')
      } finally {
        setIsValidatingImage(false)
      }
    }
    reader.readAsDataURL(file)
  }, [cropType, customCrop, showCustomInput])

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
      
      // Use custom crop if available, otherwise use selected crop
      const finalCropType = showCustomInput && customCrop.trim() ? customCrop.trim() : cropType
      formData.append('crop_type', finalCropType)

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
              <CardTitle>Crop Type</CardTitle>
              <CardDescription>
                Select your crop type for more accurate results, or add a custom one
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!showCustomInput ? (
                <div className="space-y-3">
                  <select
                    value={cropType}
                    onChange={(e) => {
                      if (e.target.value === 'custom') {
                        setShowCustomInput(true)
                        setCustomCrop('')
                      } else {
                        setCropType(e.target.value)
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    {CROP_TYPES.map((crop) => (
                      <option key={crop} value={crop}>
                        {crop}
                      </option>
                    ))}
                    <option value="custom">➕ Add Custom Crop</option>
                  </select>
                  
                  {imageValidation?.detectedCrop && cropMatch && (
                    <div className={`p-3 rounded-lg ${
                      cropMatch.matches ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                    }`}>
                      <div className="flex items-center gap-2">
                        {cropMatch.matches ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-red-600" />
                        )}
                        <span className={`text-sm font-medium ${
                          cropMatch.matches ? 'text-green-800' : 'text-red-800'
                        }`}>
                          Detected: {imageValidation.detectedCrop}
                        </span>
                      </div>
                      <p className={`text-xs mt-1 ${
                        cropMatch.matches ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {cropMatch.message}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customCrop}
                      onChange={(e) => {
                        setCustomCrop(e.target.value)
                        if (e.target.value.length >= 2) {
                          const suggestions = getCropSuggestions(e.target.value)
                          setCropSuggestions(suggestions)
                        } else {
                          setCropSuggestions([])
                        }
                      }}
                      placeholder="Enter crop name (e.g., Mango, Avocado)"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowCustomInput(false)
                        setCustomCrop('')
                        setCropSuggestions([])
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                  
                  {cropSuggestions.length > 0 && (
                    <div className="border border-gray-200 rounded-md">
                      <div className="px-3 py-2 bg-gray-50 border-b text-xs font-medium text-gray-700">
                        Suggestions:
                      </div>
                      {cropSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setCropType(suggestion)
                            setShowCustomInput(false)
                            setCustomCrop('')
                            setCropSuggestions([])
                            toast.success(`Selected ${suggestion}`)
                          }}
                          className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 border-b last:border-b-0"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {customCrop && (
                    <div className="text-xs text-gray-600">
                      Custom crop "{customCrop}" will be analyzed with general plant disease detection.
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Validation Status */}
          {isValidatingImage && (
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="py-4">
                <div className="flex items-center gap-3">
                  <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                  <div>
                    <p className="font-medium text-blue-800">Validating Image...</p>
                    <p className="text-sm text-blue-600">Checking if image contains a plant or crop</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Error Messages */}
          {imageValidation && !imageValidation.isValid && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="py-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-red-800">Invalid Image Detected</p>
                    <p className="text-sm text-red-600 mb-2">
                      This doesn't appear to be a plant, crop, fruit, or vegetable image.
                    </p>
                    {imageValidation.suggestions && imageValidation.suggestions.length > 0 && (
                      <ul className="text-sm text-red-700 space-y-1">
                        {imageValidation.suggestions.map((suggestion, index) => (
                          <li key={index} className="flex items-start">
                            <span className="mr-2">•</span>
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Crop Mismatch Error */}
          {cropMatch && !cropMatch.matches && (
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="py-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-orange-800">Crop Mismatch Detected!</p>
                    <p className="text-sm text-orange-700">
                      {cropMatch.message}
                    </p>
                    <p className="text-xs text-orange-600 mt-1">
                      Please select the correct crop type or upload an image that matches your selection.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Analyze Button */}
          <Button
            onClick={analyzeImage}
            disabled={
              !selectedFile || 
              isAnalyzing || 
              isValidatingImage ||
              (imageValidation && !imageValidation.isValid) ||
              (cropMatch && !cropMatch.matches)
            }
            size="lg"
            className="w-full"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : isValidatingImage ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Validating...
              </>
            ) : (imageValidation && !imageValidation.isValid) ? (
              <>
                <AlertTriangle className="w-5 h-5 mr-2" />
                Upload Valid Plant Image
              </>
            ) : (cropMatch && !cropMatch.matches) ? (
              <>
                <AlertTriangle className="w-5 h-5 mr-2" />
                Fix Crop Mismatch
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
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold">Estimated Treatment Cost</h4>
                            <div className="flex items-center gap-2">
                              <Globe className="w-4 h-4 text-gray-400" />
                              <CurrencySelector className="text-xs" />
                            </div>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Original (USD):</span>
                              <span className="text-lg font-medium">{result.cost_estimate}</span>
                            </div>
                            
                            {selectedCurrency.code !== 'USD' && (
                              <div className="border-t pt-3">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm text-gray-600">
                                    In {selectedCurrency.name} ({selectedCurrency.flag}):
                                  </span>
                                </div>
                                <CostConverter 
                                  originalCost={result.cost_estimate}
                                  currency={selectedCurrency}
                                />
                              </div>
                            )}
                            
                            <div className="border-t pt-3">
                              <p className="text-sm text-gray-600">
                                Cost may vary based on farm size, location, and chosen treatment method. 
                                Consider organic alternatives for potentially lower costs.
                              </p>
                              {selectedCurrency.code !== 'USD' && (
                                <p className="text-xs text-gray-500 mt-2">
                                  * Converted using current exchange rates. Actual costs may vary.
                                </p>
                              )}
                            </div>
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