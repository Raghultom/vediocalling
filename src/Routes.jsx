import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import UserLogin from './pages/user-login';
import BuyerDashboard from './pages/buyer-dashboard';
import ActiveVideoCall from './pages/active-video-call';
import CallHistory from './pages/call-history';
import VendorDashboard from './pages/vendor-dashboard';
import UserRegistration from './pages/user-registration';

const Routes = () => {
  return ( 
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<UserRegistration />} />
        <Route path="/user-login" element={<UserLogin />} />
        <Route path="/buyer-dashboard" element={<BuyerDashboard />} />
        <Route path="/active-video-call" element={<ActiveVideoCall />} />
        <Route path="/call-history" element={<CallHistory />} />
        <Route path="/vendor-dashboard" element={<VendorDashboard />} />
        <Route path="/user-registration" element={<UserRegistration />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
