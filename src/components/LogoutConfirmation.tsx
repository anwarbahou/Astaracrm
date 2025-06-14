
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, ArrowRight } from 'lucide-react';

interface LogoutConfirmationProps {
  onSignInAgain: () => void;
}

export function LogoutConfirmation({ onSignInAgain }: LogoutConfirmationProps) {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        <div className="absolute inset-0 bg-gradient-to-tr from-green-600/10 via-blue-600/10 to-purple-600/10"></div>
        
        {/* Floating geometric shapes */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <Card className="backdrop-blur-lg bg-white/80 border-white/20 shadow-2xl animate-fade-in">
          <CardHeader className="text-center pb-8">
            <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              See You Soon!
            </CardTitle>
            <p className="text-gray-600 mt-2">
              You've been successfully signed out. Thanks for using our CRM platform.
            </p>
          </CardHeader>
          
          <CardContent className="text-center space-y-6">
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Your session has been securely ended. All your data remains safe and accessible when you return.
              </p>
              
              <div className="grid grid-cols-3 gap-4 py-4">
                <div className="text-center">
                  <div className="w-8 h-8 mx-auto mb-2 bg-green-100 rounded-lg flex items-center justify-center">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                  </div>
                  <p className="text-xs text-gray-600">Secure</p>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 mx-auto mb-2 bg-blue-100 rounded-lg flex items-center justify-center">
                    <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  </div>
                  <p className="text-xs text-gray-600">Protected</p>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 mx-auto mb-2 bg-purple-100 rounded-lg flex items-center justify-center">
                    <div className="w-4 h-4 bg-purple-500 rounded"></div>
                  </div>
                  <p className="text-xs text-gray-600">Ready</p>
                </div>
              </div>
            </div>

            <Button 
              onClick={onSignInAgain}
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
            >
              <div className="flex items-center gap-2">
                Sign In Again
                <ArrowRight className="h-4 w-4" />
              </div>
            </Button>

            <p className="text-xs text-gray-500">
              Have a great day! We're here whenever you need us.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
