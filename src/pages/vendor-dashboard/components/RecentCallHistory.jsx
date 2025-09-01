import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecentCallHistory = ({ recentCalls = [], onViewAll }) => {
  const mockRecentCalls = [
    {
      id: 1,
      buyerName: "Emma Wilson",
      buyerAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      callDuration: "15:32",
      callTime: "2 hours ago",
      callStatus: "completed",
      serviceType: "UI/UX Design Review",
      rating: 5
    },
    {
      id: 2,
      buyerName: "David Rodriguez",
      buyerAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      callDuration: "8:45",
      callTime: "4 hours ago",
      callStatus: "completed",
      serviceType: "Business Strategy Discussion",
      rating: 4
    },
    {
      id: 3,
      buyerName: "Lisa Thompson",
      buyerAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
      callDuration: "0:00",
      callTime: "6 hours ago",
      callStatus: "missed",
      serviceType: "Marketing Consultation",
      rating: null
    }
  ];

  const callsToShow = recentCalls?.length > 0 ? recentCalls : mockRecentCalls;

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return { name: 'CheckCircle', color: 'text-success' };
      case 'missed':
        return { name: 'XCircle', color: 'text-error' };
      case 'rejected':
        return { name: 'PhoneOff', color: 'text-warning' };
      default:
        return { name: 'Phone', color: 'text-muted-foreground' };
    }
  };

  const renderStars = (rating) => {
    if (!rating) return null;
    return (
      <div className="flex items-center space-x-1">
        {[...Array(5)]?.map((_, i) => (
          <Icon
            key={i}
            name="Star"
            size={12}
            className={i < rating ? 'text-warning fill-current' : 'text-muted'}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-card rounded-lg border border-border shadow-soft">
      <div className="flex items-center justify-between p-6 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">Recent Calls</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onViewAll}
          iconName="ArrowRight"
          iconPosition="right"
          iconSize={16}
        >
          View All
        </Button>
      </div>
      <div className="divide-y divide-border">
        {callsToShow?.map((call) => {
          const statusIcon = getStatusIcon(call?.callStatus);
          
          return (
            <div key={call?.id} className="p-6 hover:bg-muted/50 transition-micro">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                    <img 
                      src={call?.buyerAvatar} 
                      alt={call?.buyerName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <Icon name="User" size={16} className="text-muted-foreground" style={{display: 'none'}} />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-foreground truncate">{call?.buyerName}</h4>
                    <div className="flex items-center space-x-2">
                      <Icon 
                        name={statusIcon?.name} 
                        size={16} 
                        className={statusIcon?.color}
                      />
                      <span className="text-xs text-muted-foreground">{call?.callTime}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-2 truncate">{call?.serviceType}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-xs text-muted-foreground">
                        Duration: {call?.callDuration}
                      </span>
                      {call?.rating && renderStars(call?.rating)}
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="Phone"
                        iconSize={14}
                      >
                        Call Back
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentCallHistory;