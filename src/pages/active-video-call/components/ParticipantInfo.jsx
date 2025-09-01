import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const ParticipantInfo = ({
  participants = [],
  isVisible = true,
  autoHide = true,
  autoHideDelay = 5000
}) => {
  const [showInfo, setShowInfo] = useState(isVisible);

  useEffect(() => {
    if (autoHide && isVisible) {
      const timer = setTimeout(() => {
        setShowInfo(false);
      }, autoHideDelay);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, autoHide, autoHideDelay]);

  const mockParticipants = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "buyer",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      isLocal: false,
      isMuted: false,
      isCameraOff: false,
      connectionQuality: "excellent",
      joinedAt: new Date(Date.now() - 120000)
    },
    {
      id: 2,
      name: "You",
      role: "vendor",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      isLocal: true,
      isMuted: false,
      isCameraOff: false,
      connectionQuality: "good",
      joinedAt: new Date(Date.now() - 180000)
    }
  ];

  const displayParticipants = participants?.length > 0 ? participants : mockParticipants;

  const getConnectionIcon = (quality) => {
    switch (quality) {
      case 'excellent': return 'Signal';
      case 'good': return 'Signal';
      case 'fair': return 'SignalMedium';
      case 'poor': return 'SignalLow';
      default: return 'Signal';
    }
  };

  const getConnectionColor = (quality) => {
    switch (quality) {
      case 'excellent': return 'text-success';
      case 'good': return 'text-success';
      case 'fair': return 'text-warning';
      case 'poor': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const formatJoinTime = (joinedAt) => {
    const now = new Date();
    const diff = Math.floor((now - joinedAt) / 1000);
    const minutes = Math.floor(diff / 60);
    
    if (minutes < 1) return 'Just joined';
    if (minutes === 1) return '1 minute ago';
    return `${minutes} minutes ago`;
  };

  if (!showInfo) {
    return null;
  }

  return (
    <div className="absolute top-4 right-4 z-400 max-w-sm">
      <div className="bg-black bg-opacity-80 rounded-lg p-4 space-y-3">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-medium">Participants ({displayParticipants?.length})</h3>
          <button
            onClick={() => setShowInfo(false)}
            className="text-white opacity-75 hover:opacity-100 transition-micro"
          >
            <Icon name="X" size={16} />
          </button>
        </div>

        {displayParticipants?.map((participant) => (
          <div key={participant?.id} className="flex items-center space-x-3 p-2 rounded-lg bg-white bg-opacity-10">
            {/* Avatar */}
            <div className="relative">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-muted">
                {participant?.avatar ? (
                  <img 
                    src={participant?.avatar} 
                    alt={participant?.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Icon name="User" size={20} color="white" />
                  </div>
                )}
              </div>
              
              {/* Status Indicators */}
              <div className="absolute -bottom-1 -right-1 flex space-x-1">
                {participant?.isMuted && (
                  <div className="w-4 h-4 bg-error rounded-full flex items-center justify-center">
                    <Icon name="MicOff" size={10} color="white" />
                  </div>
                )}
                {participant?.isCameraOff && (
                  <div className="w-4 h-4 bg-error rounded-full flex items-center justify-center">
                    <Icon name="VideoOff" size={10} color="white" />
                  </div>
                )}
              </div>
            </div>

            {/* Participant Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <p className="text-white font-medium text-sm truncate">
                  {participant?.name}
                </p>
                {participant?.isLocal && (
                  <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded">
                    You
                  </span>
                )}
              </div>
              
              <div className="flex items-center space-x-2 mt-1">
                <Icon 
                  name={getConnectionIcon(participant?.connectionQuality)} 
                  size={12} 
                  className={getConnectionColor(participant?.connectionQuality)}
                />
                <span className="text-white text-xs opacity-75 capitalize">
                  {participant?.connectionQuality}
                </span>
                <span className="text-white text-xs opacity-50">•</span>
                <span className="text-white text-xs opacity-75">
                  {formatJoinTime(participant?.joinedAt)}
                </span>
              </div>
            </div>

            {/* Role Badge */}
            <div className="text-right">
              <span className={`text-xs px-2 py-1 rounded-full ${
                participant?.role === 'buyer' ?'bg-accent text-accent-foreground' :'bg-secondary text-secondary-foreground'
              }`}>
                {participant?.role}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParticipantInfo;