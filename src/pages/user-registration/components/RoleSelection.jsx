import React from 'react';
import RoleSelectionCard from './RoleSelectionCard';

const RoleSelection = ({ selectedRole, setSelectedRole, error }) => {
  const roles = [
    {
      role: 'buyer',
      title: "I\'m a Buyer",
      description: "Looking for vendors and services. Connect with service providers through video calls.",
      icon: 'Search'
    },
    {
      role: 'vendor',
      title: "I'm a Vendor",
      description: "Offering services to customers. Receive and manage video calls from potential clients.",
      icon: 'Briefcase'
    }
  ];

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-foreground mb-3">
          Choose Your Role <span className="text-error">*</span>
        </label>
        <div className="space-y-3">
          {roles?.map((roleData) => (
            <RoleSelectionCard
              key={roleData?.role}
              role={roleData?.role}
              title={roleData?.title}
              description={roleData?.description}
              icon={roleData?.icon}
              isSelected={selectedRole === roleData?.role}
              onSelect={setSelectedRole}
            />
          ))}
        </div>
        {error && (
          <p className="text-error text-sm mt-2">{error}</p>
        )}
      </div>
    </div>
  );
};

export default RoleSelection;