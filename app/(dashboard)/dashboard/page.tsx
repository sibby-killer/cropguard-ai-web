'use client'

import { useUser } from '@clerk/nextjs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Camera, TrendingUp, Calendar, Target, ArrowUpRight, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { StatsCard } from '@/components/dashboard/stats-card'
import { RecentScans } from '@/components/dashboard/recent-scans'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'


interface Stats {
  total_scans: number
  average_confidence: number
  last_scan_date: string | null
  crops_monitored: string[]
}

export default function DashboardPage() {
  const { user, isLoaded } = useUser()
  const [stats, setStats] = useState<Stats | null>(null)
  const [loadingStats, setLoadingStats] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats')
        if (response.ok) {
          const data = await response.json()
          setStats(data.stats)
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      } finally {
        setLoadingStats(false)
      }
    }

    if (isLoaded) {
      fetchStats()
    }
  }, [isLoaded])

  if (!isLoaded || loadingStats) {
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

  // Calculate quick stats from real data
  const quickStats = [
    {
      title: 'Total Scans',
      value: stats?.total_scans.toString() || '0',
      change: stats?.total_scans ? `${stats.total_scans} scans completed` : 'No scans yet',
      icon: Camera,
      trend: 'neutral' as const
    },
    {
      title: 'Detection Accuracy',
      value: stats?.average_confidence ? `${stats.average_confidence.toFixed(1)}%` : 'N/A',
      change: stats?.average_confidence ? 'Average confidence' : 'No data yet',
      icon: Target,
      trend: 'neutral' as const
    },
    {
      title: 'Last Scan',
      value: stats?.last_scan_date
        ? new Date(stats.last_scan_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        : 'Never',
      change: stats?.last_scan_date ? 'Most recent analysis' : 'Upload your first scan',
      icon: Calendar,
      trend: 'neutral' as const
    },
    {
      title: 'Crops Monitored',
      value: stats?.crops_monitored?.length ? `${stats.crops_monitored.length} Types` : '0 Types',
      change: stats?.crops_monitored?.length ? stats.crops_monitored.slice(0, 2).join(', ') : 'No crops yet',
      icon: TrendingUp,
      trend: 'neutral' as const
    }
  ]

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
                  <span className="font-medium">{stats?.total_scans || 0}/∞</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{ width: `${Math.min((stats?.total_scans || 0) * 10, 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-600">
                  {stats?.total_scans ? 'Great progress! You\'re actively monitoring your crops.' : 'Start scanning to track your progress!'}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}