import React from 'react';
import Input from '../../../components/ui/Input';
import PasswordStrengthIndicator from './PasswordStrengthIndicator';

const PasswordFields = ({ 
  password, 
  setPassword, 
  confirmPassword, 
  setConfirmPassword, 
  passwordError, 
  confirmPasswordError 
}) => {
  return (
    <div className="space-y-4">
      <div>
        <Input
          label="Password"
          type="password"
          placeholder="Create a strong password"
          value={password}
          onChange={(e) => setPassword(e?.target?.value)}
          error={passwordError}
          required
        />
        <PasswordStrengthIndicator password={password} />
      </div>
      <Input
        label="Confirm Password"
        type="password"
        placeholder="Confirm your password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e?.target?.value)}
        error={confirmPasswordError}
        required
      />
    </div>
  );
};

export default PasswordFields;