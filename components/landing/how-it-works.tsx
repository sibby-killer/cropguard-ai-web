'use client'

import { motion } from 'framer-motion'
import { Upload, Brain, CheckCircle, FileText } from 'lucide-react'

const steps = [
  {
    icon: Upload,
    title: 'Upload Leaf Photo',
    description: 'Take a clear photo of your plant leaf showing any visible symptoms or damage.',
    details: ['Multiple formats supported', 'Mobile & desktop friendly', 'Instant upload']
  },
  {
    icon: Brain,
    title: 'AI Analyzes Disease',
    description: 'Our advanced AI examines your image using computer vision and machine learning.',
    details: ['95%+ accuracy rate', '< 5 second analysis', 'Continuous learning']
  },
  {
    icon: CheckCircle,
    title: 'Get Instant Results',
    description: 'Receive detailed diagnosis with confidence scores and severity assessment.',
    details: ['Disease identification', 'Confidence scoring', 'Severity levels']
  },
  {
    icon: FileText,
    title: 'Follow Treatment Plan',
    description: 'Access comprehensive treatment recommendations and prevention strategies.',
    details: ['Step-by-step guidance', 'Cost estimates', 'Organic alternatives']
  }
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            How It <span className="gradient-text">Works</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Get from photo to treatment plan in just four simple steps. 
            Our AI-powered system makes crop disease diagnosis faster and more accurate than ever.
          </motion.p>
        </div>

        <div className="relative">
          {/* Connection lines - desktop only */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/20 via-primary to-primary/20 -translate-y-1/2"></div>

          <div className="grid lg:grid-cols-4 gap-8 relative">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative"
              >
                {/* Step number */}
                <div className="absolute -top-4 -left-4 lg:top-0 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold z-10">
                  {index + 1}
                </div>

                <div className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow border-l-4 border-primary lg:border-l-0 lg:border-t-4 lg:border-primary">
                  <div className="flex items-center mb-4 lg:justify-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <step.icon className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-2 lg:text-center">{step.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 lg:text-center">{step.description}</p>
                  
                  <ul className="space-y-1">
                    {step.details.map((detail) => (
                      <li key={detail} className="flex items-center text-xs text-gray-500">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2 flex-shrink-0"></div>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Mobile connector */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden w-0.5 h-8 bg-primary/30 mx-auto my-4"></div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-primary/5 rounded-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold mb-4">Ready to protect your crops?</h3>
            <p className="text-gray-600 mb-6">
              Join thousands of farmers worldwide who trust CropGuard AI for their crop health monitoring.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Start Your First Scan
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}