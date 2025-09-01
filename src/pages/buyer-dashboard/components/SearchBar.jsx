import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';

const SearchBar = ({ onSearch, suggestions = [], isLoading = false }) => {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  const filteredSuggestions = suggestions?.filter(suggestion =>
    suggestion?.toLowerCase()?.includes(query?.toLowerCase())
  )?.slice(0, 5);

  const handleInputChange = (e) => {
    const value = e?.target?.value;
    setQuery(value);
    setShowSuggestions(value?.length > 0);
    setSelectedIndex(-1);
    onSearch(value);
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    onSearch(suggestion);
    inputRef?.current?.blur();
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || filteredSuggestions?.length === 0) return;

    switch (e?.key) {
      case 'ArrowDown':
        e?.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredSuggestions?.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e?.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : filteredSuggestions?.length - 1
        );
        break;
      case 'Enter':
        e?.preventDefault();
        if (selectedIndex >= 0) {
          handleSuggestionClick(filteredSuggestions?.[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        inputRef?.current?.blur();
        break;
    }
  };

  const handleClear = () => {
    setQuery('');
    setShowSuggestions(false);
    onSearch('');
    inputRef?.current?.focus();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef?.current && !suggestionsRef?.current?.contains(event?.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={suggestionsRef}>
      <div className="relative">
        <Icon 
          name="Search" 
          size={20} 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
        />
        <Input
          ref={inputRef}
          type="search"
          placeholder="Search vendors, services..."
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="pl-10 pr-10"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-micro"
          >
            <Icon name="X" size={16} />
          </button>
        )}
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Icon name="Loader2" size={16} className="animate-spin text-muted-foreground" />
          </div>
        )}
      </div>
      {/* Suggestions Dropdown */}
      {showSuggestions && filteredSuggestions?.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-elevation z-50 max-h-60 overflow-y-auto">
          {filteredSuggestions?.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className={`w-full px-4 py-3 text-left text-sm hover:bg-muted transition-micro ${
                index === selectedIndex ? 'bg-muted' : ''
              }`}
            >
              <div className="flex items-center space-x-2">
                <Icon name="Search" size={14} className="text-muted-foreground" />
                <span className="text-foreground">{suggestion}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;