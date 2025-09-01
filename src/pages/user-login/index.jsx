import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PlatformLogo from './components/PlatformLogo';
import LoginForm from './components/LoginForm';
import SecurityBadge from './components/SecurityBadge';

const UserLogin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already authenticated
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const userRole = localStorage.getItem('userRole');
    
    if (isAuthenticated === 'true' && userRole) {
      // Redirect to appropriate dashboard
      if (userRole === 'buyer') {
        navigate('/buyer-dashboard');
      } else if (userRole === 'vendor') {
        navigate('/vendor-dashboard');
      }
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <div className="flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md mx-auto">
          {/* Platform Logo */}
          <PlatformLogo />
          
          {/* Login Form */}
          <LoginForm />
          
          {/* Security Badge */}
          <SecurityBadge />
        </div>
      </div>
      {/* Footer */}
      <footer className="absolute bottom-0 left-0 right-0 py-4 px-4 border-t border-border bg-card/50">
        <div className="max-w-md mx-auto text-center">
          <p className="text-xs text-muted-foreground">
            © {new Date()?.getFullYear()} VendorConnect. All rights reserved.
          </p>
          <div className="flex items-center justify-center space-x-4 mt-2">
            <button className="text-xs text-muted-foreground hover:text-foreground transition-micro">
              Privacy Policy
            </button>
            <span className="text-xs text-border">•</span>
            <button className="text-xs text-muted-foreground hover:text-foreground transition-micro">
              Terms of Service
            </button>
            <span className="text-xs text-border">•</span>
            <button className="text-xs text-muted-foreground hover:text-foreground transition-micro">
              Help
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UserLogin;