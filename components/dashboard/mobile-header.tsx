'use client'

import { Button } from '@/components/ui/button'
import { Menu, Leaf } from 'lucide-react'
import { UserButton } from '@clerk/nextjs'

interface MobileHeaderProps {
  onMenuClick: () => void
}

export function MobileHeader({ onMenuClick }: MobileHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <Button variant="ghost" size="sm" onClick={onMenuClick}>
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex items-center space-x-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary">
            <Leaf className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-bold gradient-text">CropGuard AI</span>
        </div>
      </div>
      
      <UserButton
        afterSignOutUrl="/"
        appearance={{
          elements: {
            avatarBox: "h-8 w-8"
          }
        }}
      />
    </div>
  )
}