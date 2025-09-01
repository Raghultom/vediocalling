// src/pages/ActiveVideoCall.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Room,
  createLocalVideoTrack,
  createLocalAudioTrack,
  Track,
} from 'livekit-client';

const ActiveVideoCall = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { token, room: roomName } = location.state || {};

  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);

  const roomRef = useRef(null);
  const videoRef = useRef(null);          // Remote video
  const localVideoRef = useRef(null);     // Local preview

  useEffect(() => {
    if (!token) {
      setError('Token is missing.');
      setLoading(false);
      return;
    }
    if (!roomName) {
      setError('Room name is missing.');
      setLoading(false);
      return;
    }

    const liveKitRoom = new Room({
      // Optional: Debug logging
      logLevel: 'debug', // ← This helps see what's happening
    });

    const setupTracksAndJoin = async () => {
      try {
        console.log('🔍 Attempting to connect to room:', roomName);

        await liveKitRoom.connect('wss://test-project-yjtscd8m.livekit.cloud', token);
        console.log('✅ Connected to LiveKit room');

        roomRef.current = liveKitRoom;
        setLoading(false);

        // --- Step 1: Create local video/audio tracks ---
        let videoTrack, audioTrack;

        try {
          console.log('📹 Requesting camera...');
          videoTrack = await createLocalVideoTrack({
            resolution: 'h720',
            cameraFacing: 'user',
          });
        } catch (err) {
          console.warn('❌ Camera failed:', err);
          setError('Camera access denied or not available.');
        }

        try {
          console.log('🎤 Requesting microphone...');
          audioTrack = await createLocalAudioTrack();
        } catch (err) {
          console.warn('❌ Mic failed:', err);
          setError(prev => prev + ' | Mic access failed.');
        }

        if (!videoTrack && !audioTrack) {
          setError('❌ Could not access camera or mic.');
          return;
        }

        // --- Step 2: Attach to local preview ---
        if (videoTrack && localVideoRef.current) {
          videoTrack.attach(localVideoRef.current);
          console.log('✅ Local video preview attached');
        }

        // --- Step 3: Publish tracks ---
        if (!isPublishing) {
          setIsPublishing(true);

          if (videoTrack) {
            await liveKitRoom.localParticipant.publishTrack(videoTrack);
            console.log('📤 Published video track');
          }

          if (audioTrack) {
            await liveKitRoom.localParticipant.publishTrack(audioTrack);
            console.log('📤 Published audio track');
          }

          setIsPublishing(false);
        }
      } catch (err) {
        console.error('🚨 Setup failed:', err);
        setError(`Setup error: ${err.message}`);
        setLoading(false);
      }
    };

    // Start connection and setup
    setupTracksAndJoin();

    // --- Event Listeners ---
    const handleParticipantConnected = (participant) => {
      console.log('👤 Joined:', participant.identity);
      setParticipants(Array.from(liveKitRoom.participants.values()));
    };

    const handleTrackSubscribed = (track, pub, participant) => {
      console.log(`📥 Subscribed to ${track.kind} from ${participant.identity}`);
      if (track.kind === Track.Kind.Video || track.kind === Track.Kind.Audio) {
        track.attach(videoRef.current);
      }
    };

    const handleParticipantDisconnected = () => {
      setParticipants(Array.from(liveKitRoom.participants.values()));
    };

    liveKitRoom.on('participantConnected', handleParticipantConnected);
    liveKitRoom.on('participantDisconnected', handleParticipantDisconnected);
    liveKitRoom.on('trackSubscribed', handleTrackSubscribed);

    return () => {
      if (roomRef.current) {
        console.log('👋 Disconnecting...');
        roomRef.current.disconnect();
        roomRef.current = null;
      }
    };
  }, [token, roomName]);

  // Update participant list
  useEffect(() => {
    if (!roomRef.current) return;
    const room = roomRef.current;

    const update = () => setParticipants(Array.from(room.participants.values()));
    room.on('participantConnected', update);
    room.on('participantDisconnected', update);

    return () => {
      room.off('participantConnected', update);
      room.off('participantDisconnected', update);
    };
  }, []);

  const endCall = () => {
    if (roomRef.current) {
      roomRef.current.disconnect();
      roomRef.current = null;
    }
    navigate(-1);
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <h2>📞 Joining Call...</h2>
        <p>Allow camera and microphone when prompted</p>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2>🎥 Video Call: {roomName}</h2>

      {/* Remote Video */}
      <div style={styles.videoContainer}>
        <h4>Buyer</h4>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          style={styles.remoteVideo}
        />
      </div>

      {/* Local Preview */}
      <div style={styles.previewContainer}>
        <h4>Your Camera (You)</h4>
        <video
          ref={localVideoRef}
          autoPlay
          muted
          playsInline
          style={styles.localVideo}
        />
      </div>

      {/* Participants */}
      <div style={styles.info}>
        <p>👥 Connected: {participants.length + 1}</p>
      </div>

      {/* End Call */}
      <button onClick={endCall} style={styles.endButton}>
        🛑 End Call
      </button>
    </div>
  );
};

// Styles
const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    textAlign: 'center',
    backgroundColor: '#f9f9f9',
    minHeight: '100vh',
  },
  videoContainer: {
    marginBottom: '20px',
  },
  remoteVideo: {
    width: '100%',
    maxWidth: '600px',
    height: '400px',
    backgroundColor: '#000',
    borderRadius: '12px',
    border: '2px solid #007bff',
  },
  previewContainer: {
    marginTop: '20px',
  },
  localVideo: {
    width: '200px',
    height: '150px',
    backgroundColor: '#333',
    borderRadius: '8px',
    border: '2px solid #28a745',
  },
  info: {
    marginTop: '20px',
    fontSize: '14px',
    color: '#555',
  },
  endButton: {
    marginTop: '30px',
    padding: '12px 24px',
    fontSize: '16px',
    backgroundColor: '#d32f2f',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
};

export default ActiveVideoCall;