import React from 'react';
import RegistrationHeader from './components/RegistrationHeader';
import WelcomeSection from './components/WelcomeSection';
import RegistrationForm from './components/RegistrationForm';

const UserRegistration = () => {
  return (
    <div className="min-h-screen bg-background">
      <RegistrationHeader />
      <main className="flex-1 py-8 px-4">
        <div className="max-w-md mx-auto">
          <WelcomeSection />
          <RegistrationForm />
        </div>
      </main>
      {/* Footer */}
      <footer className="py-6 px-4 border-t border-border bg-card">
        <div className="max-w-md mx-auto text-center">
          <p className="text-xs text-muted-foreground">
            By creating an account, you agree to our Terms of Service and Privacy Policy
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            © {new Date()?.getFullYear()} VendorConnect. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default UserRegistration;