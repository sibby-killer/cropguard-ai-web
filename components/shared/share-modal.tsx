'use client'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Copy, Mail, MessageCircle, X } from 'lucide-react'
import { FaTwitter, FaFacebook, FaWhatsapp } from 'react-icons/fa'

interface ShareModalProps {
    isOpen: boolean
    onClose: () => void
    onCopyLink: () => void
    onEmailShare: () => void
    onSocialShare: (platform: 'twitter' | 'facebook' | 'whatsapp') => void
    onWebShare: () => void
}

export function ShareModal({
    isOpen,
    onClose,
    onCopyLink,
    onEmailShare,
    onSocialShare,
    onWebShare
}: ShareModalProps) {
    const hasWebShare = typeof navigator !== 'undefined' && navigator.share

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Share Report</DialogTitle>
                    <DialogDescription>
                        Share this disease detection report with others
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-3">
                    {/* Copy Link */}
                    <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => {
                            onCopyLink()
                            onClose()
                        }}
                    >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Link to Clipboard
                    </Button>

                    {/* Email */}
                    <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => {
                            onEmailShare()
                            onClose()
                        }}
                    >
                        <Mail className="w-4 h-4 mr-2" />
                        Share via Email
                    </Button>

                    {/* Social Media */}
                    <div className="border-t pt-3">
                        <p className="text-sm text-gray-600 mb-2">Share on Social Media</p>
                        <div className="grid grid-cols-3 gap-2">
                            <Button
                                variant="outline"
                                className="flex-col h-auto py-3"
                                onClick={() => {
                                    onSocialShare('twitter')
                                    onClose()
                                }}
                            >
                                <FaTwitter className="w-5 h-5 mb-1 text-blue-400" />
                                <span className="text-xs">Twitter</span>
                            </Button>

                            <Button
                                variant="outline"
                                className="flex-col h-auto py-3"
                                onClick={() => {
                                    onSocialShare('facebook')
                                    onClose()
                                }}
                            >
                                <FaFacebook className="w-5 h-5 mb-1 text-blue-600" />
                                <span className="text-xs">Facebook</span>
                            </Button>

                            <Button
                                variant="outline"
                                className="flex-col h-auto py-3"
                                onClick={() => {
                                    onSocialShare('whatsapp')
                                    onClose()
                                }}
                            >
                                <FaWhatsapp className="w-5 h-5 mb-1 text-green-500" />
                                <span className="text-xs">WhatsApp</span>
                            </Button>
                        </div>
                    </div>

                    {/* Web Share API (Mobile) */}
                    {hasWebShare && (
                        <Button
                            variant="outline"
                            className="w-full justify-start"
                            onClick={() => {
                                onWebShare()
                                onClose()
                            }}
                        >
                            <MessageCircle className="w-4 h-4 mr-2" />
                            More Sharing Options
                        </Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
