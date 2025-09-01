import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ProfileCompletionWidget = ({ completionPercentage = 65, onEditProfile }) => {
  const completionItems = [
    { id: 1, label: "Profile Photo", completed: true, icon: "Camera" },
    { id: 2, label: "Service Description", completed: true, icon: "FileText" },
    { id: 3, label: "Portfolio Images", completed: false, icon: "Image" },
    { id: 4, label: "Pricing Information", completed: true, icon: "DollarSign" },
    { id: 5, label: "Contact Details", completed: false, icon: "Phone" },
    { id: 6, label: "Availability Schedule", completed: false, icon: "Calendar" }
  ];

  const completedCount = completionItems?.filter(item => item?.completed)?.length;
  const totalCount = completionItems?.length;
  const actualPercentage = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-soft">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Profile Completion</h3>
        <span className="text-sm font-medium text-primary">{actualPercentage}%</span>
      </div>
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-500"
            style={{ width: `${actualPercentage}%` }}
          ></div>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          {completedCount} of {totalCount} sections completed
        </p>
      </div>
      {/* Completion Items */}
      <div className="space-y-3 mb-6">
        {completionItems?.slice(0, 4)?.map((item) => (
          <div key={item?.id} className="flex items-center space-x-3">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
              item?.completed ? 'bg-success' : 'bg-muted'
            }`}>
              {item?.completed ? (
                <Icon name="Check" size={12} color="white" />
              ) : (
                <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
              )}
            </div>
            <div className="flex items-center space-x-2 flex-1">
              <Icon 
                name={item?.icon} 
                size={16} 
                className={item?.completed ? 'text-success' : 'text-muted-foreground'}
              />
              <span className={`text-sm ${
                item?.completed ? 'text-foreground' : 'text-muted-foreground'
              }`}>
                {item?.label}
              </span>
            </div>
            {!item?.completed && (
              <Button
                variant="ghost"
                size="sm"
                iconName="Plus"
                iconSize={14}
                onClick={onEditProfile}
              >
                Add
              </Button>
            )}
          </div>
        ))}
        
        {completionItems?.length > 4 && (
          <div className="text-center pt-2">
            <Button
              variant="ghost"
              size="sm"
              iconName="ChevronDown"
              iconPosition="right"
              iconSize={16}
            >
              Show {completionItems?.length - 4} more
            </Button>
          </div>
        )}
      </div>
      {/* Action Button */}
      <Button
        variant="outline"
        fullWidth
        onClick={onEditProfile}
        iconName="Edit"
        iconPosition="left"
        iconSize={16}
      >
        Complete Profile
      </Button>
      {actualPercentage < 80 && (
        <div className="mt-4 p-3 bg-warning/10 border border-warning/20 rounded-lg">
          <div className="flex items-start space-x-2">
            <Icon name="AlertTriangle" size={16} className="text-warning mt-0.5" />
            <div>
              <p className="text-sm font-medium text-warning">Boost Your Visibility</p>
              <p className="text-xs text-warning/80 mt-1">
                Complete your profile to get 3x more call requests from buyers
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileCompletionWidget;