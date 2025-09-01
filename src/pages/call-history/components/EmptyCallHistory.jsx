import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EmptyCallHistory = ({ 
  filterType = 'all',
  onClearFilters,
  onStartCalling 
}) => {
  const getEmptyStateContent = () => {
    switch (filterType) {
      case 'completed':
        return {
          icon: 'PhoneCall',
          title: 'No Completed Calls',
          description: 'You haven\'t completed any calls yet. Start connecting with vendors to build your call history.',
          actionText: 'Browse Vendors',
          showClearFilters: true
        };
      case 'missed':
        return {
          icon: 'PhoneMissed',
          title: 'No Missed Calls',
          description: 'Great! You haven\'t missed any calls. Keep staying connected with your contacts.',
          actionText: 'Make a Call',
          showClearFilters: true
        };
      case 'declined':
        return {
          icon: 'PhoneOff',
          title: 'No Declined Calls',
          description: 'You haven\'t declined any calls. All your call interactions have been positive.',
          actionText: 'View All Calls',
          showClearFilters: true
        };
      default:
        return {
          icon: 'Phone',
          title: 'No Call History',
          description: 'Start making calls to vendors and buyers to build your communication history. Your past conversations will appear here.',
          actionText: 'Start Calling',
          showClearFilters: false
        };
    }
  };

  const content = getEmptyStateContent();

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {/* Icon */}
      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
        <Icon 
          name={content?.icon} 
          size={40} 
          className="text-muted-foreground" 
        />
      </div>
      {/* Content */}
      <div className="max-w-md">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          {content?.title}
        </h3>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          {content?.description}
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-3">
          <Button
            variant="default"
            onClick={onStartCalling}
            iconName="Phone"
            iconPosition="left"
            iconSize={16}
          >
            {content?.actionText}
          </Button>
          
          {content?.showClearFilters && (
            <Button
              variant="outline"
              onClick={onClearFilters}
              iconName="RotateCcw"
              iconPosition="left"
              iconSize={16}
            >
              Clear Filters
            </Button>
          )}
        </div>
      </div>
      {/* Additional Tips */}
      <div className="mt-12 max-w-lg">
        <div className="bg-muted/30 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Icon name="Lightbulb" size={20} className="text-warning mt-0.5" />
            <div className="text-left">
              <h4 className="text-sm font-medium text-foreground mb-1">Pro Tip</h4>
              <p className="text-xs text-muted-foreground">
                Regular communication helps build stronger business relationships. 
                Use video calls to discuss requirements, negotiate deals, and provide better customer service.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyCallHistory;