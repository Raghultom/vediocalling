import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const MobileNumberInput = ({ mobileNumber, setMobileNumber, countryCode, setCountryCode, error }) => {
  const countryOptions = [
    { value: '+1', label: '+1 (US)' },
    { value: '+44', label: '+44 (UK)' },
    { value: '+91', label: '+91 (IN)' },
    { value: '+86', label: '+86 (CN)' },
    { value: '+49', label: '+49 (DE)' },
    { value: '+33', label: '+33 (FR)' },
    { value: '+81', label: '+81 (JP)' },
    { value: '+61', label: '+61 (AU)' }
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-1">
          <Select
            label="Country"
            options={countryOptions}
            value={countryCode}
            onChange={setCountryCode}
            placeholder="Code"
          />
        </div>
        <div className="col-span-2">
          <Input
            label="Mobile Number"
            type="tel"
            placeholder="Enter mobile number"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e?.target?.value)}
            error={error}
            required
          />
        </div>
      </div>
    </div>
  );
};

export default MobileNumberInput;