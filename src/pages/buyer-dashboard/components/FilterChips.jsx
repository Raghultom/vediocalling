import React from 'react';
import Icon from '../../../components/AppIcon';

const FilterChips = ({ filters, activeFilters, onFilterChange }) => {
  const handleChipClick = (filterId) => {
    const isActive = activeFilters?.includes(filterId);
    if (isActive) {
      onFilterChange(activeFilters?.filter(id => id !== filterId));
    } else {
      onFilterChange([...activeFilters, filterId]);
    }
  };

  return (
    <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-hide">
      {filters?.map((filter) => {
        const isActive = activeFilters?.includes(filter?.id);
        return (
          <button
            key={filter?.id}
            onClick={() => handleChipClick(filter?.id)}
            className={`flex items-center space-x-1 px-3 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-standard ${
              isActive
                ? 'bg-primary text-primary-foreground shadow-soft'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {filter?.icon && (
              <Icon 
                name={filter?.icon} 
                size={14} 
                className={isActive ? 'text-primary-foreground' : 'text-muted-foreground'}
              />
            )}
            <span>{filter?.label}</span>
            {filter?.count && (
              <span className={`ml-1 text-xs ${
                isActive ? 'text-primary-foreground/80' : 'text-muted-foreground/60'
              }`}>
                ({filter?.count})
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default FilterChips;