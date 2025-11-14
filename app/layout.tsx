import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ClerkProvider } from '@clerk/nextjs'
import "./globals.css"
import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CropGuard AI - Plant Disease Detection",
  description: "AI-powered plant disease detection for farmers worldwide. Upload a photo and get instant diagnosis with treatment recommendations.",
  keywords: ["plant disease", "agriculture", "AI", "farming", "crop protection", "disease detection"],
  authors: [{ name: "Alfred Nyongesa" }],
  creator: "Alfred Nyongesa (sibby-killer)",
  publisher: "CropGuard AI",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://cropguard-ai-web.vercel.app",
    siteName: "CropGuard AI",
    title: "CropGuard AI - Plant Disease Detection",
    description: "AI-powered plant disease detection for farmers worldwide",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "CropGuard AI - Plant Disease Detection"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    site: "@cropguardai",
    creator: "@sibby_killer",
    title: "CropGuard AI - Plant Disease Detection",
    description: "AI-powered plant disease detection for farmers worldwide",
    images: ["/twitter-image.jpg"]
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png"
  },
  manifest: "/manifest.json"
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      appearance={{
        variables: {
          colorPrimary: "#10B981",
          colorBackground: "#ffffff",
          colorText: "#111827"
        },
        elements: {
          formButtonPrimary: "bg-primary hover:bg-primary/90",
          card: "shadow-lg",
          headerTitle: "text-primary",
          socialButtonsBlockButton: "border-gray-200 hover:bg-gray-50"
        }
      }}
    >
      <html lang="en" className={inter.className}>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="theme-color" content="#10B981" />
        </head>
        <body className="min-h-screen bg-background font-sans antialiased">
          <div className="relative flex min-h-screen flex-col">
            <main className="flex-1">
              {children}
            </main>
          </div>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'white',
                color: '#111827',
                border: '1px solid #e5e7eb'
              }
            }}
          />
        </body>
      </html>
    </ClerkProvider>
  )
}