import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, User, Lock } from "lucide-react";

export default function AdminLogin() {
  const handleLogin = () => {
    // Redirect to Replit Auth login
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8 text-amber-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Admin Login
          </CardTitle>
          <CardDescription className="text-gray-600">
            Access the jewelry store admin dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-amber-50 rounded-lg">
              <User className="w-5 h-5 text-amber-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">Secure Authentication</p>
                <p className="text-xs text-gray-600">Login with your Replit account</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-amber-50 rounded-lg">
              <Lock className="w-5 h-5 text-amber-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">Admin Access Only</p>
                <p className="text-xs text-gray-600">Requires admin privileges</p>
              </div>
            </div>
          </div>
          
          <Button 
            onClick={handleLogin}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white"
            size="lg"
          >
            Login with Replit
          </Button>
          
          <div className="text-center">
            <p className="text-xs text-gray-500">
              Only authorized administrators can access this area
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}