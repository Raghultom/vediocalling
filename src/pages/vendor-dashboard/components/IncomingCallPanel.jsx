import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const IncomingCallPanel = ({ pendingCalls = [], onAcceptCall, onRejectCall }) => {
  const mockPendingCalls = [
    {
      id: 1,
      buyerName: "Sarah Johnson",
      buyerAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      serviceRequested: "Web Development Consultation",
      waitingTime: "2 min",
      priority: "high"
    },
    {
      id: 2,
      buyerName: "Michael Chen",
      buyerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      serviceRequested: "Digital Marketing Strategy",
      waitingTime: "5 min",
      priority: "medium"
    }
  ];

  const callsToShow = pendingCalls?.length > 0 ? pendingCalls : mockPendingCalls;

  if (callsToShow?.length === 0) {
    return (
      <div className="bg-card rounded-lg border border-border p-6 shadow-soft">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Incoming Calls</h3>
          <div className="w-2 h-2 bg-muted rounded-full"></div>
        </div>
        <div className="text-center py-8">
          <Icon name="Phone" size={48} className="mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No pending call requests</p>
          <p className="text-sm text-muted-foreground mt-1">You'll see incoming calls here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border shadow-soft">
      <div className="flex items-center justify-between p-6 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">Incoming Calls</h3>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-error rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-error">{callsToShow?.length} pending</span>
        </div>
      </div>
      <div className="divide-y divide-border">
        {callsToShow?.map((call) => (
          <div key={call?.id} className="p-6">
            <div className="flex items-start space-x-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                  <img 
                    src={call?.buyerAvatar} 
                    alt={call?.buyerName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <Icon name="User" size={20} className="text-muted-foreground" style={{display: 'none'}} />
                </div>
                {call?.priority === 'high' && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-error rounded-full flex items-center justify-center">
                    <Icon name="AlertCircle" size={10} color="white" />
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-foreground truncate">{call?.buyerName}</h4>
                  <span className="text-xs text-muted-foreground">Waiting {call?.waitingTime}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{call?.serviceRequested}</p>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onRejectCall?.(call?.id)}
                    iconName="PhoneOff"
                    iconPosition="left"
                    iconSize={16}
                  >
                    Decline
                  </Button>
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => onAcceptCall?.(call?.id)}
                    iconName="Phone"
                    iconPosition="left"
                    iconSize={16}
                  >
                    Accept Call
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IncomingCallPanel;