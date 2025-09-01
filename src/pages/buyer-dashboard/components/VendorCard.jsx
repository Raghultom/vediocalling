import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const VendorCard = ({ vendor, onCallNow }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleCallClick = async () => {
    setIsLoading(true);
    try {
      await onCallNow(vendor);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Icon
        key={index}
        name="Star"
        size={14}
        className={index < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}
      />
    ));
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 shadow-soft hover:shadow-elevation transition-standard">
      {/* Vendor Profile Section */}
      <div className="flex items-start space-x-3 mb-3">
        <div className="relative">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-muted">
            <Image
              src={vendor?.profilePhoto}
              alt={vendor?.businessName}
              className="w-full h-full object-cover"
            />
          </div>
          {vendor?.isOnline && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success border-2 border-card rounded-full"></div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground text-sm truncate">
            {vendor?.businessName}
          </h3>
          <p className="text-xs text-muted-foreground mb-1">
            {vendor?.serviceCategory}
          </p>
          
          {/* Rating */}
          <div className="flex items-center space-x-1">
            <div className="flex items-center">
              {renderStars(vendor?.rating)}
            </div>
            <span className="text-xs text-muted-foreground">
              ({vendor?.reviewCount})
            </span>
          </div>
        </div>
      </div>
      {/* Description */}
      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
        {vendor?.description}
      </p>
      {/* Location & Availability */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-1">
          <Icon name="MapPin" size={12} className="text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            {vendor?.location}
          </span>
        </div>
        
        <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${
          vendor?.isOnline 
            ? 'bg-success/10 text-success' :'bg-muted text-muted-foreground'
        }`}>
          <div className={`w-2 h-2 rounded-full ${
            vendor?.isOnline ? 'bg-success' : 'bg-muted-foreground'
          }`}></div>
          <span>{vendor?.isOnline ? 'Available' : 'Offline'}</span>
        </div>
      </div>
      {/* Call Now Button */}
      <Button
        variant="default"
        size="sm"
        fullWidth
        loading={isLoading}
        disabled={!vendor?.isOnline}
        onClick={handleCallClick}
        iconName="Video"
        iconPosition="left"
        iconSize={16}
      >
        {vendor?.isOnline ? 'Call Now' : 'Unavailable'}
      </Button>
    </div>
  );
};

export default VendorCard;