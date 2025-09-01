import React from 'react';
import Icon from '../../../components/AppIcon';

const PlatformLogo = () => {
  return (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-soft">
          <Icon name="Video" size={24} color="white" />
        </div>
        <div className="text-center sm:text-left">
          <h1 className="text-2xl font-bold text-foreground">VendorConnect</h1>
          <p className="text-sm text-muted-foreground">Connect. Communicate. Collaborate.</p>
        </div>
      </div>
    </div>
  );
};

export default PlatformLogo;