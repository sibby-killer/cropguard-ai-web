import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Sign in form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome back to CropGuard AI
            </h1>
            <p className="text-gray-600">
              Sign in to continue protecting your crops
            </p>
          </div>

          <SignIn 
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
            redirectUrl="/dashboard"
            signUpUrl="/sign-up"
          />
        </div>
      </div>

      {/* Right side - Benefits */}
      <div className="hidden lg:block lg:w-1/2 bg-gradient-to-br from-primary to-accent relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative h-full flex items-center justify-center p-12">
          <div className="max-w-lg text-center text-white">
            <div className="mb-8">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <h2 className="text-3xl font-bold mb-4">
                Join 10,000+ Farmers Using CropGuard AI
              </h2>
              <p className="text-lg opacity-90">
                Protect your crops with AI-powered disease detection. 
                Get instant diagnosis and treatment plans.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>95%+ Detection Accuracy</span>
              </div>
              <div className="flex items-center justify-center space-x-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>Instant Results in &lt; 5 Seconds</span>
              </div>
              <div className="flex items-center justify-center space-x-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>Comprehensive Treatment Plans</span>
              </div>
              <div className="flex items-center justify-center space-x-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>100% Free Forever</span>
              </div>
            </div>

            <div className="mt-8 p-6 bg-white/10 backdrop-blur rounded-lg">
              <p className="italic">
                "CropGuard AI saved my entire tomato crop! I detected late blight early 
                and had 40% better yields this season."
              </p>
              <div className="mt-3 text-sm opacity-80">
                - Maria Santos, Philippines
              </div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-20 translate-x-20"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-16 -translate-x-16"></div>
      </div>
    </div>
  )
}