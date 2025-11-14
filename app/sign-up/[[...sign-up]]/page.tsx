import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Benefits */}
      <div className="hidden lg:block lg:w-1/2 bg-gradient-to-br from-primary to-accent relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative h-full flex items-center justify-center p-12">
          <div className="max-w-lg text-center text-white">
            <div className="mb-8">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold mb-4">
                Start Protecting Your Crops Today
              </h2>
              <p className="text-lg opacity-90">
                Join thousands of farmers worldwide who trust CropGuard AI 
                for accurate disease detection and treatment guidance.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                <div className="text-2xl font-bold">10K+</div>
                <div className="text-sm opacity-80">Farmers Protected</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                <div className="text-2xl font-bold">95%</div>
                <div className="text-sm opacity-80">Accuracy Rate</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                <div className="text-2xl font-bold">&lt;5s</div>
                <div className="text-sm opacity-80">Analysis Time</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                <div className="text-2xl font-bold">$0</div>
                <div className="text-sm opacity-80">Forever Free</div>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Unlimited disease scans</span>
              </div>
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Expert treatment recommendations</span>
              </div>
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Scan history and analytics</span>
              </div>
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Mobile and desktop access</span>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-40 h-40 bg-white/10 rounded-full -translate-y-20 -translate-x-20"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-y-16 translate-x-16"></div>
      </div>

      {/* Right side - Sign up form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Create Your CropGuard AI Account
            </h1>
            <p className="text-gray-600">
              Get started with free AI-powered crop protection
            </p>
          </div>

          <SignUp 
            appearance={{
              variables: {
                colorPrimary: '#10B981',
                colorBackground: '#ffffff',
                colorText: '#111827',
                colorInputBackground: '#ffffff',
                colorInputText: '#111827',
                borderRadius: '0.375rem'
              },
              elements: {
                formButtonPrimary: 'bg-primary hover:bg-primary/90 text-white',
                card: 'shadow-none border-0',
                headerTitle: 'text-primary text-xl font-bold',
                headerSubtitle: 'text-gray-600',
                socialButtonsBlockButton: 'border-gray-200 hover:bg-gray-50 text-gray-700',
                formFieldLabel: 'text-gray-700 font-medium',
                formFieldInput: 'border-gray-300 focus:border-primary focus:ring-primary',
                footerActionLink: 'text-primary hover:text-primary/80'
              }
            }}
            fallbackRedirectUrl="/dashboard" 
            signInFallbackRedirectUrl="/dashboard"
          />

          <div className="mt-6 text-center text-xs text-gray-500">
            By signing up, you agree to our{' '}
            <a href="/terms" className="text-primary hover:text-primary/80">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className="text-primary hover:text-primary/80">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}