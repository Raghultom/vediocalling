import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const VideoStream = ({ 
  isLocal = false, 
  participantName = 'Unknown User',
  isVideoEnabled = true,
  isMuted = false,
  connectionQuality = 'good',
  onStreamClick,
  isDraggable = false,
  className = ''
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const videoRef = useRef(null);
  const dragRef = useRef({ startX: 0, startY: 0, initialX: 0, initialY: 0 });

  const handleMouseDown = (e) => {
    if (!isDraggable) return;
    
    setIsDragging(true);
    dragRef.current.startX = e?.clientX;
    dragRef.current.startY = e?.clientY;
    dragRef.current.initialX = position?.x;
    dragRef.current.initialY = position?.y;
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !isDraggable) return;
    
    const deltaX = e?.clientX - dragRef?.current?.startX;
    const deltaY = e?.clientY - dragRef?.current?.startY;
    
    setPosition({
      x: Math.max(0, Math.min(window.innerWidth - 200, dragRef?.current?.initialX + deltaX)),
      y: Math.max(0, Math.min(window.innerHeight - 150, dragRef?.current?.initialY + deltaY))
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  const getConnectionQualityColor = () => {
    switch (connectionQuality) {
      case 'excellent': return 'text-success';
      case 'good': return 'text-success';
      case 'fair': return 'text-warning';
      case 'poor': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const streamStyle = isDraggable ? {
    position: 'fixed',
    left: `${position?.x}px`,
    top: `${position?.y}px`,
    zIndex: 300,
    cursor: isDragging ? 'grabbing' : 'grab'
  } : {};

  return (
    <div 
      className={`relative overflow-hidden rounded-lg bg-gray-900 ${className}`}
      style={streamStyle}
      onClick={onStreamClick}
      onMouseDown={handleMouseDown}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        autoPlay
        playsInline
        muted={isLocal}
      />

      {/* Video Disabled Overlay */}
      {!isVideoEnabled && (
        <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-3 mx-auto">
              <Icon name="User" size={32} color="white" />
            </div>
            <p className="text-white font-medium">{participantName}</p>
            <p className="text-white text-sm opacity-75">Camera is off</p>
          </div>
        </div>
      )}

      {/* Participant Info Overlay */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
        <div className="bg-black bg-opacity-50 rounded-lg px-3 py-1">
          <p className="text-white text-sm font-medium">{participantName}</p>
        </div>
        
        {/* Connection Quality Indicator */}
        <div className="flex items-center space-x-1 bg-black bg-opacity-50 rounded-lg px-2 py-1">
          <div className={`w-2 h-2 rounded-full ${getConnectionQualityColor()}`}></div>
          <span className="text-white text-xs capitalize">{connectionQuality}</span>
        </div>
      </div>

      {/* Audio Status Indicator */}
      {isMuted && (
        <div className="absolute bottom-3 left-3">
          <div className="bg-error rounded-full p-2">
            <Icon name="MicOff" size={16} color="white" />
          </div>
        </div>
      )}

      {/* Local Video Label */}
      {isLocal && (
        <div className="absolute bottom-3 right-3">
          <div className="bg-black bg-opacity-50 rounded px-2 py-1">
            <span className="text-white text-xs">You</span>
          </div>
        </div>
      )}

      {/* Draggable Indicator */}
      {isDraggable && (
        <div className="absolute top-1 right-1">
          <Icon name="Move" size={16} color="white" className="opacity-50" />
        </div>
      )}
    </div>
  );
};

export default VideoStream;