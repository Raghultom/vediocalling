import React from 'react';
import VendorCard from './VendorCard';
import Icon from '../../../components/AppIcon';

const VendorGrid = ({ 
  vendors, 
  isLoading, 
  onCallNow, 
  onRefresh,
  searchQuery,
  activeFilters 
}) => {
  const handlePullToRefresh = () => {
    if (onRefresh) {
      onRefresh();
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 })?.map((_, index) => (
          <div key={index} className="bg-card border border-border rounded-lg p-4 animate-pulse">
            <div className="flex items-start space-x-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-muted"></div>
              <div className="flex-1">
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-3 bg-muted rounded w-2/3 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            </div>
            <div className="h-3 bg-muted rounded mb-2"></div>
            <div className="h-3 bg-muted rounded w-3/4 mb-4"></div>
            <div className="h-8 bg-muted rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!vendors || vendors?.length === 0) {
    return (
      <div className="text-center py-12">
        <Icon name="Users" size={64} className="text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">
          {searchQuery || activeFilters?.length > 0 ? 'No vendors found' : 'No vendors available'}
        </h3>
        <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
          {searchQuery || activeFilters?.length > 0 
            ? 'Try adjusting your search terms or filters to find more vendors.'
            : 'There are currently no vendors available. Please check back later or try refreshing the page.'
          }
        </p>
        {onRefresh && (
          <button
            onClick={handlePullToRefresh}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-micro"
          >
            <Icon name="RefreshCw" size={16} />
            <span>Refresh</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Pull to refresh indicator for mobile */}
      <div className="md:hidden">
        <div className="flex items-center justify-center py-2">
          <button
            onClick={handlePullToRefresh}
            className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-micro"
          >
            <Icon name="RefreshCw" size={16} />
            <span className="text-sm">Pull to refresh</span>
          </button>
        </div>
      </div>
      {/* Vendor Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {vendors?.map((vendor) => (
          <VendorCard
            key={vendor?.id}
            vendor={vendor}
            onCallNow={onCallNow}
          />
        ))}
      </div>
      {/* Load More Button */}
      {vendors?.length >= 20 && (
        <div className="text-center pt-6">
          <button className="inline-flex items-center space-x-2 px-6 py-3 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-micro">
            <Icon name="Plus" size={16} />
            <span>Load More Vendors</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default VendorGrid;