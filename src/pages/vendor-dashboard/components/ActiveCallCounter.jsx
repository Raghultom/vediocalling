import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ActiveCallCounter = ({ 
  isCallActive = false, 
  callDuration = 0, 
  participantName = '',
  onEndCall,
  onToggleMute,
  onToggleCamera,
  isMuted = false,
  isCameraOff = false
}) => {
  const [duration, setDuration] = useState(callDuration);

  useEffect(() => {
    let interval;
    if (isCallActive) {
      interval = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    } else {
      setDuration(0);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isCallActive]);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins?.toString()?.padStart(2, '0')}:${secs?.toString()?.padStart(2, '0')}`;
  };

  if (!isCallActive) {
    return null;
  }

  return (
    <div className="fixed top-20 right-4 z-200 bg-card border border-border rounded-lg shadow-elevation p-4 min-w-[280px]">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-success">Call Active</span>
        </div>
        <span className="text-sm font-mono text-foreground">{formatDuration(duration)}</span>
      </div>
      
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
          <Icon name="User" size={16} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">
            {participantName || 'Unknown Caller'}
          </p>
          <p className="text-xs text-muted-foreground">Connected</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button
          variant={isMuted ? "destructive" : "outline"}
          size="sm"
          onClick={onToggleMute}
          iconName={isMuted ? "MicOff" : "Mic"}
          iconSize={16}
        >
          {isMuted ? 'Unmute' : 'Mute'}
        </Button>
        
        <Button
          variant={isCameraOff ? "destructive" : "outline"}
          size="sm"
          onClick={onToggleCamera}
          iconName={isCameraOff ? "VideoOff" : "Video"}
          iconSize={16}
        >
          {isCameraOff ? 'Camera' : 'Video'}
        </Button>
        
        <Button
          variant="destructive"
          size="sm"
          onClick={onEndCall}
          iconName="PhoneOff"
          iconSize={16}
        >
          End
        </Button>
      </div>
    </div>
  );
};

export default ActiveCallCounter;