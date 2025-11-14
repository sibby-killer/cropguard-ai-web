import { Disease } from '@/types'

export const DISEASE_DATABASE: Record<string, Disease> = {
  "Late Blight": {
    name: "Late Blight",
    crop: "Tomato",
    severity: "Severe",
    scientific_name: "Phytophthora infestans",
    description: "Late blight is a devastating disease that affects tomato and potato plants. It spreads rapidly in cool, moist conditions and can destroy entire crops within days if not controlled.",
    symptoms: [
      "Dark water-soaked spots on leaves",
      "White fuzzy mold on leaf undersides",
      "Brown lesions on stems",
      "Dark spots on fruits",
      "Rapid wilting and plant death"
    ],
    treatment: [
      "Remove and destroy infected plants immediately",
      "Apply copper-based fungicides",
      "Use systemic fungicides like chlorothalonil",
      "Improve air circulation around plants",
      "Avoid overhead watering"
    ],
    prevention: [
      "Plant resistant varieties",
      "Ensure good drainage",
      "Space plants adequately for air circulation",
      "Remove plant debris at end of season",
      "Rotate crops annually"
    ],
    organic_treatment: [
      "Copper sulfate spray",
      "Bordeaux mixture",
      "Baking soda solution (1 tsp per quart water)",
      "Neem oil application",
      "Remove infected parts immediately"
    ],
    cost_estimate: "$20-50 per acre for treatment"
  },

  "Early Blight": {
    name: "Early Blight",
    crop: "Tomato",
    severity: "Moderate",
    scientific_name: "Alternaria solani",
    description: "Early blight is a common fungal disease affecting tomatoes and potatoes, characterized by concentric ring spots on leaves and stems.",
    symptoms: [
      "Concentric ring spots on lower leaves",
      "Yellow halos around spots",
      "Brown lesions on stems",
      "Target-like spots on fruits",
      "Premature leaf drop"
    ],
    treatment: [
      "Apply fungicides containing chlorothalonil",
      "Use copper-based sprays",
      "Remove affected foliage",
      "Improve plant spacing",
      "Mulch around plants"
    ],
    prevention: [
      "Choose resistant varieties",
      "Ensure proper plant nutrition",
      "Avoid overhead irrigation",
      "Practice crop rotation",
      "Remove plant debris"
    ],
    organic_treatment: [
      "Copper fungicide spray",
      "Compost tea application",
      "Baking soda and oil spray",
      "Proper pruning for air flow",
      "Organic mulching"
    ],
    cost_estimate: "$15-35 per acre for treatment"
  },

  "Septoria Leaf Spot": {
    name: "Septoria Leaf Spot",
    crop: "Tomato",
    severity: "Moderate",
    scientific_name: "Septoria lycopersici",
    description: "A fungal disease causing small circular spots with dark borders on tomato leaves, leading to defoliation and reduced fruit quality.",
    symptoms: [
      "Small circular spots with gray centers",
      "Dark borders around spots",
      "Tiny black specks in spot centers",
      "Yellow halos around spots",
      "Lower leaf yellowing and drop"
    ],
    treatment: [
      "Apply fungicides early in season",
      "Use copper-based treatments",
      "Remove lower infected leaves",
      "Improve air circulation",
      "Avoid splash irrigation"
    ],
    prevention: [
      "Plant resistant cultivars",
      "Stake and prune plants properly",
      "Mulch to prevent soil splash",
      "Water at soil level only",
      "Remove plant debris in fall"
    ],
    organic_treatment: [
      "Copper soap spray",
      "Bordeaux mixture",
      "Proper plant spacing",
      "Organic mulch application",
      "Regular monitoring and removal"
    ],
    cost_estimate: "$10-25 per acre for treatment"
  },

  "Bacterial Spot": {
    name: "Bacterial Spot",
    crop: "Tomato",
    severity: "Moderate",
    scientific_name: "Xanthomonas campestris",
    description: "A bacterial disease causing small dark lesions on leaves, stems, and fruits, thriving in warm, humid conditions.",
    symptoms: [
      "Small dark brown spots on leaves",
      "Raised lesions on fruits",
      "Yellow halos around leaf spots",
      "Defoliation in severe cases",
      "Cracked and scabby fruits"
    ],
    treatment: [
      "Apply copper bactericides",
      "Use streptomycin if available",
      "Remove infected plant material",
      "Improve air circulation",
      "Reduce leaf wetness duration"
    ],
    prevention: [
      "Use pathogen-free seeds",
      "Avoid overhead irrigation",
      "Practice crop rotation",
      "Disinfect tools between plants",
      "Choose resistant varieties"
    ],
    organic_treatment: [
      "Copper-based organic sprays",
      "Proper sanitation practices",
      "Beneficial bacterial applications",
      "Improved drainage",
      "Resistant variety selection"
    ],
    cost_estimate: "$15-40 per acre for treatment"
  },

  "Leaf Mold": {
    name: "Leaf Mold",
    crop: "Tomato",
    severity: "Mild",
    scientific_name: "Passalora fulva",
    description: "A fungal disease primarily affecting greenhouse tomatoes, causing yellowish spots with olive-green mold on leaf undersides.",
    symptoms: [
      "Yellow spots on upper leaf surfaces",
      "Olive-green mold on leaf undersides",
      "Leaves curl and wither",
      "Reduced fruit production",
      "Premature defoliation"
    ],
    treatment: [
      "Increase ventilation in greenhouse",
      "Apply fungicides if necessary",
      "Remove infected leaves",
      "Reduce humidity levels",
      "Improve air circulation"
    ],
    prevention: [
      "Maintain low humidity (<85%)",
      "Ensure adequate ventilation",
      "Space plants properly",
      "Use resistant varieties",
      "Monitor greenhouse conditions"
    ],
    organic_treatment: [
      "Improve greenhouse ventilation",
      "Use sulfur-based fungicides",
      "Biological control agents",
      "Proper plant spacing",
      "Humidity management"
    ],
    cost_estimate: "$8-20 per greenhouse treatment"
  },

  "Mosaic Virus": {
    name: "Mosaic Virus",
    crop: "Tomato",
    severity: "Severe",
    scientific_name: "Tobacco mosaic virus",
    description: "A viral disease causing mottled yellowing and distortion of leaves, significantly reducing plant vigor and fruit quality.",
    symptoms: [
      "Mottled yellow and green leaf patterns",
      "Leaf distortion and curling",
      "Stunted plant growth",
      "Reduced fruit size and quality",
      "Dark green and light green mosaic patterns"
    ],
    treatment: [
      "Remove infected plants immediately",
      "Control aphid vectors",
      "Disinfect tools with bleach solution",
      "No chemical cure available",
      "Focus on prevention"
    ],
    prevention: [
      "Use virus-free seeds",
      "Control aphid populations",
      "Remove weeds that harbor virus",
      "Disinfect tools regularly",
      "Avoid tobacco use near plants"
    ],
    organic_treatment: [
      "Remove infected plants",
      "Beneficial insects for aphid control",
      "Reflective mulches",
      "Proper sanitation",
      "Virus-free planting material"
    ],
    cost_estimate: "$5-15 per acre for prevention"
  },

  "Powdery Mildew": {
    name: "Powdery Mildew",
    crop: "Tomato",
    severity: "Moderate",
    scientific_name: "Leveillula taurica",
    description: "A fungal disease creating white powdery coating on leaves, reducing photosynthesis and plant vigor.",
    symptoms: [
      "White powdery coating on leaves",
      "Yellow spots on upper leaf surface",
      "Leaf curling and distortion",
      "Premature leaf senescence",
      "Reduced fruit quality"
    ],
    treatment: [
      "Apply sulfur-based fungicides",
      "Use systemic fungicides",
      "Improve air circulation",
      "Reduce humidity levels",
      "Remove infected foliage"
    ],
    prevention: [
      "Choose resistant varieties",
      "Ensure proper plant spacing",
      "Avoid excess nitrogen fertilization",
      "Maintain good air circulation",
      "Monitor humidity levels"
    ],
    organic_treatment: [
      "Sulfur dust or spray",
      "Baking soda solution",
      "Milk spray (1:10 ratio)",
      "Neem oil application",
      "Improved ventilation"
    ],
    cost_estimate: "$12-30 per acre for treatment"
  },

  "Target Spot": {
    name: "Target Spot",
    crop: "Tomato",
    severity: "Moderate",
    scientific_name: "Corynespora cassiicola",
    description: "A fungal disease causing circular spots with concentric rings, resembling a target, on leaves and fruits.",
    symptoms: [
      "Circular spots with concentric rings",
      "Brown centers with yellow halos",
      "Target-like appearance",
      "Fruit lesions with dark centers",
      "Defoliation in severe cases"
    ],
    treatment: [
      "Apply protective fungicides",
      "Use copper-based treatments",
      "Remove infected plant debris",
      "Improve drainage",
      "Avoid overhead irrigation"
    ],
    prevention: [
      "Practice crop rotation",
      "Use clean planting material",
      "Ensure good air circulation",
      "Remove plant residues",
      "Apply preventive fungicides"
    ],
    organic_treatment: [
      "Copper-based organic fungicides",
      "Compost tea applications",
      "Proper plant hygiene",
      "Beneficial microorganisms",
      "Resistant variety selection"
    ],
    cost_estimate: "$15-35 per acre for treatment"
  },

  "Yellow Leaf Curl Virus": {
    name: "Yellow Leaf Curl Virus",
    crop: "Tomato",
    severity: "Severe",
    scientific_name: "Tomato yellow leaf curl virus",
    description: "A viral disease transmitted by whiteflies, causing severe leaf curling, yellowing, and stunting of tomato plants.",
    symptoms: [
      "Upward curling of leaves",
      "Yellow leaf margins",
      "Stunted plant growth",
      "Reduced fruit set",
      "Thickened, brittle leaves"
    ],
    treatment: [
      "Remove infected plants",
      "Control whitefly vectors",
      "Use reflective mulches",
      "Apply insecticides for whiteflies",
      "No direct viral treatment"
    ],
    prevention: [
      "Use virus-resistant varieties",
      "Control whitefly populations",
      "Install physical barriers",
      "Remove alternative weed hosts",
      "Use yellow sticky traps"
    ],
    organic_treatment: [
      "Beneficial insects for whitefly control",
      "Reflective aluminum mulch",
      "Neem oil for whitefly control",
      "Row covers for protection",
      "Resistant variety cultivation"
    ],
    cost_estimate: "$20-45 per acre for prevention and control"
  },

  "Healthy Plant": {
    name: "Healthy Plant",
    crop: "All",
    severity: "None",
    scientific_name: "N/A",
    description: "Your plant appears healthy with no visible signs of disease. Continue with proper care and monitoring.",
    symptoms: [
      "Vibrant green foliage",
      "No visible spots or lesions",
      "Good plant vigor",
      "Normal growth patterns",
      "No signs of stress"
    ],
    treatment: [
      "Continue current care routine",
      "Monitor regularly for changes",
      "Maintain proper nutrition",
      "Ensure adequate water",
      "No treatment needed"
    ],
    prevention: [
      "Regular monitoring",
      "Proper watering schedule",
      "Adequate nutrition",
      "Good air circulation",
      "Preventive care measures"
    ],
    organic_treatment: [
      "Continue organic practices",
      "Compost applications",
      "Natural pest monitoring",
      "Beneficial companion planting",
      "Maintain soil health"
    ],
    cost_estimate: "No treatment costs needed"
  }
}

export function getDiseaseByName(name: string): Disease | undefined {
  return DISEASE_DATABASE[name]
}

export function getAllDiseases(): Disease[] {
  return Object.values(DISEASE_DATABASE)
}

export function getDiseasesByCrop(crop: string): Disease[] {
  return Object.values(DISEASE_DATABASE).filter(disease => 
    disease.crop === crop || disease.crop === 'All'
  )
}

export function searchDiseases(query: string): Disease[] {
  const lowerQuery = query.toLowerCase()
  return Object.values(DISEASE_DATABASE).filter(disease =>
    disease.name.toLowerCase().includes(lowerQuery) ||
    disease.description.toLowerCase().includes(lowerQuery) ||
    disease.symptoms.some(symptom => symptom.toLowerCase().includes(lowerQuery))
  )
}