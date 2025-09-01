// ActiveVideoCall.jsx
import React, { useEffect, useRef, useState } from 'react';
import {
  Room,
  Participant,
  Track,
  LocalAudioTrack,
  LocalVideoTrack,
} from 'livekit-client';

const ActiveVideoCall = ({ token }) => {
  const [room, setRoom] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const roomRef = useRef(null); // To persist room instance
  const videoRef = useRef(null);
  const localVideoRef = useRef(null);

  // Connect to LiveKit room
  useEffect(() => {
    if (!token) {
      setError('Token is missing. Cannot connect to the room.');
      setLoading(false);
      return;
    }

    const room = new Room();

    // Room event listeners
    room
      .connect('wss://test-project-yjtscd8m.livekit.cloud', token)
      .then(() => {
        console.log('Connected to room:', room.name);
        roomRef.current = room;
        setRoom(room);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to connect:', err);
        setError(`Connection failed: ${err.message}`);
        setLoading(false);
      });

    // Handle participant joining (including self and others)
    const handleParticipantConnected = (participant) => {
      console.log('Participant connected:', participant.identity);
      setParticipants(Array.from(room.participants.values()));
    };

    const handleParticipantDisconnected = (participant) => {
      console.log('Participant disconnected:', participant.identity);
      setParticipants(Array.from(room.participants.values()));
    };

    // Track published: remote participant shared video/audio
    const handleTrackSubscribed = (track, publication, participant) => {
      console.log('Track subscribed:', track.kind, 'from', participant.identity);

      if (track.kind === Track.Kind.Video || track.kind === Track.Kind.Audio) {
        const videoElement = videoRef.current;
        track.attach(videoElement); // Attach remote video/audio
      }
    };

    const handleTrackUnsubscribed = (track) => {
      if (track?.detach) {
        const elements = track.detach();
        elements.forEach((el) => {
          if (el.srcObject) el.srcObject = null;
        });
      }
    };

    // Listen for events
    room.on('participantConnected', handleParticipantConnected);
    room.on('participantDisconnected', handleParticipantDisconnected);
    room.on('trackSubscribed', handleTrackSubscribed);
    room.on('trackUnsubscribed', handleTrackUnsubscribed);

    // Cleanup on unmount
    return () => {
      if (roomRef.current) {
        roomRef.current.disconnect();
        roomRef.current = null;
      }
      setRoom(null);
    };
  }, [token]);

  // Setup local video/audio when room is connected
  useEffect(() => {
    if (!room) return;

    // Request camera and mic
    const setupLocalTracks = async () => {
      try {
        const audioTrack = new LocalAudioTrack();
        const videoTrack = new LocalVideoTrack();

        await room.localParticipant.publishTrack(audioTrack);
        await room.localParticipant.publishTrack(videoTrack);

        // Show own video
        videoTrack.attach(localVideoRef.current);
      } catch (err) {
        console.error('Could not publish local tracks:', err);
      }
    };

    setupLocalTracks();

    // Update participant list when participants change
    const handleParticipantsChanged = () => {
      setParticipants(Array.from(room.participants.values()));
    };

    room.on('participantConnected', handleParticipantsChanged);
    room.on('participantDisconnected', handleParticipantsChanged);

    return () => {
      room.off('participantConnected', handleParticipantsChanged);
      room.off('participantDisconnected', handleParticipantsChanged);
    };
  }, [room]);

  if (loading) {
    return <div className="loading">Connecting to video call...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="active-video-call">
      <h2>Live Video Call</h2>

      {/* Remote Video/Audio */}
      <div className="remote-video">
        <h3>Other Participant</h3>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={false}
          style={{ width: '100%', height: '400px', backgroundColor: '#000' }}
        />
      </div>

      {/* Local Video Preview */}
      <div className="local-video">
        <h3>Your Camera (Preview)</h3>
        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          muted={true}
          style={{ width: '200px', height: '150px', backgroundColor: '#333' }}
        />
      </div>

      {/* Participants List */}
      <div className="participants">
        <h3>Connected: {participants.length + 1}</h3>
        <ul>
          <li>You (Local)</li>
          {participants.map((p) => (
            <li key={p.sid}>{p.identity}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ActiveVideoCall;