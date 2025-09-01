import React, { useState } from 'react';

import Button from '../../../components/ui/Button';

const DateRangePicker = ({ 
  selectedRange, 
  onRangeChange,
  isOpen,
  onToggle 
}) => {
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  const presetRanges = [
    { 
      id: 'today', 
      label: 'Today',
      getValue: () => {
        const today = new Date();
        return {
          start: new Date(today.setHours(0, 0, 0, 0)),
          end: new Date(today.setHours(23, 59, 59, 999))
        };
      }
    },
    { 
      id: 'yesterday', 
      label: 'Yesterday',
      getValue: () => {
        const yesterday = new Date();
        yesterday?.setDate(yesterday?.getDate() - 1);
        return {
          start: new Date(yesterday.setHours(0, 0, 0, 0)),
          end: new Date(yesterday.setHours(23, 59, 59, 999))
        };
      }
    },
    { 
      id: 'last7days', 
      label: 'Last 7 Days',
      getValue: () => {
        const end = new Date();
        const start = new Date();
        start?.setDate(start?.getDate() - 7);
        return { start, end };
      }
    },
    { 
      id: 'last30days', 
      label: 'Last 30 Days',
      getValue: () => {
        const end = new Date();
        const start = new Date();
        start?.setDate(start?.getDate() - 30);
        return { start, end };
      }
    },
    { 
      id: 'thismonth', 
      label: 'This Month',
      getValue: () => {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
        return { start, end };
      }
    },
    { 
      id: 'lastmonth', 
      label: 'Last Month',
      getValue: () => {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const end = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
        return { start, end };
      }
    }
  ];

  const handlePresetSelect = (preset) => {
    const range = preset?.getValue();
    onRangeChange(range);
    onToggle();
  };

  const handleCustomRangeApply = () => {
    if (customStartDate && customEndDate) {
      const start = new Date(customStartDate);
      const end = new Date(customEndDate);
      end?.setHours(23, 59, 59, 999);
      
      if (start <= end) {
        onRangeChange({ start, end });
        onToggle();
      }
    }
  };

  const formatSelectedRange = () => {
    if (!selectedRange) return 'All Time';
    
    const { start, end } = selectedRange;
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    // Check if it's today
    const today = new Date();
    if (startDate?.toDateString() === today?.toDateString() && 
        endDate?.toDateString() === today?.toDateString()) {
      return 'Today';
    }
    
    // Check if it's yesterday
    const yesterday = new Date();
    yesterday?.setDate(yesterday?.getDate() - 1);
    if (startDate?.toDateString() === yesterday?.toDateString() && 
        endDate?.toDateString() === yesterday?.toDateString()) {
      return 'Yesterday';
    }
    
    // Format custom range
    const formatDate = (date) => {
      return date?.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date?.getFullYear() !== today?.getFullYear() ? 'numeric' : undefined
      });
    };
    
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  };

  return (
    <div className="relative">
      {/* Trigger Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={onToggle}
        iconName="Calendar"
        iconPosition="left"
        iconSize={16}
        className="min-w-0"
      >
        <span className="hidden sm:inline">{formatSelectedRange()}</span>
        <span className="sm:hidden">Date</span>
      </Button>
      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={onToggle}
          />
          
          {/* Dropdown Content */}
          <div className="absolute right-0 mt-2 w-80 bg-popover border border-border rounded-lg shadow-elevation z-50">
            <div className="p-4">
              <h3 className="text-sm font-medium text-foreground mb-3">Select Date Range</h3>
              
              {/* Preset Ranges */}
              <div className="space-y-1 mb-4">
                {presetRanges?.map((preset) => (
                  <button
                    key={preset?.id}
                    onClick={() => handlePresetSelect(preset)}
                    className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-micro"
                  >
                    {preset?.label}
                  </button>
                ))}
              </div>

              {/* Custom Range */}
              <div className="border-t border-border pt-4">
                <h4 className="text-xs font-medium text-foreground mb-2">Custom Range</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">Start Date</label>
                    <input
                      type="date"
                      value={customStartDate}
                      onChange={(e) => setCustomStartDate(e?.target?.value)}
                      className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">End Date</label>
                    <input
                      type="date"
                      value={customEndDate}
                      onChange={(e) => setCustomEndDate(e?.target?.value)}
                      className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onToggle}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={handleCustomRangeApply}
                      disabled={!customStartDate || !customEndDate}
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DateRangePicker;