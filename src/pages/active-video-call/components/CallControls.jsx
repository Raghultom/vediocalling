import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CallControls = ({
  isMuted = false,
  isCameraOff = false,
  onMuteToggle,
  onCameraToggle,
  onEndCall,
  callDuration = 0,
  isVisible = true,
  onVisibilityChange
}) => {
  const [showEndCallConfirm, setShowEndCallConfirm] = useState(false);
  const navigate = useNavigate();

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours?.toString()?.padStart(2, '0')}:${mins?.toString()?.padStart(2, '0')}:${secs?.toString()?.padStart(2, '0')}`;
    }
    return `${mins?.toString()?.padStart(2, '0')}:${secs?.toString()?.padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    if (showEndCallConfirm) {
      onEndCall?.();
      navigate('/call-history');
    } else {
      setShowEndCallConfirm(true);
      setTimeout(() => setShowEndCallConfirm(false), 3000);
    }
  };

  const handleMuteToggle = () => {
    onMuteToggle?.();
  };

  const handleCameraToggle = () => {
    onCameraToggle?.();
  };

  return (
    <>
      {/* Call Duration Header */}
      <div className={`absolute top-0 left-0 right-0 z-410 bg-black bg-opacity-50 transition-standard ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'
      }`}>
        <div className="flex items-center justify-center px-6 py-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            <span className="text-white font-mono text-lg font-medium">
              {formatDuration(callDuration)}
            </span>
          </div>
        </div>
      </div>

      {/* Main Control Bar */}
      <div className={`absolute bottom-0 left-0 right-0 z-410 transition-standard ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full'
      }`}>
        <div className="bg-black bg-opacity-50 px-6 py-8">
          {/* Primary Controls */}
          <div className="flex items-center justify-center space-x-8">
            {/* Mute Button */}
            <Button
              variant={isMuted ? "destructive" : "secondary"}
              size="lg"
              onClick={handleMuteToggle}
              className="w-14 h-14 rounded-full bg-white bg-opacity-20 hover:bg-white hover:bg-opacity-30 border-0"
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
              onClick={handleEndCall}
              className={`w-16 h-16 rounded-full transition-standard ${
                showEndCallConfirm 
                  ? 'bg-error hover:bg-error/90 animate-pulse' :'bg-error hover:bg-error/90'
              }`}
            >
              <Icon name="PhoneOff" size={28} color="white" />
            </Button>

            {/* Camera Button */}
            <Button
              variant={isCameraOff ? "destructive" : "secondary"}
              size="lg"
              onClick={handleCameraToggle}
              className="w-14 h-14 rounded-full bg-white bg-opacity-20 hover:bg-white hover:bg-opacity-30 border-0"
            >
              <Icon 
                name={isCameraOff ? "VideoOff" : "Video"} 
                size={24} 
                color="white"
              />
            </Button>
          </div>

          {/* End Call Confirmation */}
          {showEndCallConfirm && (
            <div className="text-center mt-4">
              <p className="text-white text-sm">Tap again to end call</p>
            </div>
          )}

          {/* Secondary Controls */}
          <div className="flex items-center justify-center space-x-6 mt-6">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10 px-4 py-2"
            >
              <Icon name="MessageSquare" size={18} className="mr-2" />
              <span className="hidden sm:inline">Chat</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10 px-4 py-2"
            >
              <Icon name="Users" size={18} className="mr-2" />
              <span className="hidden sm:inline">Participants</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10 px-4 py-2"
            >
              <Icon name="Settings" size={18} className="mr-2" />
              <span className="hidden sm:inline">Settings</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10 px-4 py-2"
            >
              <Icon name="MoreHorizontal" size={18} className="mr-2" />
              <span className="hidden sm:inline">More</span>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CallControls;