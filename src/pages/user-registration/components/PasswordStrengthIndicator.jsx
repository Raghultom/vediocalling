import React from 'react';

const PasswordStrengthIndicator = ({ password }) => {
  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '', color: '' };
    
    let score = 0;
    const checks = {
      length: password?.length >= 8,
      lowercase: /[a-z]/?.test(password),
      uppercase: /[A-Z]/?.test(password),
      number: /\d/?.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/?.test(password)
    };
    
    score = Object.values(checks)?.filter(Boolean)?.length;
    
    if (score <= 2) return { strength: score, label: 'Weak', color: 'bg-error' };
    if (score <= 3) return { strength: score, label: 'Fair', color: 'bg-warning' };
    if (score <= 4) return { strength: score, label: 'Good', color: 'bg-accent' };
    return { strength: score, label: 'Strong', color: 'bg-success' };
  };

  const { strength, label, color } = getPasswordStrength(password);

  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-muted-foreground">Password Strength</span>
        <span className={`text-xs font-medium ${
          label === 'Weak' ? 'text-error' :
          label === 'Fair' ? 'text-warning' :
          label === 'Good' ? 'text-accent' : 'text-success'
        }`}>
          {label}
        </span>
      </div>
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5]?.map((level) => (
          <div
            key={level}
            className={`h-1 flex-1 rounded-full ${
              level <= strength ? color : 'bg-muted'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default PasswordStrengthIndicator;