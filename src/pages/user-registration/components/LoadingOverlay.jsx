import React from 'react';
import Icon from '../../../components/AppIcon';

const LoadingOverlay = ({ isVisible, message = 'Creating your account...' }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-500 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-card rounded-lg p-8 max-w-sm mx-4 text-center shadow-elevation">
        <div className="w-12 h-12 mx-auto mb-4 bg-primary rounded-full flex items-center justify-center">
          <Icon name="Loader2" size={24} color="white" className="animate-spin" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">Please Wait</h3>
        <p className="text-muted-foreground text-sm">{message}</p>
      </div>
    </div>
  );
};

export default LoadingOverlay;