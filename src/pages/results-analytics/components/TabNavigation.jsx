import React from 'react';
import Button from '../../../components/ui/Button';

const TabNavigation = ({ activeTab, onTabChange, userRole }) => {
  const tabs = [
    {
      id: 'individual',
      label: 'Individual Results',
      description: userRole === 'admin' ? 'Student-specific performance' : 'Your exam results'
    },
    {
      id: 'trends',
      label: 'Performance Trends',
      description: 'Progress over time'
    },
    {
      id: 'comparative',
      label: 'Comparative Analytics',
      description: userRole === 'admin' ? 'Class-wide comparisons' : 'Benchmark analysis'
    }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-2">
        {tabs?.map((tab) => (
          <Button
            key={tab?.id}
            variant={activeTab === tab?.id ? "default" : "ghost"}
            onClick={() => onTabChange(tab?.id)}
            className="flex-1 justify-start p-4 h-auto"
          >
            <div className="text-left">
              <div className="font-medium">{tab?.label}</div>
              <div className="text-xs opacity-70 mt-1">{tab?.description}</div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default TabNavigation;