import React from 'react';
import Icon from '../../../components/AppIcon';

const RoleSelectionCard = ({ role, title, description, icon, isSelected, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(role)}
      className={`p-4 rounded-lg border-2 cursor-pointer transition-standard ${
        isSelected
          ? 'border-primary bg-primary/5 shadow-soft'
          : 'border-border hover:border-primary/50 hover:bg-muted/50'
      }`}
    >
      <div className="flex items-start space-x-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
          isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
        }`}>
          <Icon name={icon} size={20} />
        </div>
        <div className="flex-1">
          <h3 className={`font-medium mb-1 ${
            isSelected ? 'text-primary' : 'text-foreground'
          }`}>
            {title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
          isSelected
            ? 'border-primary bg-primary' :'border-muted-foreground'
        }`}>
          {isSelected && (
            <Icon name="Check" size={12} color="white" />
          )}
        </div>
      </div>
    </div>
  );
};

export default RoleSelectionCard;