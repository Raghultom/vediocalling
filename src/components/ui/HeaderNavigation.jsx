import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import Input from './Input';

const HeaderNavigation = ({ userRole = 'buyer', notificationCount = 0, isCallActive = false }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e?.preventDefault();
    if (searchQuery?.trim()) {
      // Handle search functionality
      console.log('Searching for:', searchQuery);
    }
  };

  const handleProfileClick = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const handleLogout = () => {
    // Clear specific items
    localStorage.removeItem('userRole');
    localStorage.removeItem('isAuthenticated');

    navigate('/user-login');
  };


  const isAuthPage = location?.pathname === '/user-login' || location?.pathname === '/user-registration';

  if (isAuthPage || isCallActive) {
    return null;
  }

  return (
    <header className="sticky top-0 z-200 bg-card border-b border-border shadow-soft">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Logo */}
        <div className="flex items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Video" size={20} color="white" />
            </div>
            <span className="text-xl font-semibold text-foreground">VendorConnect</span>
          </div>
        </div>

        {/* Search Bar - Desktop (Buyers only) */}
        {userRole === 'buyer' && (
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <Icon
                  name="Search"
                  size={20}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  type="search"
                  placeholder="Search vendors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e?.target?.value)}
                  className="pl-10 pr-4 w-full"
                />
              </div>
            </form>
          </div>
        )}

        {/* Right Side Actions */}
        <div className="flex items-center space-x-2">
          {/* Mobile Search Toggle (Buyers only) */}
          {userRole === 'buyer' && (
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setShowMobileSearch(!showMobileSearch)}
            >
              <Icon name="Search" size={20} />
            </Button>
          )}

          {/* Vendor Availability Toggle */}
          {userRole === 'vendor' && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground hidden sm:inline">Available</span>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-success transition-colors">
                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
              </button>
            </div>
          )}

          {/* Notifications */}
          <div className="relative">
            <Button variant="ghost" size="icon">
              <Icon name="Bell" size={20} />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-error text-error-foreground text-xs flex items-center justify-center">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </span>
              )}
            </Button>
          </div>

          {/* Profile Menu */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleProfileClick}
              className="rounded-full"
            >
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                <Icon name="User" size={16} />
              </div>
            </Button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-popover border border-border rounded-lg shadow-elevation z-300">
                <div className="py-1">
                  <div className="px-4 py-2 border-b border-border">
                    <p className="text-sm font-medium text-foreground">
                      {userRole === 'buyer' ? 'Buyer Account' : 'Vendor Account'}
                    </p>
                    <p className="text-xs text-muted-foreground">user@example.com</p>
                  </div>
                  <button className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-muted transition-micro">
                    Profile Settings
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-muted transition-micro">
                    Account Settings
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-muted transition-micro">
                    Help & Support
                  </button>
                  <div className="border-t border-border">
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-sm text-error hover:bg-muted transition-micro"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Mobile Search Bar */}
      {showMobileSearch && userRole === 'buyer' && (
        <div className="md:hidden border-t border-border px-4 py-3">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Icon
                name="Search"
                size={20}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
              />
              <Input
                type="search"
                placeholder="Search vendors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e?.target?.value)}
                className="pl-10 pr-4 w-full"
              />
            </div>
          </form>
        </div>
      )}
    </header>
  );
};

export default HeaderNavigation;