import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const AvailabilityToggle = ({ isAvailable = true, onToggle }) => {
  const [available, setAvailable] = useState(isAvailable);

  const handleToggle = () => {
    const newStatus = !available;
    setAvailable(newStatus);
    onToggle?.(newStatus);
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-soft">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full ${available ? 'bg-success animate-pulse' : 'bg-muted'}`}></div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              {available ? 'Available for Calls' : 'Currently Offline'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {available ? 'Buyers can contact you now' : 'You won\'t receive call requests'}
            </p>
          </div>
        </div>
        
        <button
          onClick={handleToggle}
          className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
            available ? 'bg-success' : 'bg-muted'
          }`}
        >
          <span
            className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
              available ? 'translate-x-7' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
      
      {available && (
        <div className="mt-4 flex items-center space-x-2 text-sm text-success">
          <Icon name="CheckCircle" size={16} />
          <span>Ready to receive calls</span>
        </div>
      )}
    </div>
  );
};

export default AvailabilityToggle;