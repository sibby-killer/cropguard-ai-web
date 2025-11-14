'use client'

import { motion } from 'framer-motion'
import { Bot, Upload, Stethoscope } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const features = [
  {
    icon: Bot,
    title: 'AI-Powered Detection',
    description: '95% accuracy with instant results using advanced computer vision and machine learning algorithms.',
    benefits: ['Instant Analysis', 'High Accuracy', 'Continuous Learning']
  },
  {
    icon: Upload,
    title: 'Easy Image Upload',
    description: 'Drag & drop or click to upload. Supports all image formats with automatic optimization.',
    benefits: ['All Formats', 'Auto-Optimize', 'Mobile Friendly']
  },
  {
    icon: Stethoscope,
    title: 'Treatment Plans',
    description: 'Detailed recommendations with step-by-step treatment plans and cost estimates.',
    benefits: ['Expert Advice', 'Cost Estimates', 'Organic Options']
  }
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 lg:py-32 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Why Choose <span className="gradient-text">CropGuard AI</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Advanced AI technology meets agricultural expertise to provide farmers 
            with the most accurate and actionable crop disease detection.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="h-full group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="text-center pb-6">
                  <div className="mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                  <CardDescription className="text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-center text-sm">
                        <div className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0"></div>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="text-sm text-gray-500 mb-6">Trusted by farmers worldwide</p>
          <div className="flex justify-center items-center space-x-8 opacity-60">
            <div className="text-2xl font-bold">🌾</div>
            <div className="text-2xl font-bold">🚜</div>
            <div className="text-2xl font-bold">🌱</div>
            <div className="text-2xl font-bold">🌿</div>
            <div className="text-2xl font-bold">🌽</div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}