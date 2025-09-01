import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const CallNotificationBanner = ({ 
  isVisible = false,
  callerName = 'Unknown Caller',
  callerType = 'buyer', // 'buyer' or 'vendor'
  callType = 'incoming', // 'incoming', 'connecting', 'failed'
  onAccept,
  onReject,
  onDismiss,
  autoHideDelay = 30000 // 30 seconds for incoming calls
}) => {
  const [timeLeft, setTimeLeft] = useState(Math.floor(autoHideDelay / 1000));

  useEffect(() => {
    if (isVisible && callType === 'incoming') {
      const interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            onDismiss?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isVisible, callType, onDismiss]);

  useEffect(() => {
    if (isVisible) {
      setTimeLeft(Math.floor(autoHideDelay / 1000));
    }
  }, [isVisible, autoHideDelay]);

  if (!isVisible) {
    return null;
  }

  const getNotificationContent = () => {
    switch (callType) {
      case 'incoming':
        return {
          title: 'Incoming Call',
          message: `${callerName} wants to connect`,
          icon: 'Phone',
          bgColor: 'bg-primary',
          showActions: true
        };
      case 'connecting':
        return {
          title: 'Connecting...',
          message: `Connecting to ${callerName}`,
          icon: 'Loader2',
          bgColor: 'bg-warning',
          showActions: false
        };
      case 'failed':
        return {
          title: 'Call Failed',
          message: `Unable to connect to ${callerName}`,
          icon: 'PhoneOff',
          bgColor: 'bg-error',
          showActions: false
        };
      default:
        return {
          title: 'Call Notification',
          message: callerName,
          icon: 'Phone',
          bgColor: 'bg-primary',
          showActions: false
        };
    }
  };

  const content = getNotificationContent();

  return (
    <div className="fixed top-0 left-0 right-0 z-300 animate-in slide-in-from-top duration-300">
      {/* Desktop Notification */}
      <div className="hidden md:block">
        <div className="max-w-md mx-auto mt-4 mr-4 ml-auto">
          <div className={`${content?.bgColor} text-white rounded-lg shadow-elevation p-4`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                  <Icon 
                    name={content?.icon} 
                    size={20} 
                    color="white"
                    className={content?.icon === 'Loader2' ? 'animate-spin' : ''}
                  />
                </div>
                <div>
                  <p className="font-medium">{content?.title}</p>
                  <p className="text-sm opacity-90">{content?.message}</p>
                  {callType === 'incoming' && (
                    <p className="text-xs opacity-75 font-mono mt-1">
                      Auto-dismiss in {timeLeft}s
                    </p>
                  )}
                </div>
              </div>
              
              {!content?.showActions && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onDismiss}
                  className="text-white hover:bg-white/10 p-1"
                >
                  <Icon name="X" size={16} />
                </Button>
              )}
            </div>

            {content?.showActions && (
              <div className="flex items-center justify-end space-x-2 mt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onReject}
                  className="text-white hover:bg-white/10"
                >
                  <Icon name="PhoneOff" size={16} className="mr-1" />
                  Decline
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={onAccept}
                  className="bg-white text-primary hover:bg-white/90"
                >
                  <Icon name="Phone" size={16} className="mr-1" />
                  Accept
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Mobile Full-Width Banner */}
      <div className="md:hidden">
        <div className={`${content?.bgColor} text-white px-4 py-4`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 flex-1">
              <div className="w-12 h-12 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                <Icon 
                  name={content?.icon} 
                  size={24} 
                  color="white"
                  className={content?.icon === 'Loader2' ? 'animate-spin' : ''}
                />
              </div>
              <div className="flex-1">
                <p className="font-medium text-lg">{content?.title}</p>
                <p className="text-sm opacity-90">{content?.message}</p>
                {callType === 'incoming' && (
                  <p className="text-xs opacity-75 font-mono mt-1">
                    {timeLeft}s remaining
                  </p>
                )}
              </div>
            </div>
            
            {!content?.showActions && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onDismiss}
                className="text-white hover:bg-white/10 p-2"
              >
                <Icon name="X" size={20} />
              </Button>
            )}
          </div>

          {content?.showActions && (
            <div className="flex items-center space-x-3 mt-4">
              <Button
                variant="ghost"
                size="default"
                onClick={onReject}
                className="flex-1 text-white hover:bg-white/10 border border-white/20"
              >
                <Icon name="PhoneOff" size={20} className="mr-2" />
                Decline
              </Button>
              <Button
                variant="secondary"
                size="default"
                onClick={onAccept}
                className="flex-1 bg-white text-primary hover:bg-white/90"
              >
                <Icon name="Phone" size={20} className="mr-2" />
                Accept
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CallNotificationBanner;