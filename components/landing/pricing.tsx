'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Check, Sparkles } from 'lucide-react'
import Link from 'next/link'

const features = [
  'Unlimited plant disease scans',
  'AI-powered diagnosis in < 5 seconds',
  'Detailed treatment recommendations',
  'Organic treatment alternatives',
  'Cost estimates for treatments',
  'Scan history and analytics',
  'Expert disease database access',
  'Mobile and desktop support',
  'Multi-language support (coming soon)',
  'Priority customer support'
]

export function PricingSection() {
  return (
    <section id="pricing" className="py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Simple, <span className="gradient-text">Transparent</span> Pricing
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            We believe every farmer should have access to advanced crop protection technology. 
            That's why CropGuard AI is completely free, forever.
          </motion.p>
        </div>

        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Card className="relative overflow-hidden border-2 border-primary shadow-xl">
              {/* Popular badge */}
              <div className="absolute top-0 right-0 bg-primary text-white px-4 py-1 text-sm font-medium">
                Most Popular
              </div>
              
              <CardHeader className="text-center pb-8 pt-8">
                <div className="flex items-center justify-center mb-4">
                  <Sparkles className="w-8 h-8 text-primary mr-2" />
                  <CardTitle className="text-3xl">FREE Forever</CardTitle>
                </div>
                <div className="text-6xl font-bold text-primary mb-2">$0</div>
                <p className="text-gray-600">No hidden fees. No subscriptions. No limits.</p>
              </CardHeader>

              <CardContent className="px-8 pb-8">
                {/* Features list */}
                <div className="space-y-4 mb-8">
                  {features.map((feature, index) => (
                    <motion.div
                      key={feature}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-center"
                    >
                      <Check className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </motion.div>
                  ))}
                </div>

                {/* CTA Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <Button size="lg" className="w-full mb-4" asChild>
                    <Link href="/sign-up">
                      Start Now - It's Free!
                    </Link>
                  </Button>
                  <p className="text-xs text-gray-500">
                    No credit card required. Start protecting your crops in 30 seconds.
                  </p>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.4 }}
          viewport={{ once: true }}
          className="mt-16 max-w-4xl mx-auto"
        >
          <h3 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold mb-2">Why is it completely free?</h4>
              <p className="text-gray-600 text-sm">
                Our mission is to democratize access to agricultural technology. 
                We believe every farmer deserves advanced crop protection tools, 
                regardless of their economic situation.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Is there a catch or hidden fees?</h4>
              <p className="text-gray-600 text-sm">
                Absolutely none. CropGuard AI is funded by agricultural research grants 
                and partnerships with organizations focused on global food security.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">How accurate is the AI detection?</h4>
              <p className="text-gray-600 text-sm">
                Our AI achieves 95%+ accuracy across common crop diseases, 
                validated against expert diagnoses and continuously improving 
                with each scan.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Do you offer support?</h4>
              <p className="text-gray-600 text-sm">
                Yes! We provide email support and have plans for community forums 
                where farmers can share experiences and get help from experts.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Social proof */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.6 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="bg-gray-50 rounded-lg p-8">
            <p className="text-gray-600 mb-4">
              Join thousands of farmers who are already protecting their crops with AI
            </p>
            <div className="flex justify-center items-center space-x-4 text-sm text-gray-500">
              <span>🌾 10,000+ farmers</span>
              <span>•</span>
              <span>🌍 50+ countries</span>
              <span>•</span>
              <span>📈 95% satisfaction</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}