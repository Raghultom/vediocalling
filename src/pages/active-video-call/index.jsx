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
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LiveKitRoom,
  useTracks,
  useLocalParticipant,
  useAudioPlayback,
  RoomAudioRenderer,
  VideoTrack,
} from '@livekit/components-react';
import { Track } from 'livekit-client';
import '@livekit/components-styles';

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

  // Handle autoplay: some browsers require a user gesture before audio can play.
  const { canPlayAudio, startAudio } = useAudioPlayback();

  // Timer
  useEffect(() => {
    const timer = setInterval(() => setCallDuration((t) => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto-hide controls after inactivity
  useEffect(() => {
    if (!controlsVisible) return;
    const t = setTimeout(() => setControlsVisible(false), 4500);
    return () => clearTimeout(t);
  }, [controlsVisible]);

  const handleScreenTap = () => setControlsVisible(true);

  return (
    <LiveKitRoom
      serverUrl="wss://test-project-yjtscd8m.livekit.cloud"
      token={token}
      connect
      audio
      video
      // optional: theme styles from @livekit/components-styles
      data-lk-theme="default"
      className="fixed inset-0 z-[500] bg-black overflow-hidden"
      onClick={handleScreenTap}
      onDisconnected={() =>
        navigate('/call-history', { state: { callEnded: true, duration: callDuration } })
      }
    >
      {/* Plays all remote audio tracks (mics / screen-share) */}
      <RoomAudioRenderer />

      {/* Video layer */}
      <VideoLayer />

      {/* Floating controls */}
      <Controls
        isMuted={isMuted}
        setIsMuted={setIsMuted}
        isCameraOff={isCameraOff}
        setIsCameraOff={setIsCameraOff}
        onEnd={() =>
          navigate('/call-history', { state: { callEnded: true, duration: callDuration } })
        }
        isVisible={controlsVisible}
        setVisible={setControlsVisible}
      />

      {/* If the browser blocked audio, show an enable button */}
      {!canPlayAudio && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-[510]">
          <button
            onClick={(e) => {
              e.stopPropagation();
              startAudio();
            }}
            className="bg-white text-black rounded-full px-4 py-2 text-sm shadow"
          >
            Tap to enable sound
          </button>
        </div>
      )}

      {!controlsVisible && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[510]">
          <div className="bg-black/50 rounded-full px-4 py-2 animate-pulse">
            <p className="text-white text-sm opacity-80">Tap anywhere to show controls</p>
          </div>
        </div>
      )}
    </LiveKitRoom>
  );
};

/** Renders all camera/screen-share tracks in a responsive grid.
 * Uses VideoTrack from @livekit/components-react.
 */
const VideoLayer = () => {
  // Grab camera + screenshare tracks from everyone (local + remote)
  const trackRefs = useTracks([
    { source: Track.Source.Camera, withPlaceholder: false },
    { source: Track.Source.ScreenShare, withPlaceholder: false },
  ]);

  // Sort - show screenshares first, then cameras
  const ordered = useMemo(() => {
    return [...trackRefs].sort((a, b) => {
      const aShare = a.source === Track.Source.ScreenShare ? 0 : 1;
      const bShare = b.source === Track.Source.ScreenShare ? 0 : 1;
      return aShare - bShare;
    });
  }, [trackRefs]);

  if (ordered.length === 0) {
    return (
      <div className="absolute inset-0 flex items-center justify-center text-white/80">
        Waiting for video…
      </div>
    );
  }

  // simple 1–4 person layout; tweak as you like
  const gridCols =
    ordered.length <= 1 ? 'grid-cols-1' : ordered.length <= 4 ? 'grid-cols-2' : 'grid-cols-3';

  return (
    <div className={`absolute inset-0 grid ${gridCols} gap-2 p-2`}>
      {ordered.map((tr, idx) => (
        <div
          key={`${tr.participant?.identity ?? 'p'}-${tr.source}-${idx}`}
          className="relative bg-black rounded-xl overflow-hidden"
        >
          <VideoTrack trackRef={tr} className="w-full h-full object-cover" />
          {/* name pill */}
          <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
            {tr.participant?.identity ?? 'Unknown'}
          </div>
        </div>
      ))}
    </div>
  );
};

/** Bottom control bar: mic / camera / leave.
 * Actually toggles LiveKit publish state on the LocalParticipant.
 */
const Controls = ({ isMuted, setIsMuted, isCameraOff, setIsCameraOff, onEnd, isVisible, setVisible }) => {
  const { localParticipant } = useLocalParticipant();

  // Drive LiveKit from UI state:
  useEffect(() => {
    if (!localParticipant) return;
    // When isMuted=true, disable mic publishing
    localParticipant.setMicrophoneEnabled(!isMuted).catch(() => {});
  }, [isMuted, localParticipant]);

  useEffect(() => {
    if (!localParticipant) return;
    // When isCameraOff=true, disable camera publishing
    localParticipant.setCameraEnabled(!isCameraOff).catch(() => {});
  }, [isCameraOff, localParticipant]);

  return (
    <div
      className={`absolute left-1/2 -translate-x-1/2 bottom-4 z-[520] transition-opacity ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center gap-3 bg-black/60 backdrop-blur px-4 py-2 rounded-full border border-white/10">
        <button
          onClick={() => setIsMuted((v) => !v)}
          className={`px-4 py-2 rounded-full text-sm ${
            isMuted ? 'bg-red-600 text-white' : 'bg-white text-black'
          }`}
        >
          {isMuted ? 'Unmute' : 'Mute'}
        </button>
        <button
          onClick={() => setIsCameraOff((v) => !v)}
          className={`px-4 py-2 rounded-full text-sm ${
            isCameraOff ? 'bg-yellow-400 text-black' : 'bg-white text-black'
          }`}
        >
          {isCameraOff ? 'Camera On' : 'Camera Off'}
        </button>
        <button
          onClick={onEnd}
          className="px-4 py-2 rounded-full text-sm bg-red-700 text-white"
        >
          End
        </button>
        <button
          onClick={() => setVisible(false)}
          className="px-3 py-2 rounded-full text-xs bg-white/10 text-white"
          title="Hide controls"
        >
          Hide
        </button>
      </div>
    </div>
  );
};

export default ActiveVideoCall;
