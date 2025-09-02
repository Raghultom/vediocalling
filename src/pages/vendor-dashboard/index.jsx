import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import BottomTabNavigation from '../../components/ui/BottomTabNavigation';
import CallNotificationBanner from '../../components/ui/CallNotificationBanner';
import CallControlOverlay from '../../components/ui/CallControlOverlay';
import AvailabilityToggle from './components/AvailabilityToggle';
import IncomingCallPanel from './components/IncomingCallPanel';
import RecentCallHistory from './components/RecentCallHistory';
import ProfileCompletionWidget from './components/ProfileCompletionWidget';
import AnalyticsCards from './components/AnalyticsCards';
import ActiveCallCounter from './components/ActiveCallCounter';

const VendorDashboard = () => {
  const navigate = useNavigate();
  const [isAvailable, setIsAvailable] = useState(true);
  const [showCallNotification, setShowCallNotification] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [currentCaller, setCurrentCaller] = useState('');
  const [socket, setSocket] = useState(null);
  const [incomingCallData, setIncomingCallData] = useState(null);
  const [callSession, setCallSession] = useState(null);


 

  // const handleAvailabilityToggle = (available) => {
  //   setIsAvailable(available);

  //   if (available) {
  //     const ws = new WebSocket("ws://13.203.254.15:8000/ws/room/join");
  //     setSocket(ws);

  //     ws.onopen = () => {
  //       console.log("✅ WebSocket connected (availability ON)");
  //       const payload = {
  //         user_id: 86,   // Replace with real userId
  //         vendor_id: 86, // Replace with vendorId
  //         product_id: 5, // Replace with productId
  //       };
  //       ws.send(JSON.stringify(payload));
  //       console.log("📤 Sent availability payload:", payload);
  //     };

      
  //     ws.onmessage = (event) => {
  //       console.log("📩 Incoming message:", event.data);
  //       try {
  //         const msg = JSON.parse(event.data);

  //         if (msg.is_incoming_call && msg.event === "call_request") {
  //           setShowCallNotification(true);
  //           setCurrentCaller(msg.customer_name);
  //           setIncomingCallData(msg);
  //         }

  //         // ✅ When call is started, store room & token and navigate
  //         if (msg.event === "call_started") {
  //           setCallSession({
  //             room: msg.room,
  //             token: msg.token,
  //           });

  //           navigate('/active-video-call', {
  //             state: { room: msg.room, token: msg.token },
  //           });
  //         }
  //       } catch (err) {
  //         console.error("❌ Error parsing WebSocket message:", err);
  //       }
  //     };


  //     ws.onerror = (error) => {
  //       console.error("❌ WebSocket error:", error);
  //     };

  //     ws.onclose = () => {
  //       console.log("🔌 WebSocket closed");
  //     };
  //   } else {
  //     setShowCallNotification(false);
  //     if (socket && socket.readyState === WebSocket.OPEN) {
  //       socket.close();
  //       console.log("🔌 WebSocket closed (availability OFF)");
  //     }
  //   }
  // };


const handleAvailabilityToggle = (available) => {
  setIsAvailable(available);

  if (available) {
    const ws = new WebSocket("wss://livestreaming.emeetify.com/videoCall/ws/room/join");
    setSocket(ws);

    ws.onopen = () => {
      console.log("✅ WebSocket connected (availability ON)");
      const payload = {
        user_id: 86,
        vendor_id: 86,
        product_id: 5,
      };
      ws.send(JSON.stringify(payload));
      console.log("📤 Sent availability payload:", payload);
    };

    ws.onmessage = (event) => {
      console.log("📩 Incoming message:", event.data);
      try {
        const msg = JSON.parse(event.data);

        // ✅ Handle incoming call request
        if (msg.is_incoming_call && msg.event === "call_request") {
          // 🔁 Reset first, then show (ensures re-render)
          setShowCallNotification(false);
          setTimeout(() => {
            setCurrentCaller(msg.customer_name);
            setIncomingCallData(msg);
            setShowCallNotification(true); // ✅ Now it will trigger
          }, 0);
        }

        // ✅ Handle call start
        if (msg.event === "call_started") {
          setCallSession({
            room: msg.room,
            token: msg.token,
          });

          navigate('/active-video-call', {
            state: { room: msg.room, token: msg.token },
          });
        }
      } catch (err) {
        console.error("❌ Error parsing WebSocket message:", err);
      }
    };

    ws.onerror = (error) => {
      console.error("❌ WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("🔌 WebSocket closed");
    };
  } else {
    // ❌ Turn OFF: close socket and hide notification
    setShowCallNotification(false);
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.close();
      console.log("🔌 WebSocket closed (availability OFF)");
    }
  }
};
  const handleAcceptCall = () => {
    if (incomingCallData && socket && socket.readyState === WebSocket.OPEN) {
      const acceptPayload = {
        action: "accept_call",
        customer_id: incomingCallData.customer_id,
      };
      socket.send(JSON.stringify(acceptPayload));
      console.log("📤 Sent accept payload:", acceptPayload);
    }

    setShowCallNotification(false);
    setIsCallActive(true);
    setCallDuration(0);
  };


  const handleRejectCall = () => {
    setShowCallNotification(false);
    setCurrentCaller('');
    setIncomingCallData(null);
  };


  const handleDismissNotification = () => {
    setShowCallNotification(false);
  };

  const handleEndCall = () => {
    setIsCallActive(false);
    setCallDuration(0);
    setIsMuted(false);
    setIsCameraOff(false);
    setCurrentCaller('');
  };

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleToggleCamera = () => {
    setIsCameraOff(!isCameraOff);
  };

  const handleViewAllCalls = () => {
    navigate('/call-history');
  };

  const handleEditProfile = () => {
    // Navigate to profile edit page (not implemented)
    console.log('Navigate to profile edit');
  };

  return (
    <div className="min-h-screen bg-background">
      <HeaderNavigation userRole="vendor" notificationCount={3} isCallActive={isCallActive} />
      <BottomTabNavigation userRole="vendor" isCallActive={isCallActive} />

      {/* Call Notification Banner */}
      <CallNotificationBanner
        isVisible={showCallNotification}
        callerName={currentCaller}
        callerType="buyer"
        callType="incoming"
        onAccept={handleAcceptCall}
        onReject={handleRejectCall}
        onDismiss={handleDismissNotification}
      />

      {/* Call Control Overlay */}
      <CallControlOverlay
        isCallActive={isCallActive}
        isMuted={isMuted}
        isCameraOff={isCameraOff}
        onMuteToggle={handleToggleMute}
        onCameraToggle={handleToggleCamera}
        onEndCall={handleEndCall}
        callDuration={callDuration}
        participantName={currentCaller}
      />

      {/* Active Call Counter */}
      <ActiveCallCounter
        isCallActive={isCallActive}
        callDuration={callDuration}
        participantName={currentCaller}
        onEndCall={handleEndCall}
        onToggleMute={handleToggleMute}
        onToggleCamera={handleToggleCamera}
        isMuted={isMuted}
        isCameraOff={isCameraOff}
      />

      {/* Main Content */}
      <main className="lg:ml-64 pb-16 lg:pb-0">
        <div className="p-4 lg:p-6 space-y-6">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-primary to-accent rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold mb-2">Welcome back, John!</h1>
                <p className="text-white/90">
                  You're {isAvailable ? 'available' : 'offline'} for new calls today
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold">12</p>
                <p className="text-sm text-white/80">Calls Today</p>
              </div>
            </div>
          </div>

          {/* Availability Toggle */}
          <AvailabilityToggle
            isAvailable={isAvailable}
            onToggle={handleAvailabilityToggle}
          />

          {/* Analytics Cards */}
          <AnalyticsCards />

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Incoming Calls & Recent History */}
            <div className="lg:col-span-2 space-y-6">
              <IncomingCallPanel
                onAcceptCall={handleAcceptCall}
                onRejectCall={handleRejectCall}
              />

              <RecentCallHistory
                onViewAll={handleViewAllCalls}
              />
            </div>

            {/* Right Column - Profile & Quick Actions */}
            <div className="space-y-6">
              <ProfileCompletionWidget
                onEditProfile={handleEditProfile}
              />

              {/* Quick Actions Card */}
              <div className="bg-card rounded-lg border border-border p-6 shadow-soft">
                <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-micro text-left">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <span className="text-primary text-sm font-medium">📊</span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">View Analytics</p>
                      <p className="text-sm text-muted-foreground">Detailed performance metrics</p>
                    </div>
                  </button>

                  <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-micro text-left">
                    <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
                      <span className="text-success text-sm font-medium">💰</span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Earnings Report</p>
                      <p className="text-sm text-muted-foreground">Monthly income summary</p>
                    </div>
                  </button>

                  <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-micro text-left">
                    <div className="w-8 h-8 bg-warning/10 rounded-lg flex items-center justify-center">
                      <span className="text-warning text-sm font-medium">⚙️</span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Settings</p>
                      <p className="text-sm text-muted-foreground">Manage preferences</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Today's Schedule */}
              <div className="bg-card rounded-lg border border-border p-6 shadow-soft">
                <h3 className="text-lg font-semibold text-foreground mb-4">Today's Schedule</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                    <div className="w-2 h-8 bg-primary rounded-full"></div>
                    <div>
                      <p className="font-medium text-foreground">Available Hours</p>
                      <p className="text-sm text-muted-foreground">9:00 AM - 6:00 PM</p>
                    </div>
                  </div>

                  <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground">
                      No scheduled calls yet today
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VendorDashboard;