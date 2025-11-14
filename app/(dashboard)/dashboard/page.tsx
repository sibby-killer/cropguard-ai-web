'use client'

import { useUser } from '@clerk/nextjs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Camera, TrendingUp, Calendar, Target, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import { StatsCard } from '@/components/dashboard/stats-card'
import { RecentScans } from '@/components/dashboard/recent-scans'
import { motion } from 'framer-motion'

const quickStats = [
  {
    title: 'Total Scans',
    value: '24',
    change: '+12% from last month',
    icon: Camera,
    trend: 'up' as const
  },
  {
    title: 'Detection Accuracy',
    value: '96.2%',
    change: '+2.1% this week',
    icon: Target,
    trend: 'up' as const
  },
  {
    title: 'Last Scan',
    value: '2 days ago',
    change: 'Tomato - Healthy',
    icon: Calendar,
    trend: 'neutral' as const
  },
  {
    title: 'Crops Monitored',
    value: '3 Types',
    change: 'Tomato, Potato, Corn',
    icon: TrendingUp,
    trend: 'neutral' as const
  }
]

export default function DashboardPage() {
  const { user, isLoaded } = useUser()

  if (!isLoaded) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const firstName = user?.firstName || 'Farmer'

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl md:text-3xl font-bold text-gray-900"
        >
          Welcome back, {firstName}! 👋
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-2 text-gray-600"
        >
          Here's what's happening with your crops today.
        </motion.p>
      </div>

      {/* Quick Actions */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="flex-1">
                <Link href="/dashboard/scan" className="flex items-center">
                  <Camera className="mr-2 h-5 w-5" />
                  Upload New Image
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="flex-1">
                <Link href="/dashboard/history" className="flex items-center">
                  <ArrowUpRight className="mr-2 h-5 w-5" />
                  View Scan History
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {quickStats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
          >
            <StatsCard {...stat} />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Scans */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Scans</CardTitle>
                <CardDescription>
                  Your latest crop disease detection scans
                </CardDescription>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href="/dashboard/history">View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <RecentScans />
            </CardContent>
          </Card>
        </motion.div>

        {/* Tips & Insights */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="space-y-6"
        >
          {/* Disease Alert */}
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-orange-800 text-lg">Seasonal Alert</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-orange-700 mb-3">
                Late blight risk is high in your region this week due to humid conditions.
              </p>
              <Button size="sm" variant="outline" className="border-orange-300 text-orange-700">
                Learn More
              </Button>
            </CardContent>
          </Card>

          {/* Tip of the Day */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">💡 Tip of the Day</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">
                Take photos of your plants in natural daylight for the most accurate disease detection results.
              </p>
              <Button asChild size="sm" variant="outline">
                <Link href="/dashboard/diseases">Browse Tips</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Progress */}
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-primary text-lg">Your Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Scans this month</span>
                  <span className="font-medium">24/∞</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>
                <p className="text-xs text-gray-600">
                  Great progress! You're actively monitoring your crops.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}