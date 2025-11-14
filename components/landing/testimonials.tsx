'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Star } from 'lucide-react'
import Image from 'next/image'

const testimonials = [
  {
    name: 'Maria Santos',
    role: 'Tomato Farmer',
    location: 'Philippines',
    image: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=100&h=100&fit=crop&crop=face',
    content: 'CropGuard AI saved my entire tomato crop! I detected late blight early and applied treatment immediately. This season I had 40% better yields than last year.',
    rating: 5,
    highlight: '40% better yields'
  },
  {
    name: 'James Mitchell',
    role: 'Agricultural Extension Officer',
    location: 'Kenya',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    content: 'I recommend CropGuard AI to all farmers in my region. The accuracy is incredible and it helps me provide better support to smallholder farmers who cant afford expert consultations.',
    rating: 5,
    highlight: 'Incredible accuracy'
  },
  {
    name: 'Priya Patel',
    role: 'Organic Farm Owner',
    location: 'India',
    image: 'https://images.unsplash.com/photo-1494790108755-2616c36c2a0a?w=100&h=100&fit=crop&crop=face',
    content: 'The organic treatment recommendations are exactly what I needed. No more guessing - I know exactly what my plants need and when to apply treatments.',
    rating: 5,
    highlight: 'Perfect for organic farming'
  }
]

export function TestimonialsSection() {
  return (
    <section className="py-20 lg:py-32 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            What <span className="gradient-text">Farmers</span> Are Saying
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Real stories from farmers around the world who have improved their crop yields 
            and reduced losses with CropGuard AI.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  {/* Rating */}
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>

                  {/* Content */}
                  <blockquote className="text-gray-700 mb-6 italic">
                    "{testimonial.content}"
                  </blockquote>

                  {/* Highlight */}
                  <div className="bg-primary/10 border-l-4 border-primary p-3 mb-6 rounded-r">
                    <div className="text-sm font-medium text-primary">
                      ✨ {testimonial.highlight}
                    </div>
                  </div>

                  {/* Author */}
                  <div className="flex items-center">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4 bg-gray-200">
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                        <span className="text-lg font-semibold text-primary">
                          {testimonial.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.role}</div>
                      <div className="text-xs text-gray-500">{testimonial.location}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="text-sm text-gray-500 mb-6">Trusted by agricultural organizations worldwide</p>
          <div className="flex justify-center items-center space-x-8 text-gray-400">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary/20 rounded-full"></div>
              <span className="text-sm font-medium">FAO Partner</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary/20 rounded-full"></div>
              <span className="text-sm font-medium">AgTech Certified</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary/20 rounded-full"></div>
              <span className="text-sm font-medium">ISO 27001</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}