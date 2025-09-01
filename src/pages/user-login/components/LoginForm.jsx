import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    countryCode: '+1',
    mobileNumber: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Mock credentials for testing
  const mockCredentials = {
    buyer: { mobile: '1234567890', password: 'buyer123' },
    vendor: { mobile: '0987654321', password: 'vendor123' }
  };

  const countryCodeOptions = [
    { value: '+1', label: '+1 (US)' },
    { value: '+44', label: '+44 (UK)' },
    { value: '+91', label: '+91 (IN)' },
    { value: '+86', label: '+86 (CN)' },
    { value: '+49', label: '+49 (DE)' },
    { value: '+33', label: '+33 (FR)' },
    { value: '+81', label: '+81 (JP)' },
    { value: '+61', label: '+61 (AU)' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.mobileNumber?.trim()) {
      newErrors.mobileNumber = 'Mobile number is required';
    } else if (!/^\d{10}$/?.test(formData?.mobileNumber?.replace(/\s/g, ''))) {
      newErrors.mobileNumber = 'Please enter a valid 10-digit mobile number';
    }

    if (!formData?.password?.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData?.password?.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
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
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Check mock credentials
      const isBuyer = formData?.mobileNumber === mockCredentials?.buyer?.mobile && 
                     formData?.password === mockCredentials?.buyer?.password;
      const isVendor = formData?.mobileNumber === mockCredentials?.vendor?.mobile && 
                      formData?.password === mockCredentials?.vendor?.password;

      if (isBuyer) {
        // Store user role in localStorage
        localStorage.setItem('userRole', 'buyer');
        localStorage.setItem('isAuthenticated', 'true');
        navigate('/buyer-dashboard');
      } else if (isVendor) {
        // Store user role in localStorage
        localStorage.setItem('userRole', 'vendor');
        localStorage.setItem('isAuthenticated', 'true');
        navigate('/vendor-dashboard');
      } else {
        setErrors({
          general: `Invalid credentials. Use: Buyer (${mockCredentials?.buyer?.mobile}/${mockCredentials?.buyer?.password}) or Vendor (${mockCredentials?.vendor?.mobile}/${mockCredentials?.vendor?.password})`
        });
      }
    } catch (error) {
      setErrors({
        general: 'Network error. Please check your connection and try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = formData?.mobileNumber?.trim() && formData?.password?.trim();

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-card rounded-lg shadow-elevation p-6 border border-border">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold text-foreground mb-2">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to your VendorConnect account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* General Error */}
          {errors?.general && (
            <div className="bg-error/10 border border-error/20 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <Icon name="AlertCircle" size={16} className="text-error mt-0.5 flex-shrink-0" />
                <p className="text-sm text-error">{errors?.general}</p>
              </div>
            </div>
          )}

          {/* Mobile Number */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Mobile Number</label>
            <div className="flex space-x-2">
              <div className="w-24">
                <Select
                  options={countryCodeOptions}
                  value={formData?.countryCode}
                  onChange={(value) => handleInputChange('countryCode', value)}
                  placeholder="Code"
                />
              </div>
              <div className="flex-1">
                <Input
                  type="tel"
                  placeholder="Enter mobile number"
                  value={formData?.mobileNumber}
                  onChange={(e) => handleInputChange('mobileNumber', e?.target?.value)}
                  error={errors?.mobileNumber}
                  maxLength={10}
                />
              </div>
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Password</label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={formData?.password}
                onChange={(e) => handleInputChange('password', e?.target?.value)}
                error={errors?.password}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-micro"
              >
                <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={16} />
              </button>
            </div>
          </div>

          {/* Sign In Button */}
          <Button
            type="submit"
            variant="default"
            size="lg"
            fullWidth
            loading={isLoading}
            disabled={!isFormValid || isLoading}
            className="mt-6"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>

          {/* Forgot Password */}
          <div className="text-center">
            <button
              type="button"
              className="text-sm text-primary hover:text-primary/80 transition-micro"
              onClick={() => {
                // Handle forgot password
                console.log('Forgot password clicked');
              }}
            >
              Forgot Password?
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          {/* Create Account */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              New user?{' '}
              <button
                type="button"
                onClick={() => navigate('/user-registration')}
                className="text-primary hover:text-primary/80 font-medium transition-micro"
              >
                Create Account
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;