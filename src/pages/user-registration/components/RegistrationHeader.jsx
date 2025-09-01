import React from 'react';
import Icon from '../../../components/AppIcon';

const RegistrationHeader = () => {
  return (
    <header className="bg-card border-b border-border shadow-soft">
      <div className="flex items-center justify-center h-16 px-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Icon name="Video" size={20} color="white" />
          </div>
          <span className="text-xl font-semibold text-foreground">VendorConnect</span>
        </div>
      </div>
    </header>
  );
};

export default RegistrationHeader;