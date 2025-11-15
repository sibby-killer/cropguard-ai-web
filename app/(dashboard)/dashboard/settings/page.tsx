'use client'

import { useUser } from '@clerk/nextjs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { UserButton } from '@clerk/nextjs'

export default function SettingsPage() {
  const { user, isLoaded } = useUser()

  if (!isLoaded) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid gap-6">
            <div className="h-48 bg-gray-200 rounded-lg"></div>
            <div className="h-32 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Settings
        </h1>
        <p className="text-gray-600">
          Manage your account preferences and application settings.
        </p>
      </div>

      <div className="space-y-6">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>
              Manage your account information and preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-4">
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "h-16 w-16"
                  }
                }}
              />
              <div>
                <h3 className="text-lg font-medium">
                  {user?.firstName ? `${user.firstName} ${user.lastName}` : 'User'}
                </h3>
                <p className="text-gray-600">{user?.emailAddresses[0]?.emailAddress}</p>
              </div>
            </div>
            
            <Button variant="outline">
              Manage Account in Clerk
            </Button>
          </CardContent>
        </Card>

        {/* App Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
            <CardDescription>
              Customize your CropGuard AI experience
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Language</h4>
                <p className="text-sm text-gray-600">Choose your preferred language</p>
              </div>
              <Badge variant="secondary">English</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Units</h4>
                <p className="text-sm text-gray-600">Measurement units for recommendations</p>
              </div>
              <Badge variant="secondary">Metric</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Email Notifications</h4>
                <p className="text-sm text-gray-600">Receive updates about new features</p>
              </div>
              <Badge variant="secondary">Enabled</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Usage Information */}
        <Card>
          <CardHeader>
            <CardTitle>Usage & Limits</CardTitle>
            <CardDescription>
              Your current usage and plan information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Monthly Scans</h4>
                <p className="text-sm text-gray-600">Number of disease detection scans</p>
              </div>
              <div className="text-right">
                <div className="font-medium">24 this month</div>
                <div className="text-sm text-gray-600">Unlimited</div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Plan</h4>
                <p className="text-sm text-gray-600">Your current subscription plan</p>
              </div>
              <Badge variant="default" className="bg-green-100 text-green-800">
                FREE Forever
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
            <CardDescription>
              Export or delete your scan data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Export Data</h4>
                <p className="text-sm text-gray-600">Download your scan history as CSV</p>
              </div>
              <Button variant="outline" size="sm">
                Export CSV
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Delete All Scans</h4>
                <p className="text-sm text-gray-600">Permanently remove all your scan data</p>
              </div>
              <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                Delete All
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* About */}
        <Card>
          <CardHeader>
            <CardTitle>About CropGuard AI</CardTitle>
            <CardDescription>
              Application information and support
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-medium">Version</div>
                <div className="text-gray-600">1.0.0</div>
              </div>
              <div>
                <div className="font-medium">Last Updated</div>
                <div className="text-gray-600">November 2024</div>
              </div>
              <div>
                <div className="font-medium">Support</div>
                <div className="text-gray-600">alfred.dev8@gmail.com</div>
              </div>
              <div>
                <div className="font-medium">GitHub</div>
                <div className="text-gray-600">sibby-killer/cropguard-ai-web</div>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <p className="text-sm text-gray-600">
                Made with 💚 by Alfred Nyongesa for farmers worldwide. 
                Supporting UN SDG 2: Zero Hunger.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}