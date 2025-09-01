import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const CallControlOverlay = ({ 
  isCallActive = false,
  isMuted = false,
  isCameraOff = false,
  onMuteToggle,
  onCameraToggle,
  onEndCall,
  callDuration = 0,
  participantName = 'Unknown User'
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [hideTimeout, setHideTimeout] = useState(null);

  useEffect(() => {
    if (isCallActive) {
      // Auto-hide controls after 5 seconds of inactivity
      const timeout = setTimeout(() => {
        setIsVisible(false);
      }, 5000);
      
      setHideTimeout(timeout);
      
      return () => {
        if (timeout) clearTimeout(timeout);
      };
    }
  }, [isCallActive, isVisible]);

  const handleShowControls = () => {
    setIsVisible(true);
    if (hideTimeout) {
      clearTimeout(hideTimeout);
    }
    
    // Set new timeout to hide controls
    const timeout = setTimeout(() => {
      setIsVisible(false);
    }, 5000);
    
    setHideTimeout(timeout);
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins?.toString()?.padStart(2, '0')}:${secs?.toString()?.padStart(2, '0')}`;
  };

  if (!isCallActive) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 z-400 bg-black bg-opacity-90 flex flex-col"
      onClick={handleShowControls}
    >
      {/* Call Info Header */}
      <div className={`absolute top-0 left-0 right-0 z-410 bg-black bg-opacity-50 transition-standard ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'
      }`}>
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <Icon name="User" size={20} color="white" />
            </div>
            <div>
              <p className="text-white font-medium">{participantName}</p>
              <p className="text-white text-sm opacity-75 font-mono">
                {formatDuration(callDuration)}
              </p>
            </div>
          </div>
          
          {/* Connection Status */}
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            <span className="text-white text-sm">Connected</span>
          </div>
        </div>
      </div>

      {/* Video Content Area */}
      <div className="flex-1 relative">
        {/* Placeholder for video streams */}
        <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-4 mx-auto">
              <Icon name="User" size={48} color="white" />
            </div>
            <p className="text-white text-lg font-medium">{participantName}</p>
            <p className="text-white text-sm opacity-75">Video call in progress</p>
          </div>
        </div>
      </div>

      {/* Call Controls */}
      <div className={`absolute bottom-0 left-0 right-0 z-410 transition-standard ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full'
      }`}>
        <div className="bg-black bg-opacity-50 px-6 py-8">
          <div className="flex items-center justify-center space-x-6">
            {/* Mute Button */}
            <Button
              variant={isMuted ? "destructive" : "secondary"}
              size="lg"
              onClick={onMuteToggle}
              className="w-14 h-14 rounded-full"
            >
              <Icon 
                name={isMuted ? "MicOff" : "Mic"} 
                size={24} 
                color="white"
              />
            </Button>

            {/* End Call Button */}
            <Button
              variant="destructive"
              size="lg"
              onClick={onEndCall}
              className="w-16 h-16 rounded-full bg-error hover:bg-error/90"
            >
              <Icon name="PhoneOff" size={28} color="white" />
            </Button>

            {/* Camera Button */}
            <Button
              variant={isCameraOff ? "destructive" : "secondary"}
              size="lg"
              onClick={onCameraToggle}
              className="w-14 h-14 rounded-full"
            >
              <Icon 
                name={isCameraOff ? "VideoOff" : "Video"} 
                size={24} 
                color="white"
              />
            </Button>
          </div>

          {/* Additional Controls */}
          <div className="flex items-center justify-center space-x-4 mt-6">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10"
            >
              <Icon name="MessageSquare" size={20} className="mr-2" />
              Chat
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10"
            >
              <Icon name="Users" size={20} className="mr-2" />
              Participants
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10"
            >
              <Icon name="Settings" size={20} className="mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </div>

      {/* Tap to show controls hint */}
      {!isVisible && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-410">
          <div className="bg-black bg-opacity-50 px-4 py-2 rounded-full">
            <p className="text-white text-sm opacity-75">Tap to show controls</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CallControlOverlay;