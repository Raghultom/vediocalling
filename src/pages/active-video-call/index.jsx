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
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isMicMuted, setIsMicMuted] = useState(false);

  const roomRef = useRef(null);
  const videoRef = useRef(null);
  const localVideoRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    if (!token) {
      setError('❌ Token missing');
      setLoading(false);
      return;
    }
    if (!roomName) {
      setError('❌ Room name missing');
      setLoading(false);
      return;
    }

    const liveKitRoom = new Room({
      logLevel: 'info',
    });

    roomRef.current = liveKitRoom;

    const connectAndSetup = async () => {
      try {
        await liveKitRoom.connect('wss://test-project-yjtscd8m.livekit.cloud', token);
        console.log('✅ Connected to room:', roomName);

        await setupAudio(liveKitRoom);
        await startCamera(liveKitRoom);

        setLoading(false);
      } catch (err) {
        console.error('🔴 Connection failed:', err);
        setError(`Connection error: ${err.message}`);
        setLoading(false);
      }
    };

    connectAndSetup();

    // ✅ CLEANUP: When component unmounts (page left)
    return () => {
      console.log('🧹 Cleaning up video call...');

      // 1. Disconnect from room
      if (roomRef.current) {
        roomRef.current.disconnect();
        roomRef.current = null;
        console.log('👋 Disconnected from room');
      }

      // 2. Stop all media tracks (camera/mic)
      const allTracks = [];

      // Collect tracks from all video/audio elements
      [videoRef, localVideoRef, audioRef].forEach(ref => {
        if (ref.current?.srcObject) {
          allTracks.push(...ref.current.srcObject.getTracks());
        }
      });

      // Also check DOM in case any were missed
      document.querySelectorAll('video, audio').forEach(el => {
        if (el.srcObject) {
          allTracks.push(...el.srcObject.getTracks());
        }
      });

      // Stop each track
      allTracks.forEach(track => {
        if (track.readyState !== 'ended') {
          track.stop();
          console.log('🛑 Stopped', track.kind, 'track');
        }
      });

      // 3. Revoke object URLs
      [videoRef, localVideoRef, audioRef].forEach(ref => {
        if (ref.current) ref.current.srcObject = null;
      });

      // 4. Reset states
      setParticipants([]);
      setIsCameraOn(false);
      setIsMicMuted(false);
    };
  }, [token, roomName]);

  const setupAudio = async (room) => {
    try {
      const audioTrack = await createLocalAudioTrack();
      await room.localParticipant.publishTrack(audioTrack);
      console.log('🎤 Microphone published');
    } catch (err) {
      console.warn('🔇 Mic failed:', err);
      setError((prev) => prev + ' | Mic: ' + err.message);
    }
  };

  const startCamera = async (room = roomRef.current) => {
    if (!room || isCameraOn) return;

    try {
      const videoTrack = await createLocalVideoTrack({ resolution: 'h720' });

      setTimeout(() => {
        if (localVideoRef.current) {
          videoTrack.attach(localVideoRef.current);
          console.log('🎥 Local video attached');
          setIsCameraOn(true);
        }
      }, 100);

      await room.localParticipant.publishTrack(videoTrack);
      console.log('📤 Video published');
    } catch (err) {
      console.error('🔴 Camera failed:', err);
      setError((prev) => prev + ' | Camera: ' + err.message);
    }
  };

  useEffect(() => {
    if (!roomRef.current) return;

    const room = roomRef.current;

    const handleTrackSubscribed = (track, pub, participant) => {
      console.log('📥 Subscribed:', track.kind, 'from', participant.identity);

      if (track.kind === Track.Kind.Video && videoRef.current) {
        setTimeout(() => track.attach(videoRef.current), 50);
      }

      if (track.kind === Track.Kind.Audio) {
        track.attach(videoRef.current);
        track.attach(audioRef.current);
      }
    };

    const handleParticipantConnected = (p) => {
      console.log('👤 Joined:', p.identity);
      setParticipants(Array.from(room.participants.values()));
    };

    const handleParticipantDisconnected = () => {
      setParticipants(Array.from(room.participants.values()));
    };

    room.on('trackSubscribed', handleTrackSubscribed);
    room.on('participantConnected', handleParticipantConnected);
    room.on('participantDisconnected', handleParticipantDisconnected);

    return () => {
      room.off('trackSubscribed', handleTrackSubscribed);
      room.off('participantConnected', handleParticipantConnected);
      room.off('participantDisconnected', handleParticipantDisconnected);
    };
  }, []);

  const toggleMic = () => {
    const muted = !isMicMuted;
    setIsMicMuted(muted);
    roomRef.current?.localParticipant.setMicrophoneEnabled(!muted);
  };

  const endCall = () => {
    // This will trigger cleanup
    navigate(-1); // or navigate('/home')
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <div className="text-center space-y-4">
          <div className="animate-pulse w-16 h-16 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <h2 className="text-xl font-semibold text-foreground">Joining Call...</h2>
          <p className="text-muted-foreground">Allow camera/mic</p>
          {error && <p className="text-error text-sm mt-2">{error}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center px-4 py-6 gap-6">
      <header className="text-center">
        <h1 className="text-2xl font-bold text-primary">🎥 Live Call</h1>
        <p className="text-sm text-muted-foreground">
          Room: <span className="font-mono">{roomName}</span>
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full max-w-6xl">
        {/* Remote Video */}
        <div className="bg-muted rounded-xl overflow-hidden shadow-lg border border-border">
          <h3 className="bg-card px-4 py-2 text-sm font-medium text-foreground/80">Buyer</h3>
          <div className="aspect-video bg-black relative">
            <video ref={videoRef} autoPlay playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            {!videoRef.current?.srcObject && (
              <div className="absolute inset-0 flex items-center justify-center text-white bg-black/40 text-sm">
                {/* {participants.length ? '📹 Loading...' : 'Waiting...'} */}
              </div>
            )}
          </div>
        </div>

        {/* Local Preview */}
        <div className="bg-muted rounded-xl overflow-hidden shadow-lg border border-border">
          <h3 className="bg-card px-4 py-2 text-sm font-medium text-foreground/80">You</h3>
          <div className="aspect-video bg-gray-900 relative">
            <video ref={localVideoRef} autoPlay muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            {!isCameraOn && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 cursor-pointer" onClick={() => startCamera()}>
                <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium">🔍 Tap to Enable Camera</button>
              </div>
            )}
            <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">You</div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between w-full max-w-6xl gap-4">
        <div className="flex items-center gap-4 text-sm">
          <span>👥 <b>{participants.length + 1}</b> connected</span>
          <button
            onClick={toggleMic}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
              isMicMuted ? 'bg-muted text-muted-foreground' : 'bg-success text-success-foreground'
            }`}
          >
            {isMicMuted ? '🔇 Muted' : '🎤 Mic On'}
          </button>
        </div>

        <button
          onClick={endCall}
          className="bg-destructive hover:bg-destructive/90 text-destructive-foreground px-6 py-2.5 rounded-lg font-medium transition flex items-center gap-2 shadow-md"
        >
          🛑 End Call
        </button>
      </div>

      {/* Hidden Audio */}
      <audio ref={audioRef} autoPlay playsInline style={{ display: 'none' }} />

      {/* Error Banner */}
      {error && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-error text-error-foreground px-4 py-2 rounded-lg text-sm max-w-xs">
          {error}
        </div>
      )}
    </div>
  );
};

export default ActiveVideoCall;