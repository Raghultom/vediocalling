import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import MobileNumberInput from './MobileNumberInput';
import PasswordFields from './PasswordFields';
import RoleSelection from './RoleSelection';

const RegistrationForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  // Form state
  const [countryCode, setCountryCode] = useState('+1');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  
  // Error state
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    // Mobile number validation
    if (!mobileNumber?.trim()) {
      newErrors.mobileNumber = 'Mobile number is required';
    } else if (!/^\d{10}$/?.test(mobileNumber?.replace(/\D/g, ''))) {
      newErrors.mobileNumber = 'Please enter a valid 10-digit mobile number';
    }

    // Password validation
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password?.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }

    // Confirm password validation
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Role validation
    if (!selectedRole) {
      newErrors.role = 'Please select your role';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Navigate to appropriate dashboard based on role
      const dashboardPath = selectedRole === 'buyer' ? '/buyer-dashboard' : '/vendor-dashboard';
      navigate(dashboardPath);
    } catch (error) {
      console.error('Registration failed:', error);
      setErrors({ submit: 'Registration failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = mobileNumber && password && confirmPassword && selectedRole && Object.keys(errors)?.length === 0;

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-card rounded-lg border border-border shadow-soft p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <MobileNumberInput
            mobileNumber={mobileNumber}
            setMobileNumber={setMobileNumber}
            countryCode={countryCode}
            setCountryCode={setCountryCode}
            error={errors?.mobileNumber}
          />

          <PasswordFields
            password={password}
            setPassword={setPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            passwordError={errors?.password}
            confirmPasswordError={errors?.confirmPassword}
          />

          <RoleSelection
            selectedRole={selectedRole}
            setSelectedRole={setSelectedRole}
            error={errors?.role}
          />

          {errors?.submit && (
            <div className="p-3 bg-error/10 border border-error/20 rounded-lg">
              <p className="text-error text-sm">{errors?.submit}</p>
            </div>
          )}

          <Button
            type="submit"
            variant="default"
            size="lg"
            fullWidth
            loading={isLoading}
            disabled={!isFormValid}
          >
            Create Account
          </Button>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/user-login')}
                className="text-primary hover:text-primary/80 font-medium transition-micro"
              >
                Sign In
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;