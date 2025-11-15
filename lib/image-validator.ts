/**
 * Image validation utilities for crop detection and analysis
 */

export interface ImageValidationResult {
  isValid: boolean
  isPlant: boolean
  detectedCrop: string | null
  confidence: number
  error?: string
  suggestions?: string[]
}

export interface CropMatchResult {
  matches: boolean
  selectedCrop: string
  detectedCrop: string
  confidence: number
  message: string
}

// Common crops and their aliases for better matching
const CROP_ALIASES: { [key: string]: string[] } = {
  'Tomato': ['tomato', 'tomatoes', 'cherry tomato', 'beefsteak tomato'],
  'Apple': ['apple', 'apples', 'red apple', 'green apple', 'granny smith'],
  'Banana': ['banana', 'bananas', 'plantain', 'cooking banana'],
  'Orange': ['orange', 'oranges', 'mandarin', 'tangerine', 'citrus'],
  'Mango': ['mango', 'mangoes', 'mango tree'],
  'Potato': ['potato', 'potatoes', 'sweet potato', 'irish potato'],
  'Corn': ['corn', 'maize', 'sweet corn', 'field corn'],
  'Rice': ['rice', 'paddy', 'rice plant', 'rice grain'],
  'Wheat': ['wheat', 'wheat plant', 'grain'],
  'Cotton': ['cotton', 'cotton plant', 'cotton boll'],
  'Soybean': ['soybean', 'soy', 'soya bean'],
  'Pepper': ['pepper', 'bell pepper', 'chili', 'capsicum'],
  'Cucumber': ['cucumber', 'cucumbers', 'pickle'],
  'Cabbage': ['cabbage', 'lettuce', 'leafy greens'],
  'Carrot': ['carrot', 'carrots'],
  'Onion': ['onion', 'onions', 'shallot'],
  'Grape': ['grape', 'grapes', 'wine grape', 'table grape'],
  'Strawberry': ['strawberry', 'strawberries'],
  'Watermelon': ['watermelon', 'melon'],
  'Pineapple': ['pineapple', 'pine apple']
}

// Get all supported crops
export const SUPPORTED_CROPS = Object.keys(CROP_ALIASES)

/**
 * Validate if an image contains a plant/crop using a simple computer vision approach
 */
export async function validatePlantImage(imageBase64: string): Promise<ImageValidationResult> {
  try {
    // First, do a quick check using Groq Vision to determine if it's a plant
    const Groq = require('groq-sdk')
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY!,
    })

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this image and determine:
1. Is this a plant, crop, fruit, or vegetable? (YES/NO)
2. If yes, what specific crop/plant is it?
3. Confidence level (0-100)

Respond ONLY in this JSON format:
{
  "isPlant": true/false,
  "cropType": "specific crop name or null",
  "confidence": 85,
  "reasoning": "brief explanation"
}`
            },
            {
              type: "image_url",
              image_url: {
                url: imageBase64
              }
            }
          ]
        }
      ],
      model: "llama-3.2-11b-vision-preview",
      temperature: 0.1,
      max_tokens: 200,
    })

    const response = completion.choices[0]?.message?.content?.trim()
    
    if (!response) {
      return {
        isValid: false,
        isPlant: false,
        detectedCrop: null,
        confidence: 0,
        error: "Failed to analyze image"
      }
    }

    // Parse the JSON response
    let analysis
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      const jsonString = jsonMatch ? jsonMatch[0] : response
      analysis = JSON.parse(jsonString)
    } catch (parseError) {
      console.error('Failed to parse plant validation response:', response)
      return {
        isValid: false,
        isPlant: false,
        detectedCrop: null,
        confidence: 0,
        error: "Failed to process image analysis"
      }
    }

    const isPlant = analysis.isPlant && analysis.confidence > 60
    const detectedCrop = analysis.cropType ? normalizeCropName(analysis.cropType) : null

    return {
      isValid: isPlant,
      isPlant: isPlant,
      detectedCrop: detectedCrop,
      confidence: analysis.confidence,
      suggestions: isPlant ? [] : [
        "Upload an image of a plant, crop, fruit, or vegetable",
        "Ensure the plant is clearly visible in the image",
        "Use good lighting and focus on the leaves or fruit"
      ]
    }

  } catch (error) {
    console.error('Plant validation error:', error)
    
    // Fallback: assume it's a plant if we can't validate
    // This prevents blocking users when the validation service is down
    return {
      isValid: true,
      isPlant: true,
      detectedCrop: null,
      confidence: 50,
      error: "Could not validate image - proceeding with analysis"
    }
  }
}

/**
 * Check if the detected crop matches the user's selected crop
 */
export function validateCropMatch(selectedCrop: string, detectedCrop: string | null): CropMatchResult {
  if (!detectedCrop) {
    return {
      matches: true, // Can't validate, so assume it's okay
      selectedCrop: selectedCrop,
      detectedCrop: 'Unknown',
      confidence: 50,
      message: `Analyzing as ${selectedCrop} - please ensure your image shows a ${selectedCrop.toLowerCase()}`
    }
  }

  const normalizedSelected = normalizeCropName(selectedCrop)
  const normalizedDetected = normalizeCropName(detectedCrop)

  // Check if they match exactly
  if (normalizedSelected === normalizedDetected) {
    return {
      matches: true,
      selectedCrop: normalizedSelected,
      detectedCrop: normalizedDetected,
      confidence: 95,
      message: `Perfect! Detected ${normalizedDetected} matches your selection`
    }
  }

  // Check if they're aliases of each other
  const selectedAliases = CROP_ALIASES[normalizedSelected] || []
  const detectedAliases = CROP_ALIASES[normalizedDetected] || []
  
  const isAlias = selectedAliases.some(alias => 
    alias.toLowerCase() === normalizedDetected.toLowerCase()
  ) || detectedAliases.some(alias => 
    alias.toLowerCase() === normalizedSelected.toLowerCase()
  )

  if (isAlias) {
    return {
      matches: true,
      selectedCrop: normalizedSelected,
      detectedCrop: normalizedDetected,
      confidence: 85,
      message: `Good match! ${normalizedDetected} is compatible with ${normalizedSelected} analysis`
    }
  }

  // They don't match - this is an error
  return {
    matches: false,
    selectedCrop: normalizedSelected,
    detectedCrop: normalizedDetected,
    confidence: 90,
    message: `Wacha ujinga! You selected ${normalizedSelected} but uploaded a ${normalizedDetected}. They don't match! 😅`
  }
}

/**
 * Normalize crop names to standard format
 */
function normalizeCropName(cropName: string): string {
  const normalized = cropName.toLowerCase().trim()
  
  // Find the standard crop name that matches
  for (const [standardName, aliases] of Object.entries(CROP_ALIASES)) {
    if (aliases.some(alias => alias.toLowerCase() === normalized) || 
        standardName.toLowerCase() === normalized) {
      return standardName
    }
  }
  
  // If no match found, capitalize the first letter
  return cropName.charAt(0).toUpperCase() + cropName.slice(1).toLowerCase()
}

/**
 * Get suggestions for valid crops when user enters custom crop
 */
export function getCropSuggestions(input: string): string[] {
  if (!input || input.length < 2) return []
  
  const inputLower = input.toLowerCase()
  const suggestions: string[] = []
  
  // Find crops that match the input
  for (const [standardName, aliases] of Object.entries(CROP_ALIASES)) {
    if (standardName.toLowerCase().includes(inputLower)) {
      suggestions.push(standardName)
    } else {
      // Check aliases
      const matchingAlias = aliases.find(alias => alias.toLowerCase().includes(inputLower))
      if (matchingAlias && !suggestions.includes(standardName)) {
        suggestions.push(standardName)
      }
    }
  }
  
  return suggestions.slice(0, 5) // Limit to 5 suggestions
}

/**
 * Check if a custom crop name is reasonable
 */
export function validateCustomCrop(cropName: string): { valid: boolean; message?: string; suggestion?: string } {
  if (!cropName || cropName.trim().length < 2) {
    return { valid: false, message: "Crop name must be at least 2 characters" }
  }

  const trimmed = cropName.trim()
  
  // Check for reasonable length
  if (trimmed.length > 50) {
    return { valid: false, message: "Crop name is too long" }
  }

  // Check if it's already a supported crop
  const normalized = normalizeCropName(trimmed)
  if (SUPPORTED_CROPS.includes(normalized)) {
    return { 
      valid: true, 
      message: `Found exact match: ${normalized}`,
      suggestion: normalized 
    }
  }

  // Check for partial matches
  const suggestions = getCropSuggestions(trimmed)
  if (suggestions.length > 0) {
    return {
      valid: true,
      message: `Similar crops found: ${suggestions.join(', ')}`,
      suggestion: suggestions[0]
    }
  }

  // Allow custom crop but warn
  return { 
    valid: true, 
    message: `Custom crop "${trimmed}" will be analyzed with general plant disease detection`
  }
}