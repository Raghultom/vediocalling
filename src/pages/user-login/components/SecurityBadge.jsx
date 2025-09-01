import React from 'react';
import Icon from '../../../components/AppIcon';

const SecurityBadge = () => {
  return (
    <div className="flex items-center justify-center space-x-4 mt-8">
      {/* SSL Security */}
      <div className="flex items-center space-x-1">
        <Icon name="Shield" size={16} className="text-success" />
        <span className="text-xs text-muted-foreground">SSL Secured</span>
      </div>

      {/* Privacy Protection */}
      <div className="flex items-center space-x-1">
        <Icon name="Lock" size={16} className="text-success" />
        <span className="text-xs text-muted-foreground">Privacy Protected</span>
      </div>

      {/* 24/7 Support */}
      <div className="flex items-center space-x-1">
        <Icon name="Headphones" size={16} className="text-primary" />
        <span className="text-xs text-muted-foreground">24/7 Support</span>
      </div>
    </div>
  );
};

export default SecurityBadge;