import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import BottomTabNavigation from '../../components/ui/BottomTabNavigation';
import CallNotificationBanner from '../../components/ui/CallNotificationBanner';
import CallControlOverlay from '../../components/ui/CallControlOverlay';
import CallHistoryCard from './components/CallHistoryCard';
import CallStatusFilter from './components/CallStatusFilter';
import DateRangePicker from './components/DateRangePicker';
import CallRatingModal from './components/CallRatingModal';
import EmptyCallHistory from './components/EmptyCallHistory';
import CallHistorySearch from './components/CallHistorySearch';

const CallHistory = () => {
  const navigate = useNavigate();

  // State management
  const [userRole] = useState(() => localStorage.getItem('userRole'));
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDateRange, setSelectedDateRange] = useState(null);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [expandedCallId, setExpandedCallId] = useState(null);
  const [ratingModalCall, setRatingModalCall] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  // Call states
  const [isCallActive, setIsCallActive] = useState(false);
  const [callNotification, setCallNotification] = useState({
    isVisible: false,
    callerName: '',
    callType: 'incoming'
  });

  // Mock call history data
  const mockCallHistory = [
    {
      id: 1,
      participant: {
        name: "Sarah Johnson",
        business: "Johnson Electronics",
        role: "Electronics Vendor",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
      },
      direction: "outgoing",
      status: "completed",
      duration: 1245, // seconds
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      rating: 5,
      notes: "Discussed bulk order pricing for smartphones. Very helpful and professional service."
    },
    {
      id: 2,
      participant: {
        name: "Michael Chen",
        business: "Chen\'s Auto Parts",
        role: "Auto Parts Supplier",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
      },
      direction: "incoming",
      status: "missed",
      duration: 0,
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      rating: null,
      notes: null
    },
    {
      id: 3,
      participant: {
        name: "Emma Rodriguez",
        business: "Rodriguez Textiles",
        role: "Textile Manufacturer",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
      },
      direction: "outgoing",
      status: "completed",
      duration: 892,
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      rating: 4,
      notes: "Great discussion about fabric quality and delivery timelines. Will place order soon."
    },
    {
      id: 4,
      participant: {
        name: "David Kim",
        business: "Kim\'s Kitchen Supplies",
        role: "Restaurant Equipment",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
      },
      direction: "incoming",
      status: "declined",
      duration: 0,
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      rating: null,
      notes: "Call declined - was in another meeting"
    },
    {
      id: 5,
      participant: {
        name: "Lisa Wang",
        business: "Wang Digital Solutions",
        role: "Software Vendor",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face"
      },
      direction: "outgoing",
      status: "completed",
      duration: 1567,
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      rating: null,
      notes: "Detailed demo of their CRM system. Impressive features and competitive pricing."
    },
    {
      id: 6,
      participant: {
        name: "Robert Taylor",
        business: "Taylor Construction",
        role: "Building Materials",
        avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face"
      },
      direction: "incoming",
      status: "completed",
      duration: 734,
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      rating: 3,
      notes: "Discussed cement and steel requirements. Prices were reasonable but delivery time concerns."
    }
  ];

  // Filter and search logic
  const filteredCalls = useMemo(() => {
    let filtered = [...mockCallHistory];

    // Apply status filter
    if (activeFilter !== 'all') {
      filtered = filtered?.filter(call => call?.status === activeFilter);
    }

    // Apply search filter
    if (searchQuery?.trim()) {
      const query = searchQuery?.toLowerCase();
      filtered = filtered?.filter(call =>
        call?.participant?.name?.toLowerCase()?.includes(query) ||
        call?.participant?.business?.toLowerCase()?.includes(query) ||
        call?.participant?.role?.toLowerCase()?.includes(query)
      );
    }

    // Apply date range filter
    if (selectedDateRange) {
      const { start, end } = selectedDateRange;
      filtered = filtered?.filter(call => {
        const callDate = new Date(call.timestamp);
        return callDate >= start && callDate <= end;
      });
    }

    return filtered?.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }, [mockCallHistory, activeFilter, searchQuery, selectedDateRange]);

  // Calculate call counts for filter badges
  const callCounts = useMemo(() => {
    return {
      all: mockCallHistory?.length,
      completed: mockCallHistory?.filter(call => call?.status === 'completed')?.length,
      missed: mockCallHistory?.filter(call => call?.status === 'missed')?.length,
      declined: mockCallHistory?.filter(call => call?.status === 'declined')?.length
    };
  }, [mockCallHistory]);

  // Handlers
  const handleSearchChange = (query) => {
    setIsSearching(true);
    setSearchQuery(query);

    // Simulate search delay
    setTimeout(() => {
      setIsSearching(false);
    }, 300);
  };

  const handleCallback = (call) => {
    // Simulate initiating a call
    setCallNotification({
      isVisible: true,
      callerName: call?.participant?.name,
      callType: 'connecting'
    });

    // Simulate connection process
    setTimeout(() => {
      setCallNotification(prev => ({ ...prev, isVisible: false }));
      setIsCallActive(true);
    }, 3000);
  };

  const handleViewDetails = (call) => {
    setExpandedCallId(expandedCallId === call?.id ? null : call?.id);
  };

  const handleRate = (call) => {
    setRatingModalCall(call);
  };

  const handleSubmitRating = async (ratingData) => {
    // Simulate API call
    console.log('Submitting rating:', ratingData);

    // Update local state (in real app, this would update the backend)
    // For demo purposes, we'll just close the modal
    setRatingModalCall(null);
  };

  const handleClearFilters = () => {
    setActiveFilter('all');
    setSearchQuery('');
    setSelectedDateRange(null);
  };

  const handleStartCalling = () => {
    navigate(userRole === 'buyer' ? '/buyer-dashboard' : '/vendor-dashboard');
  };

  const handleEndCall = () => {
    setIsCallActive(false);
  };

  const handleAcceptCall = () => {
    setCallNotification(prev => ({ ...prev, isVisible: false }));
    setIsCallActive(true);
  };

  const handleRejectCall = () => {
    setCallNotification(prev => ({ ...prev, isVisible: false }));
  };

  const handleDismissNotification = () => {
    setCallNotification(prev => ({ ...prev, isVisible: false }));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header Navigation */}
      <HeaderNavigation
        userRole={userRole}
        notificationCount={2}
        isCallActive={isCallActive}
      />
      {/* Call Notification Banner */}
      <CallNotificationBanner
        isVisible={callNotification?.isVisible}
        callerName={callNotification?.callerName}
        callType={callNotification?.callType}
        onAccept={handleAcceptCall}
        onReject={handleRejectCall}
        onDismiss={handleDismissNotification}
      />
      {/* Call Control Overlay */}
      <CallControlOverlay
        isCallActive={isCallActive}
        onEndCall={handleEndCall}
        onMuteToggle={() => { }}
        onCameraToggle={() => { }}
        participantName="Sarah Johnson"
        callDuration={125}
      />
      {/* Main Content */}
      <div className="lg:pl-64 pb-16 lg:pb-0">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="bg-card border-b border-border px-4 py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Call History</h1>
                <p className="text-muted-foreground mt-1">
                  Review your past conversations and reconnect with contacts
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <DateRangePicker
                  selectedRange={selectedDateRange}
                  onRangeChange={setSelectedDateRange}
                  isOpen={isDatePickerOpen}
                  onToggle={() => setIsDatePickerOpen(!isDatePickerOpen)}
                />
              </div>
            </div>
          </div>

          {/* Search */}
          <CallHistorySearch
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            onClearSearch={() => setSearchQuery('')}
            isSearching={isSearching}
          />

          {/* Status Filters */}
          <CallStatusFilter
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            callCounts={callCounts}
          />

          {/* Call History List */}
          <div className="p-4">
            {filteredCalls?.length === 0 ? (
              <EmptyCallHistory
                filterType={activeFilter}
                onClearFilters={handleClearFilters}
                onStartCalling={handleStartCalling}
              />
            ) : (
              <div className="space-y-4">
                {/* Results Summary */}
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {filteredCalls?.length} {filteredCalls?.length === 1 ? 'call' : 'calls'} found
                  </p>
                  {(searchQuery || selectedDateRange || activeFilter !== 'all') && (
                    <button
                      onClick={handleClearFilters}
                      className="text-sm text-primary hover:text-primary/80 transition-micro"
                    >
                      Clear all filters
                    </button>
                  )}
                </div>

                {/* Call Cards */}
                <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
                  {filteredCalls?.map((call) => (
                    <CallHistoryCard
                      key={call?.id}
                      call={call}
                      onCallback={handleCallback}
                      onViewDetails={handleViewDetails}
                      onRate={handleRate}
                      isExpanded={expandedCallId === call?.id}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Rating Modal */}
      <CallRatingModal
        isOpen={!!ratingModalCall}
        onClose={() => setRatingModalCall(null)}
        call={ratingModalCall}
        onSubmitRating={handleSubmitRating}
      />
      {/* Bottom Navigation */}
      <BottomTabNavigation
        userRole={userRole}
        isCallActive={isCallActive}
      />
    </div>
  );
};

export default CallHistory;