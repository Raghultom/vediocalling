import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const CallHistoryCard = ({ 
  call, 
  onCallback, 
  onViewDetails, 
  onRate,
  isExpanded = false 
}) => {
  const getCallStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-success bg-success/10';
      case 'missed':
        return 'text-error bg-error/10';
      case 'declined':
        return 'text-warning bg-warning/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const getCallDirectionIcon = (direction) => {
    return direction === 'incoming' ? 'PhoneIncoming' : 'PhoneOutgoing';
  };

  const formatDuration = (seconds) => {
    if (!seconds || seconds === 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs?.toString()?.padStart(2, '0')}`;
  };

  const formatCallDate = (date) => {
    const callDate = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday?.setDate(yesterday?.getDate() - 1);

    if (callDate?.toDateString() === today?.toDateString()) {
      return `Today, ${callDate?.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
      })}`;
    } else if (callDate?.toDateString() === yesterday?.toDateString()) {
      return `Yesterday, ${callDate?.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
      })}`;
    } else {
      return callDate?.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
      });
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-soft hover:shadow-elevation transition-standard">
      {/* Main Call Info */}
      <div className="p-4">
        <div className="flex items-start space-x-3">
          {/* Profile Image */}
          <div className="flex-shrink-0">
            <div className="relative">
              <Image
                src={call?.participant?.avatar}
                alt={call?.participant?.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center ${
                call?.direction === 'incoming' ? 'bg-primary' : 'bg-secondary'
              }`}>
                <Icon 
                  name={getCallDirectionIcon(call?.direction)} 
                  size={12} 
                  color="white" 
                />
              </div>
            </div>
          </div>

          {/* Call Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-foreground truncate">
                  {call?.participant?.name}
                </h3>
                <p className="text-xs text-muted-foreground truncate">
                  {call?.participant?.business || call?.participant?.role}
                </p>
              </div>
              
              {/* Call Status Badge */}
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCallStatusColor(call?.status)}`}>
                {call?.status?.charAt(0)?.toUpperCase() + call?.status?.slice(1)}
              </span>
            </div>

            {/* Call Meta Info */}
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center space-x-1">
                <Icon name="Clock" size={12} className="text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {formatDuration(call?.duration)}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Calendar" size={12} className="text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {formatCallDate(call?.timestamp)}
                </span>
              </div>
              {call?.rating && (
                <div className="flex items-center space-x-1">
                  <Icon name="Star" size={12} className="text-warning fill-current" />
                  <span className="text-xs text-muted-foreground">
                    {call?.rating}/5
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCallback(call)}
              iconName="Phone"
              iconPosition="left"
              iconSize={14}
            >
              Call Back
            </Button>
            
            {call?.status === 'completed' && !call?.rating && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRate(call)}
                iconName="Star"
                iconPosition="left"
                iconSize={14}
              >
                Rate
              </Button>
            )}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewDetails(call)}
            iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
            iconPosition="right"
            iconSize={14}
          >
            {isExpanded ? 'Less' : 'Details'}
          </Button>
        </div>
      </div>
      {/* Expanded Details */}
      {isExpanded && (
        <div className="border-t border-border px-4 py-3 bg-muted/30">
          <div className="space-y-3">
            {/* Call Notes */}
            {call?.notes && (
              <div>
                <h4 className="text-xs font-medium text-foreground mb-1">Notes</h4>
                <p className="text-xs text-muted-foreground">{call?.notes}</p>
              </div>
            )}

            {/* Call Timeline */}
            <div>
              <h4 className="text-xs font-medium text-foreground mb-2">Call Timeline</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span className="text-xs text-muted-foreground">
                    Call initiated at {new Date(call.timestamp)?.toLocaleTimeString('en-US', { 
                      hour: 'numeric', 
                      minute: '2-digit', 
                      hour12: true 
                    })}
                  </span>
                </div>
                {call?.status === 'completed' && (
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-success"></div>
                    <span className="text-xs text-muted-foreground">
                      Call ended after {formatDuration(call?.duration)}
                    </span>
                  </div>
                )}
                {call?.status === 'missed' && (
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-error"></div>
                    <span className="text-xs text-muted-foreground">
                      Call missed - no answer
                    </span>
                  </div>
                )}
                {call?.status === 'declined' && (
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-warning"></div>
                    <span className="text-xs text-muted-foreground">
                      Call declined by {call?.direction === 'incoming' ? 'you' : 'participant'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Actions */}
            <div className="flex items-center space-x-2 pt-2">
              <Button
                variant="ghost"
                size="xs"
                iconName="MessageSquare"
                iconPosition="left"
                iconSize={12}
              >
                Send Message
              </Button>
              <Button
                variant="ghost"
                size="xs"
                iconName="UserPlus"
                iconPosition="left"
                iconSize={12}
              >
                Add Contact
              </Button>
              <Button
                variant="ghost"
                size="xs"
                iconName="Share"
                iconPosition="left"
                iconSize={12}
              >
                Share
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CallHistoryCard;