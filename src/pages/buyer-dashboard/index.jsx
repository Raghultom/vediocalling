import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import BottomTabNavigation from '../../components/ui/BottomTabNavigation';
import CallNotificationBanner from '../../components/ui/CallNotificationBanner';
import VendorGrid from './components/VendorGrid';
import FilterChips from './components/FilterChips';
import SearchBar from './components/SearchBar';
import RecentCallsWidget from './components/RecentCallsWidget';
import { encryptData } from 'utils/crypto';


const BuyerDashboard = () => {
  const navigate = useNavigate();
  const [vendors, setVendors] = useState([]);
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState([]);
  const [callSession, setCallSession] = useState(null);
  const [callNotification, setCallNotification] = useState({
    isVisible: false,
    callerName: '',
    callType: 'incoming'
  });

  // Mock vendor data
  const mockVendors = [
    {
      id: 86,
      userId: 47,
      businessName: "TechSolutions Pro",
      serviceCategory: "IT Services",
      profilePhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      rating: 4.8,
      reviewCount: 127,
      description: "Professional IT consulting and software development services for businesses of all sizes.",
      location: "New York, NY",
      isOnline: true
    },
    {
      id: 86,
      userId: 43,
      businessName: "Creative Design Studio",
      serviceCategory: "Design & Marketing",
      profilePhoto: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      rating: 4.9,
      reviewCount: 89,
      description: "Award-winning graphic design and branding solutions that make your business stand out.",
      location: "Los Angeles, CA",
      isOnline: true
    },
    // {
    //   id: 3,
    //   businessName: "Home Repair Experts",
    //   serviceCategory: "Home Services",
    //   profilePhoto: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    //   rating: 4.6,
    //   reviewCount: 203,
    //   description: "Reliable home maintenance and repair services with 15+ years of experience.",
    //   location: "Chicago, IL",
    //   isOnline: false
    // },
    // {
    //   id: 4,
    //   businessName: "Legal Advisory Group",
    //   serviceCategory: "Legal Services",
    //   profilePhoto: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
    //   rating: 4.7,
    //   reviewCount: 156,
    //   description: "Comprehensive legal consultation for business and personal matters.",
    //   location: "Boston, MA",
    //   isOnline: true
    // },
    // {
    //   id: 5,
    //   businessName: "Financial Planning Plus",
    //   serviceCategory: "Financial Services",
    //   profilePhoto: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face",
    //   rating: 4.5,
    //   reviewCount: 94,
    //   description: "Expert financial planning and investment advisory services for your future.",
    //   location: "Miami, FL",
    //   isOnline: true
    // },
    // {
    //   id: 6,
    //   businessName: "Health & Wellness Coach",
    //   serviceCategory: "Health & Fitness",
    //   profilePhoto: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face",
    //   rating: 4.9,
    //   reviewCount: 78,
    //   description: "Personalized health coaching and nutrition guidance for a better lifestyle.",
    //   location: "Austin, TX",
    //   isOnline: true
    // },
    // {
    //   id: 7,
    //   businessName: "Auto Repair Masters",
    //   serviceCategory: "Automotive",
    //   profilePhoto: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face",
    //   rating: 4.4,
    //   reviewCount: 167,
    //   description: "Professional automotive repair and maintenance services for all vehicle types.",
    //   location: "Phoenix, AZ",
    //   isOnline: false
    // },
    // {
    //   id: 8,
    //   businessName: "Educational Tutoring",
    //   serviceCategory: "Education",
    //   profilePhoto: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=150&h=150&fit=crop&crop=face",
    //   rating: 4.8,
    //   reviewCount: 112,
    //   description: "Expert tutoring services for students of all ages in various subjects.",
    //   location: "Seattle, WA",
    //   isOnline: true
    // }
  ];

  // Mock recent calls data
  const mockRecentCalls = [
    {
      id: 1,
      vendor: mockVendors?.[0],
      status: 'completed',
      duration: 1247,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      id: 2,
      vendor: mockVendors?.[1],
      status: 'missed',
      duration: null,
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000)
    },
    {
      id: 3,
      vendor: mockVendors?.[3],
      status: 'completed',
      duration: 892,
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000)
    }
  ];

  // Filter options
  const filterOptions = [
    { id: 'online', label: 'Available Now', icon: 'Circle', count: mockVendors?.filter(v => v?.isOnline)?.length },
    { id: 'rating', label: 'Top Rated', icon: 'Star', count: mockVendors?.filter(v => v?.rating >= 4.7)?.length },
    { id: 'it', label: 'IT Services', icon: 'Monitor', count: mockVendors?.filter(v => v?.serviceCategory === 'IT Services')?.length },
    { id: 'design', label: 'Design', icon: 'Palette', count: mockVendors?.filter(v => v?.serviceCategory === 'Design & Marketing')?.length },
    { id: 'home', label: 'Home Services', icon: 'Home', count: mockVendors?.filter(v => v?.serviceCategory === 'Home Services')?.length },
    { id: 'legal', label: 'Legal', icon: 'Scale', count: mockVendors?.filter(v => v?.serviceCategory === 'Legal Services')?.length }
  ];

  // Search suggestions
  const searchSuggestions = [
    "IT consulting",
    "Web design",
    "Home repair",
    "Legal advice",
    "Financial planning",
    "Health coaching",
    "Auto repair",
    "Tutoring services"
  ];

  useEffect(() => {
    // Simulate loading
    const loadVendors = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setVendors(mockVendors);
      setFilteredVendors(mockVendors);
      setIsLoading(false);
    };

    loadVendors();
  }, []);

  useEffect(() => {
    // Apply filters and search
    let filtered = [...vendors];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered?.filter(vendor =>
        vendor?.businessName?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        vendor?.serviceCategory?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        vendor?.description?.toLowerCase()?.includes(searchQuery?.toLowerCase())
      );
    }

    // Apply active filters
    if (activeFilters?.includes('online')) {
      filtered = filtered?.filter(vendor => vendor?.isOnline);
    }
    if (activeFilters?.includes('rating')) {
      filtered = filtered?.filter(vendor => vendor?.rating >= 4.7);
    }
    if (activeFilters?.includes('it')) {
      filtered = filtered?.filter(vendor => vendor?.serviceCategory === 'IT Services');
    }
    if (activeFilters?.includes('design')) {
      filtered = filtered?.filter(vendor => vendor?.serviceCategory === 'Design & Marketing');
    }
    if (activeFilters?.includes('home')) {
      filtered = filtered?.filter(vendor => vendor?.serviceCategory === 'Home Services');
    }
    if (activeFilters?.includes('legal')) {
      filtered = filtered?.filter(vendor => vendor?.serviceCategory === 'Legal Services');
    }

    setFilteredVendors(filtered);
  }, [vendors, searchQuery, activeFilters]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (filters) => {
    setActiveFilters(filters);
  };


  // const handleCallNow = (vendor) => {
  //   const socket = new WebSocket("ws://13.203.254.15:8000/ws/room/join");

  //   socket.onopen = () => {
  //     console.log("✅ WebSocket connected");

  //     const payload = {
  //       user_id: vendor?.userId,                 // current user
  //       vendor_id: vendor?.id ,  // selected vendor
  //       product_id: 5,
  //     };

  //     socket.send(JSON.stringify(payload));
  //     console.log("📤 Sent payload:", payload);
  //   };

  //   socket.onmessage = (event) => {
  //     console.log("📥 Message from server:", event.data);

  //     try {
  //       const msg = JSON.parse(event.data);

  //       if (msg.event === "call_started") {
  //         // ✅ Save room & token in state
  //         setCallSession({
  //           room: msg.room,
  //           token: msg.token,
  //         });

  //         // ✅ Navigate to call screen with params
  //         navigate("/active-video-call", {
  //           state: { room: msg.room, token: msg.token },
  //         });
  //       }
  //     } catch (err) {
  //       console.error("❌ Failed to parse message:", err);
  //     }
  //   };

  //   socket.onerror = (error) => {
  //     console.error("❌ WebSocket error:", error);
  //   };

  //   socket.onclose = () => {
  //     console.log("🔒 WebSocket connection closed");
  //   };
  // };


  const handleCallNow = (vendor) => {
    const socket = new WebSocket("wss://livestreaming.emeetify.com/videoCall/ws/room/join");

    const encryptedData = encryptData({
      user_id: vendor?.userId,
      vendor_id: vendor?.id,
      product_id: 5,
    });

    const encryptedPayload = { data: encryptedData };

    socket.onopen = () => {
      console.log("✅ WebSocket connected");
      socket.send(JSON.stringify(encryptedPayload));
      console.log("📤 Sent encrypted payload");
    };

    socket.onmessage = (event) => {
      console.log("📩 Raw message from server:", event.data);

      try {
        const response = JSON.parse(event.data);

        // ✅ Case 1: Call is starting now
        if (response.event === "call_started") {
          console.log("🚀 Call started! Navigating...");
          setCallSession({
            room: response.room,
            token: response.token,
          });

          navigate("/active-video-call", {
            state: { room: response.room, token: response.token },
          });

          socket.close();
        }

        // ✅ Case 2: Request queued (vendor offline)
        else if (response.event === "request_sent" && response.status === "waiting") {
          const userMessage = response.message || "Your call request has been sent and is waiting for the vendor.";

          // 📢 Show user feedback
          alert(userMessage); // Simple fallback

          // ✅ Or use a toast/notification instead of alert (better UX)
          // showToast(userMessage, 'info');
        }

        // ✅ Case 3: Optional – Vendor busy
        else if (response.vendor_busy) {
          alert("Vendor is currently busy. Your request is in queue.");
        }

        // ✅ Case 4: Immediate error
        else if (response.event === "error" || response.status === "error") {
          alert(`❌ ${response.message || "Failed to send call request."}`);
        }

        // 🔽 Log unexpected events
        else {
          console.log("ℹ️ Other event:", response);
        }
      } catch (err) {
        console.error("❌ Failed to parse message:", err);
        alert("❌ Unexpected error: Could not process response.");
      }
    };

    socket.onerror = (error) => {
      console.error("❌ WebSocket error:", error);
      alert("❌ Connection failed. Please check your network and try again.");
    };

    socket.onclose = () => {
      console.log("🔒 WebSocket closed");
    };
  };



  const handleReconnect = (vendor) => {
    handleCallNow(vendor);
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setVendors([...mockVendors]);
    setIsLoading(false);
  };

  const handleCallNotificationDismiss = () => {
    setCallNotification({ isVisible: false, callerName: '', callType: 'incoming' });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header Navigation */}
      <HeaderNavigation
        userRole="buyer"
        notificationCount={3}
        isCallActive={false}
      />
      {/* Call Notification Banner */}
      <CallNotificationBanner
        isVisible={callNotification?.isVisible}
        callerName={callNotification?.callerName}
        callerType="vendor"
        callType={callNotification?.callType}
        onDismiss={handleCallNotificationDismiss}
        onAccept={() => { }}
        onReject={() => { }}
      />
      {/* Main Content */}
      <div className="flex">
        {/* Desktop Sidebar */}
        <BottomTabNavigation userRole="buyer" isCallActive={false} />

        {/* Main Content Area */}
        <main className="flex-1 lg:ml-64 pb-20 lg:pb-0">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Left Content */}
              <div className="flex-1">
                {/* Page Header */}
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-foreground mb-2">
                    Discover Vendors
                  </h1>
                  <p className="text-muted-foreground">
                    Connect with professional service providers through video calls
                  </p>
                </div>

                {/* Search Bar */}
                <div className="mb-4">
                  <SearchBar
                    onSearch={handleSearch}
                    suggestions={searchSuggestions}
                    isLoading={false}
                  />
                </div>

                {/* Filter Chips */}
                <div className="mb-6">
                  <FilterChips
                    filters={filterOptions}
                    activeFilters={activeFilters}
                    onFilterChange={handleFilterChange}
                  />
                </div>

                {/* Results Summary */}
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground">
                    {isLoading ? 'Loading vendors...' :
                      `Showing ${filteredVendors?.length} of ${vendors?.length} vendors`}
                    {searchQuery && ` for "${searchQuery}"`}
                    {activeFilters?.length > 0 && ` with ${activeFilters?.length} filter${activeFilters?.length > 1 ? 's' : ''} applied`}
                  </p>
                </div>

                {/* Vendor Grid */}
                <VendorGrid
                  vendors={filteredVendors}
                  isLoading={isLoading}
                  onCallNow={handleCallNow}
                  onRefresh={handleRefresh}
                  searchQuery={searchQuery}
                  activeFilters={activeFilters}
                />
              </div>

              {/* Right Sidebar - Desktop Only */}
              <div className="hidden xl:block w-80">
                <div className="sticky top-24 space-y-6">
                  <RecentCallsWidget
                    recentCalls={mockRecentCalls}
                    onReconnect={handleReconnect}
                  />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      {/* Bottom Tab Navigation */}
      <BottomTabNavigation userRole="buyer" isCallActive={false} />
    </div>
  );
};

export default BuyerDashboard;