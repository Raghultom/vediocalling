import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const CallHistorySearch = ({ 
  searchQuery, 
  onSearchChange, 
  onClearSearch,
  placeholder = "Search by name or business...",
  isSearching = false 
}) => {
  const [localQuery, setLocalQuery] = useState(searchQuery || '');
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    setLocalQuery(searchQuery || '');
  }, [searchQuery]);

  const handleInputChange = (e) => {
    const value = e?.target?.value;
    setLocalQuery(value);
    
    // Debounce search
    const timeoutId = setTimeout(() => {
      onSearchChange(value);
    }, 300);

    return () => clearTimeout(timeoutId);
  };

  const handleClear = () => {
    setLocalQuery('');
    onSearchChange('');
    onClearSearch?.();
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    onSearchChange(localQuery);
  };

  return (
    <div className="bg-card border-b border-border px-4 py-3">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          {/* Search Icon */}
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            {isSearching ? (
              <Icon 
                name="Loader2" 
                size={18} 
                className="text-muted-foreground animate-spin" 
              />
            ) : (
              <Icon 
                name="Search" 
                size={18} 
                className="text-muted-foreground" 
              />
            )}
          </div>

          {/* Search Input */}
          <input
            type="text"
            value={localQuery}
            onChange={handleInputChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            className={`w-full pl-10 pr-12 py-2.5 text-sm border rounded-lg bg-input text-foreground placeholder-muted-foreground transition-standard focus:outline-none focus:ring-2 focus:ring-ring ${
              isFocused ? 'border-ring' : 'border-border'
            }`}
          />

          {/* Clear Button */}
          {localQuery && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleClear}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
            >
              <Icon name="X" size={16} />
            </Button>
          )}
        </div>

        {/* Search Suggestions or Recent Searches */}
        {isFocused && localQuery?.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-elevation z-50 max-h-60 overflow-y-auto">
            <div className="p-2">
              <div className="flex items-center justify-between px-3 py-2 text-xs text-muted-foreground">
                <span>Search Results</span>
                <span>Press Enter to search</span>
              </div>
            </div>
          </div>
        )}
      </form>
      {/* Search Stats */}
      {searchQuery && (
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
          <div className="flex items-center space-x-2">
            <Icon name="Search" size={14} className="text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              Searching for "{searchQuery}"
            </span>
          </div>
          <Button
            variant="ghost"
            size="xs"
            onClick={handleClear}
            iconName="X"
            iconPosition="left"
            iconSize={12}
          >
            Clear
          </Button>
        </div>
      )}
    </div>
  );
};

export default CallHistorySearch;