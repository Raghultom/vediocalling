import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const CallStatusOverlay = ({
  isConnecting = false,
  connectionQuality = 'good',
  participantCount = 2,
  networkStats = {
    bitrate: 0,
    packetLoss: 0,
    latency: 0
  },
  showStats = false
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (isConnecting) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isConnecting]);

  const getConnectionIcon = () => {
    switch (connectionQuality) {
      case 'excellent': return 'Wifi';
      case 'good': return 'Wifi';
      case 'fair': return 'WifiOff';
      case 'poor': return 'WifiOff';
      default: return 'Wifi';
    }
  };

  const getConnectionColor = () => {
    switch (connectionQuality) {
      case 'excellent': return 'text-success';
      case 'good': return 'text-success';
      case 'fair': return 'text-warning';
      case 'poor': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  if (!isVisible && !showStats) {
    return null;
  }

  return (
    <div className="absolute top-20 left-4 right-4 z-400">
      {/* Connection Status */}
      {isConnecting && (
        <div className="bg-black bg-opacity-70 rounded-lg p-4 mb-4 text-center">
          <div className="flex items-center justify-center space-x-3 mb-2">
            <Icon name="Loader2" size={24} color="white" className="animate-spin" />
            <span className="text-white text-lg font-medium">Connecting...</span>
          </div>
          <p className="text-white text-sm opacity-75">
            Establishing secure connection
          </p>
        </div>
      )}
      {/* Network Quality Indicator */}
      {!isConnecting && isVisible && (
        <div className="bg-black bg-opacity-70 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon 
                name={getConnectionIcon()} 
                size={20} 
                className={getConnectionColor()}
              />
              <span className="text-white text-sm font-medium capitalize">
                {connectionQuality} Connection
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Icon name="Users" size={16} color="white" className="opacity-75" />
              <span className="text-white text-sm">{participantCount}</span>
            </div>
          </div>
        </div>
      )}
      {/* Network Statistics */}
      {showStats && (
        <div className="bg-black bg-opacity-70 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-medium">Network Stats</h3>
            <Icon name="Activity" size={16} color="white" className="opacity-75" />
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-white text-lg font-mono">
                {(networkStats?.bitrate / 1000)?.toFixed(1)}k
              </p>
              <p className="text-white text-xs opacity-75">Bitrate</p>
            </div>
            
            <div>
              <p className="text-white text-lg font-mono">
                {networkStats?.packetLoss?.toFixed(1)}%
              </p>
              <p className="text-white text-xs opacity-75">Packet Loss</p>
            </div>
            
            <div>
              <p className="text-white text-lg font-mono">
                {networkStats?.latency}ms
              </p>
              <p className="text-white text-xs opacity-75">Latency</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CallStatusOverlay;