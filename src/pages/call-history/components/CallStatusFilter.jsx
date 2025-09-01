import React from 'react';

const CallStatusFilter = ({ 
  activeFilter, 
  onFilterChange, 
  callCounts = {} 
}) => {
  const filters = [
    { 
      id: 'all', 
      label: 'All', 
      count: callCounts?.all || 0 
    },
    { 
      id: 'completed', 
      label: 'Completed', 
      count: callCounts?.completed || 0 
    },
    { 
      id: 'missed', 
      label: 'Missed', 
      count: callCounts?.missed || 0 
    },
    { 
      id: 'declined', 
      label: 'Declined', 
      count: callCounts?.declined || 0 
    }
  ];

  return (
    <div className="bg-card border-b border-border px-4 py-3">
      <div className="flex items-center space-x-2 overflow-x-auto scrollbar-hide">
        {filters?.map((filter) => (
          <button
            key={filter?.id}
            onClick={() => onFilterChange(filter?.id)}
            className={`flex-shrink-0 inline-flex items-center px-3 py-2 rounded-full text-sm font-medium transition-standard ${
              activeFilter === filter?.id
                ? 'bg-primary text-primary-foreground shadow-soft'
                : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
            }`}
          >
            <span>{filter?.label}</span>
            {filter?.count > 0 && (
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${
                activeFilter === filter?.id
                  ? 'bg-primary-foreground/20 text-primary-foreground'
                  : 'bg-foreground/10 text-foreground'
              }`}>
                {filter?.count}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CallStatusFilter;