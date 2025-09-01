import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const RecentCallsWidget = ({ recentCalls, onReconnect }) => {
  const getCallStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return { name: 'Phone', color: 'text-success' };
      case 'missed':
        return { name: 'PhoneMissed', color: 'text-error' };
      case 'declined':
        return { name: 'PhoneOff', color: 'text-warning' };
      default:
        return { name: 'Phone', color: 'text-muted-foreground' };
    }
  };

  const formatCallDuration = (duration) => {
    if (!duration) return '';
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds?.toString()?.padStart(2, '0')}`;
  };

  const formatCallTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date?.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    } else {
      return date?.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  if (!recentCalls || recentCalls?.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Recent Calls</h3>
        <div className="text-center py-8">
          <Icon name="Phone" size={48} className="text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">No recent calls</p>
          <p className="text-muted-foreground text-xs mt-1">
            Start connecting with vendors to see your call history here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Recent Calls</h3>
        <Button variant="ghost" size="sm">
          <Icon name="MoreHorizontal" size={16} />
        </Button>
      </div>
      <div className="space-y-3">
        {recentCalls?.slice(0, 5)?.map((call) => {
          const statusIcon = getCallStatusIcon(call?.status);
          
          return (
            <div key={call?.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 transition-micro">
              {/* Vendor Avatar */}
              <div className="relative">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-muted">
                  <Image
                    src={call?.vendor?.profilePhoto}
                    alt={call?.vendor?.businessName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-card flex items-center justify-center ${
                  call?.status === 'completed' ? 'bg-success' : 
                  call?.status === 'missed' ? 'bg-error' : 'bg-warning'
                }`}>
                  <Icon 
                    name={statusIcon?.name} 
                    size={8} 
                    className="text-white"
                  />
                </div>
              </div>
              {/* Call Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground truncate">
                    {call?.vendor?.businessName}
                  </p>
                  <span className="text-xs text-muted-foreground">
                    {formatCallTime(call?.timestamp)}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2 mt-1">
                  <Icon 
                    name={statusIcon?.name} 
                    size={12} 
                    className={statusIcon?.color}
                  />
                  <span className={`text-xs ${statusIcon?.color}`}>
                    {call?.status?.charAt(0)?.toUpperCase() + call?.status?.slice(1)}
                  </span>
                  {call?.duration && (
                    <>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">
                        {formatCallDuration(call?.duration)}
                      </span>
                    </>
                  )}
                </div>
              </div>
              {/* Quick Actions */}
              <div className="flex items-center space-x-1">
                {call?.vendor?.isOnline && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onReconnect(call?.vendor)}
                    className="w-8 h-8"
                  >
                    <Icon name="Video" size={14} className="text-primary" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8"
                >
                  <Icon name="MessageSquare" size={14} className="text-muted-foreground" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
      {recentCalls?.length > 5 && (
        <div className="mt-4 pt-3 border-t border-border">
          <Button variant="ghost" size="sm" fullWidth>
            View All Call History
            <Icon name="ArrowRight" size={14} className="ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default RecentCallsWidget;