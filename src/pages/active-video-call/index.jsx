// src/pages/ActiveVideoCall.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Room, createLocalVideoTrack, createLocalAudioTrack } from 'livekit-client';

const ActiveVideoCall = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { token, room: roomName } = location.state || {};

  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const roomRef = useRef(null);           // Persist room instance
  const videoRef = useRef(null);          // Remote video element
  const localVideoRef = useRef(null);     // Local preview element

  useEffect(() => {
    // Validate required data
    if (!token) {
      setError('Authorization token is missing.');
      setLoading(false);
      return;
    }
    if (!roomName) {
      setError('Room name is missing.');
      setLoading(false);
      return;
    }

    const liveKitRoom = new Room();

    // Function to setup local camera and mic
    const setupLocalTracks = async (roomInstance) => {
      try {
        console.log('📹 Attempting to access camera and microphone...');

        // Create local tracks
        const videoTrack = await createLocalVideoTrack({ resolution: 'h720' });
        const audioTrack = await createLocalAudioTrack();

        // Attach to local video preview
        videoTrack.attach(localVideoRef.current);
        console.log('✅ Local video attached to preview');

        // Publish tracks to room
        await roomInstance.localParticipant.publishTrack(videoTrack);
        await roomInstance.localParticipant.publishTrack(audioTrack);

        console.log('✅ Camera and microphone published to room');
      } catch (err) {
        console.error('❌ Could not access camera or mic:', err);
        let message = err.message;

        if (err.name === 'NotAllowedError') {
          message = 'Camera/mic access denied. Please allow permissions.';
        } else if (err.name === 'NotFoundError') {
          message = 'No camera or microphone found on this device.';
        } else if (err.name === 'NotReadableError') {
          message = 'Camera is in use by another application.';
        }

        setError(`Media error: ${message}`);
      }
    };

    // Connect to LiveKit room
    liveKitRoom
      .connect('wss://test-project-yjtscd8m.livekit.cloud', token)
      .then(async () => {
        console.log(`✅ Connected to room: ${roomName}`);
        roomRef.current = liveKitRoom;

        // Setup local tracks immediately using liveKitRoom instance
        await setupLocalTracks(liveKitRoom);

        // Update state
        setLoading(false);
      })
      .catch((err) => {
        console.error('❌ Failed to connect to LiveKit:', err);
        setError(`Connection failed: ${err.message}`);
        setLoading(false);
      });

    // Handle participant events
    const handleParticipantConnected = (participant) => {
      console.log('👤 Participant joined:', participant.identity);
      setParticipants(Array.from(liveKitRoom.participants.values()));
    };

    const handleParticipantDisconnected = (participant) => {
      console.log('👤 Participant left:', participant.identity);
      setParticipants(Array.from(liveKitRoom.participants.values()));
    };

    // Handle remote video/audio tracks
    const handleTrackSubscribed = (track, publication, participant) => {
      console.log(`📥 Remote ${track.kind} track added from ${participant.identity}`);
      if (track.kind === 'video' || track.kind === 'audio') {
        track.attach(videoRef.current);
      }
    };

    const handleTrackUnsubscribed = (track) => {
      console.log('📤 Remote track removed');
      track.detach().forEach((element) => {
        if (element.srcObject) element.srcObject = null;
      });
    };

    // Subscribe to events
    liveKitRoom.on('participantConnected', handleParticipantConnected);
    liveKitRoom.on('participantDisconnected', handleParticipantDisconnected);
    liveKitRoom.on('trackSubscribed', handleTrackSubscribed);
    liveKitRoom.on('trackUnsubscribed', handleTrackUnsubscribed);

    // Update participant list on change
    const updateParticipants = () => {
      setParticipants(Array.from(liveKitRoom.participants.values()));
    };
    liveKitRoom.on('participantConnected', updateParticipants);
    liveKitRoom.on('participantDisconnected', updateParticipants);

    // Cleanup on unmount
    return () => {
      if (roomRef.current) {
        console.log('👋 Disconnecting from room...');
        roomRef.current.disconnect();
        roomRef.current = null;
      }
    };
  }, [token, roomName]);

  // Navigate back when ending call
  const endCall = () => {
    if (roomRef.current) {
      roomRef.current.disconnect();
      roomRef.current = null;
    }
    navigate(-1); // Go back to previous page
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <p>🔗 Connecting to call...</p>
        <p>Allow camera/microphone when prompted</p>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <h3>❌ Error</h3>
        <p>{error}</p>
        <button onClick={endCall} style={styles.button}>
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2>📹 Live Video Call: {roomName}</h2>

      {/* Remote Video */}
      <div style={styles.videoContainer}>
        <h4>Other Participant</h4>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          style={styles.remoteVideo}
        />
      </div>

      {/* Local Preview */}
      <div style={styles.previewContainer}>
        <h4>Your Camera (Preview)</h4>
        <video
          ref={localVideoRef}
          autoPlay
          muted
          playsInline
          style={styles.localVideo}
        />
      </div>

      {/* Participants List */}
      <div style={styles.info}>
        <p>👥 Connected: {participants.length + 1}</p>
        <ul>
          <li>You</li>
          {participants.map((p) => (
            <li key={p.sid}>{p.identity}</li>
          ))}
        </ul>
      </div>

      {/* End Call Button */}
      <button onClick={endCall} style={styles.endButton}>
        🚫 End Call
      </button>
    </div>
  );
};

// Simple inline styles
const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    textAlign: 'center',
    backgroundColor: '#f7f7f7',
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
    border: '1px solid #ddd',
  },
  previewContainer: {
    marginTop: '20px',
  },
  localVideo: {
    width: '200px',
    height: '150px',
    backgroundColor: '#333',
    borderRadius: '8px',
    border: '2px solid #007bff',
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