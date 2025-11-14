'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'

const stats = [
  {
    value: 10000,
    suffix: '+',
    label: 'Scans Completed',
    description: 'Farmers worldwide trust our AI'
  },
  {
    value: 95,
    suffix: '%+',
    label: 'Detection Accuracy',
    description: 'Proven diagnostic precision'
  },
  {
    value: 5,
    suffix: 's',
    label: 'Average Response Time',
    description: 'Lightning-fast analysis',
    prefix: '<'
  },
  {
    value: 0,
    suffix: '',
    label: 'Cost to Use',
    description: 'Completely free forever',
    prefix: '$'
  }
]

function CountUpNumber({ 
  value, 
  duration = 2 
}: { 
  value: number
  duration?: number 
}) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (isInView) {
      let startTime: number
      let animationFrame: number

      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime
        const progress = Math.min((currentTime - startTime) / (duration * 1000), 1)
        
        setCount(Math.floor(progress * value))
        
        if (progress < 1) {
          animationFrame = requestAnimationFrame(animate)
        }
      }

      animationFrame = requestAnimationFrame(animate)
      
      return () => {
        if (animationFrame) {
          cancelAnimationFrame(animationFrame)
        }
      }
    }
  }, [isInView, value, duration])

  return (
    <span ref={ref}>
      {count.toLocaleString()}
    </span>
  )
}

export function StatsSection() {
  return (
    <section className="py-20 lg:py-32 bg-gray-900 text-white relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" 
             style={{
               backgroundImage: `radial-gradient(circle at 25% 25%, #10B981 0%, transparent 50%),
                                radial-gradient(circle at 75% 75%, #34D399 0%, transparent 50%)`
             }}>
        </div>
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Trusted by <span className="gradient-text">Farmers Worldwide</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg text-gray-300 max-w-2xl mx-auto"
          >
            Our AI-powered platform delivers consistent results that farmers depend on 
            for protecting their crops and maximizing yields.
          </motion.p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center group"
            >
              <div className="bg-white/5 backdrop-blur rounded-lg p-6 hover:bg-white/10 transition-all duration-300 group-hover:scale-105">
                <div className="text-3xl md:text-4xl font-bold mb-2">
                  {stat.prefix}
                  <CountUpNumber value={stat.value} />
                  {stat.suffix}
                </div>
                <div className="text-sm md:text-base font-semibold text-primary mb-1">
                  {stat.label}
                </div>
                <div className="text-xs md:text-sm text-gray-400">
                  {stat.description}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="bg-white/5 backdrop-blur rounded-lg p-8 max-w-4xl mx-auto">
            <h3 className="text-xl font-semibold mb-6">Why Farmers Choose CropGuard AI</h3>
            <div className="grid md:grid-cols-3 gap-6 text-sm">
              <div>
                <div className="text-primary font-semibold mb-2">🚀 Fast & Reliable</div>
                <p className="text-gray-300">
                  Get results in seconds, not hours. Our cloud infrastructure ensures 
                  99.9% uptime for when you need it most.
                </p>
              </div>
              <div>
                <div className="text-primary font-semibold mb-2">🔬 Scientifically Proven</div>
                <p className="text-gray-300">
                  Developed with agricultural experts and validated against thousands 
                  of real-world cases from farms globally.
                </p>
              </div>
              <div>
                <div className="text-primary font-semibold mb-2">💰 Always Free</div>
                <p className="text-gray-300">
                  No hidden fees, no subscriptions. Our mission is to make crop 
                  protection accessible to every farmer, everywhere.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}