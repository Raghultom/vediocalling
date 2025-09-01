// import React, { useState, useEffect } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import VideoStream from './components/VideoStream';
// import CallControls from './components/CallControls';
// import CallStatusOverlay from './components/CallStatusOverlay';
// import ParticipantInfo from './components/ParticipantInfo';

// const ActiveVideoCall = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
  
//   // Call state
//   const [callDuration, setCallDuration] = useState(0);
//   const [isMuted, setIsMuted] = useState(false);
//   const [isCameraOff, setIsCameraOff] = useState(false);
//   const [isConnecting, setIsConnecting] = useState(true);
//   const [connectionQuality, setConnectionQuality] = useState('good');
//   const [controlsVisible, setControlsVisible] = useState(true);
//   const [showParticipants, setShowParticipants] = useState(true);
//   const [showNetworkStats, setShowNetworkStats] = useState(false);
//   const [isLocalVideoMinimized, setIsLocalVideoMinimized] = useState(true);

//   // Mock call data
//   const callData = location?.state || {
//     participantName: 'Sarah Johnson',
//     participantRole: 'buyer',
//     callType: 'incoming'
//   };

//   // Network statistics mock data
//   const [networkStats] = useState({
//     bitrate: 1250000,
//     packetLoss: 0.2,
//     latency: 45
//   });



//   // Participants data
//   const participants = [
//     {
//       id: 1,
//       name: callData?.participantName,
//       role: callData?.participantRole,
//       avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
//       isLocal: false,
//       isMuted: false,
//       isCameraOff: false,
//       connectionQuality: connectionQuality,
//       joinedAt: new Date(Date.now() - 120000)
//     },
//     {
//       id: 2,
//       name: "You",
//       role: callData?.participantRole === 'buyer' ? 'vendor' : 'buyer',
//       avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
//       isLocal: true,
//       isMuted: isMuted,
//       isCameraOff: isCameraOff,
//       connectionQuality: 'excellent',
//       joinedAt: new Date(Date.now() - 180000)
//     }
//   ];

//   // Initialize call connection
//   useEffect(() => {
//     const connectionTimer = setTimeout(() => {
//       setIsConnecting(false);
//     }, 3000);

//     return () => clearTimeout(connectionTimer);
//   }, []);

//   // Call duration timer
//   useEffect(() => {
//     if (!isConnecting) {
//       const timer = setInterval(() => {
//         setCallDuration(prev => prev + 1);
//       }, 1000);

//       return () => clearInterval(timer);
//     }
//   }, [isConnecting]);

//   // Auto-hide controls
//   useEffect(() => {
//     if (controlsVisible && !isConnecting) {
//       const timer = setTimeout(() => {
//         setControlsVisible(false);
//       }, 5000);

//       return () => clearTimeout(timer);
//     }
//   }, [controlsVisible, isConnecting]);

//   // Screen orientation lock for mobile
//   useEffect(() => {
//     const lockOrientation = async () => {
//       if (screen.orientation && screen.orientation?.lock) {
//         try {
//           await screen.orientation?.lock('landscape');
//         } catch (error) {
//           console.log('Orientation lock not supported');
//         }
//       }
//     };

//     lockOrientation();

//     return () => {
//       if (screen.orientation && screen.orientation?.unlock) {
//         screen.orientation?.unlock();
//       }
//     };
//   }, []);

//   // Handle screen tap to show controls
//   const handleScreenTap = () => {
//     setControlsVisible(true);
//   };

//   // Handle mute toggle
//   const handleMuteToggle = () => {
//     setIsMuted(!isMuted);
//   };

//   // Handle camera toggle
//   const handleCameraToggle = () => {
//     setIsCameraOff(!isCameraOff);
//   };

//   // Handle end call
//   const handleEndCall = () => {
//     navigate('/call-history', {
//       state: {
//         callEnded: true,
//         duration: callDuration,
//         participant: callData?.participantName
//       }
//     });
//   };

//   // Handle video stream switching
//   const handleVideoStreamClick = () => {
//     setIsLocalVideoMinimized(!isLocalVideoMinimized);
//   };

//   // Simulate connection quality changes
//   useEffect(() => {
//     const qualityStates = ['excellent', 'good', 'fair', 'good', 'excellent'];
//     let currentIndex = 0;

//     const qualityTimer = setInterval(() => {
//       setConnectionQuality(qualityStates?.[currentIndex]);
//       currentIndex = (currentIndex + 1) % qualityStates?.length;
//     }, 10000);

//     return () => clearInterval(qualityTimer);
//   }, []);

//   return (
//     <div 
//       className="fixed inset-0 z-500 bg-black overflow-hidden"
//       onClick={handleScreenTap}
//     >
//       {/* Main Video Stream */}
//       <VideoStream
//         isLocal={false}
//         participantName={callData?.participantName}
//         isVideoEnabled={true}
//         isMuted={false}
//         connectionQuality={connectionQuality}
//         onStreamClick={handleVideoStreamClick}
//         className="absolute inset-0 w-full h-full"
//       />
//       {/* Local Video Stream (Picture-in-Picture) */}
//       <VideoStream
//         isLocal={true}
//         participantName="You"
//         isVideoEnabled={!isCameraOff}
//         isMuted={isMuted}
//         connectionQuality="excellent"
//         onStreamClick={handleVideoStreamClick}
//         isDraggable={true}
//         className="w-48 h-36 lg:w-64 lg:h-48 shadow-elevation border-2 border-white border-opacity-20"
//       />
//       {/* Call Status Overlay */}
//       <CallStatusOverlay
//         isConnecting={isConnecting}
//         connectionQuality={connectionQuality}
//         participantCount={participants?.length}
//         networkStats={networkStats}
//         showStats={showNetworkStats}
//       />
//       {/* Participant Information */}
//       <ParticipantInfo
//         participants={participants}
//         isVisible={showParticipants}
//         autoHide={true}
//         autoHideDelay={8000}
//       />
//       {/* Call Controls */}
//       <CallControls
//         isMuted={isMuted}
//         isCameraOff={isCameraOff}
//         onMuteToggle={handleMuteToggle}
//         onCameraToggle={handleCameraToggle}
//         onEndCall={handleEndCall}
//         callDuration={callDuration}
//         isVisible={controlsVisible}
//         onVisibilityChange={setControlsVisible}
//       />
//       {/* Controls Visibility Hint */}
//       {!controlsVisible && !isConnecting && (
//         <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-410">
//           <div className="bg-black bg-opacity-50 rounded-full px-4 py-2 animate-pulse">
//             <p className="text-white text-sm opacity-75">Tap to show controls</p>
//           </div>
//         </div>
//       )}
//       {/* Network Stats Toggle (Desktop) */}
//       <div className="hidden lg:block absolute top-4 left-4 z-410">
//         <button
//           onClick={(e) => {
//             e?.stopPropagation();
//             setShowNetworkStats(!showNetworkStats);
//           }}
//           className="bg-black bg-opacity-50 text-white rounded-lg px-3 py-2 text-sm hover:bg-opacity-70 transition-micro"
//         >
//           {showNetworkStats ? 'Hide Stats' : 'Show Stats'}
//         </button>
//       </div>
//       {/* Participants Toggle (Desktop) */}
//       <div className="hidden lg:block absolute top-4 left-28 z-410">
//         <button
//           onClick={(e) => {
//             e?.stopPropagation();
//             setShowParticipants(!showParticipants);
//           }}
//           className="bg-black bg-opacity-50 text-white rounded-lg px-3 py-2 text-sm hover:bg-opacity-70 transition-micro"
//         >
//           {showParticipants ? 'Hide Info' : 'Show Info'}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ActiveVideoCall;



// ActiveVideoCall.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LiveKitRoom,
  useTracks,
  useLocalParticipant,
  VideoRenderer,
  AudioRenderer,
} from '@livekit/components-react';
import { Track } from 'livekit-client';

import CallControls from './components/CallControls';
import CallStatusOverlay from './components/CallStatusOverlay';
import ParticipantInfo from './components/ParticipantInfo';

const ActiveVideoCall = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get room + token from navigation
  const { room, token } = location.state || {};
  if (!room || !token) {
    return (
      <div className="flex items-center justify-center h-screen text-white bg-black">
        Missing room or token
      </div>
    );
  }

  // Call state
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [showParticipants, setShowParticipants] = useState(true);
  const [showNetworkStats, setShowNetworkStats] = useState(false);

  // Network statistics mock
  const [networkStats] = useState({
    bitrate: 1250000,
    packetLoss: 0.2,
    latency: 45,
  });

  // Call duration timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto-hide controls
  useEffect(() => {
    if (controlsVisible) {
      const timer = setTimeout(() => {
        setControlsVisible(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [controlsVisible]);

  // Handle screen tap to show controls
  const handleScreenTap = () => setControlsVisible(true);

  return (
    <LiveKitRoom
      serverUrl="wss://test-project-yjtscd8m.livekit.cloud"
      token={token}
      connect
      audio
      video
      onDisconnected={() =>
        navigate('/call-history', {
          state: { callEnded: true, duration: callDuration },
        })
      }
      className="fixed inset-0 z-500 bg-black overflow-hidden"
      onClick={handleScreenTap}
    >
      {/* Render all participants */}
      <VideoLayer isMuted={isMuted} isCameraOff={isCameraOff} />

      {/* Overlays */}
      <CallStatusOverlay
        isConnecting={false}
        connectionQuality="good"
        participantCount={2}
        networkStats={networkStats}
        showStats={showNetworkStats}
      />
      <ParticipantInfo
        participants={[]} // Replace with actual participant data if needed
        isVisible={showParticipants}
        autoHide
        autoHideDelay={8000}
      />

      <CallControls
        isMuted={isMuted}
        isCameraOff={isCameraOff}
        onMuteToggle={() => setIsMuted((prev) => !prev)}
        onCameraToggle={() => setIsCameraOff((prev) => !prev)}
        onEndCall={() =>
          navigate('/call-history', {
            state: { callEnded: true, duration: callDuration },
          })
        }
        callDuration={callDuration}
        isVisible={controlsVisible}
        onVisibilityChange={setControlsVisible}
      />

      {!controlsVisible && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-410">
          <div className="bg-black bg-opacity-50 rounded-full px-4 py-2 animate-pulse">
            <p className="text-white text-sm opacity-75">Tap to show controls</p>
          </div>
        </div>
      )}

      {/* Toggles */}
      <div className="hidden lg:block absolute top-4 left-4 z-410">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowNetworkStats(!showNetworkStats);
          }}
          className="bg-black bg-opacity-50 text-white rounded-lg px-3 py-2 text-sm hover:bg-opacity-70"
        >
          {showNetworkStats ? 'Hide Stats' : 'Show Stats'}
        </button>
      </div>
      <div className="hidden lg:block absolute top-4 left-28 z-410">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowParticipants(!showParticipants);
          }}
          className="bg-black bg-opacity-50 text-white rounded-lg px-3 py-2 text-sm hover:bg-opacity-70"
        >
          {showParticipants ? 'Hide Info' : 'Show Info'}
        </button>
      </div>
    </LiveKitRoom>
  );
};

// Render video & audio tracks
const VideoLayer = ({ isMuted, isCameraOff }) => {
  const tracks = useTracks([
    Track.Source.Camera,
    Track.Source.Microphone,
    Track.Source.ScreenShare,
  ]);
  const { localParticipant } = useLocalParticipant();

  if (!tracks || tracks.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-white">
        Waiting for participants…
      </div>
    );
  }

  // Group by participant
  const participantsMap = {};
  tracks.forEach(({ publication, participant }) => {
    if (!participantsMap[participant.sid]) {
      participantsMap[participant.sid] = { participant, publications: [] };
    }
    participantsMap[participant.sid].publications.push(publication);
  });

  const participants = Object.values(participantsMap);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full h-full p-2">
      {participants.map(({ participant, publications }) => (
        <div
          key={participant.sid}
          className="relative flex items-center justify-center bg-black rounded-lg overflow-hidden"
        >
          {publications.map((publication) => {
            const track = publication.track;
            if (!track) return null;

            if (publication.kind === 'video') {
              return (
                <VideoRenderer
                  key={publication.trackSid}
                  track={track}
                  isLocal={participant.isLocal}
                  className="w-full h-full object-cover"
                  muted={participant.isLocal} // mute local preview
                />
              );
            }

            if (publication.kind === 'audio' && !participant.isLocal) {
              return (
                <AudioRenderer key={publication.trackSid} track={track} />
              );
            }

            return null;
          })}

          {/* Overlay participant name */}
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
            {participant.identity || 'Unknown'}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActiveVideoCall;
