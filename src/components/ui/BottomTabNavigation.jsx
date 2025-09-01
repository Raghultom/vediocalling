import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';

const BottomTabNavigation = ({ userRole = 'buyer', isCallActive = false }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isAuthPage = location?.pathname === '/user-login' || location?.pathname === '/user-registration';
  
  if (isAuthPage || isCallActive) {
    return null;
  }

  const getDashboardPath = () => {
    return userRole === 'buyer' ? '/buyer-dashboard' : '/vendor-dashboard';
  };

  const getDashboardLabel = () => {
    return userRole === 'buyer' ? 'Discover' : 'Dashboard';
  };

  const getDashboardIcon = () => {
    return userRole === 'buyer' ? 'Search' : 'LayoutDashboard';
  };

  const tabs = [
    {
      id: 'dashboard',
      label: getDashboardLabel(),
      icon: getDashboardIcon(),
      path: getDashboardPath(),
      isActive: location?.pathname === getDashboardPath()
    },
    {
      id: 'history',
      label: 'History',
      icon: 'History',
      path: '/call-history',
      isActive: location?.pathname === '/call-history'
    }
  ];

  const handleTabClick = (path) => {
    navigate(path);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-100 lg:block lg:w-64 lg:bg-card lg:border-r lg:border-border lg:shadow-soft">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center px-6 py-4 border-b border-border">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Video" size={20} color="white" />
              </div>
              <span className="text-xl font-semibold text-foreground">VendorConnect</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {tabs?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => handleTabClick(tab?.path)}
                className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-micro ${
                  tab?.isActive
                    ? 'bg-primary text-primary-foreground shadow-soft'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon 
                  name={tab?.icon} 
                  size={20} 
                  className="mr-3"
                />
                <span className="font-medium">{tab?.label}</span>
              </button>
            ))}
          </nav>

          {/* User Role Indicator */}
          <div className="px-6 py-4 border-t border-border">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                <Icon name="User" size={16} />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {userRole === 'buyer' ? 'Buyer Account' : 'Vendor Account'}
                </p>
                <p className="text-xs text-muted-foreground">user@example.com</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-100 bg-card border-t border-border shadow-elevation">
        <div className="flex">
          {tabs?.map((tab) => (
            <button
              key={tab?.id}
              onClick={() => handleTabClick(tab?.path)}
              className={`flex-1 flex flex-col items-center justify-center py-3 px-2 transition-micro ${
                tab?.isActive
                  ? 'text-primary' :'text-muted-foreground'
              }`}
            >
              <Icon 
                name={tab?.icon} 
                size={24} 
                className={`mb-1 transition-micro ${
                  tab?.isActive ? 'scale-110' : 'scale-100'
                }`}
              />
              <span className={`text-xs font-medium transition-micro ${
                tab?.isActive ? 'opacity-100' : 'opacity-70'
              }`}>
                {tab?.label}
              </span>
            </button>
          ))}
        </div>
      </nav>
    </>
  );
};

export default BottomTabNavigation;