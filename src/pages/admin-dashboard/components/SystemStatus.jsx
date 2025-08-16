import React from 'react';
import Icon from '../../../components/AppIcon';

const SystemStatus = ({ lastUpdated, autoRefresh = true }) => {
  const formatLastUpdated = (timestamp) => {
    const date = new Date(timestamp);
    return date?.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const systemMetrics = [
    {
      label: 'System Status',
      value: 'Operational',
      status: 'success',
      icon: 'CheckCircle'
    },
    {
      label: 'Active Sessions',
      value: '247',
      status: 'normal',
      icon: 'Users'
    },
    {
      label: 'Server Load',
      value: '23%',
      status: 'success',
      icon: 'Activity'
    },
    {
      label: 'Database',
      value: 'Connected',
      status: 'success',
      icon: 'Database'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'text-success';
      case 'warning':
        return 'text-warning';
      case 'error':
        return 'text-error';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">System Status</h3>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          {autoRefresh && (
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <span>Auto-refresh</span>
            </div>
          )}
          <span>Updated {formatLastUpdated(lastUpdated)}</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {systemMetrics?.map((metric, index) => (
          <div key={index} className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
            <Icon 
              name={metric?.icon} 
              size={20} 
              className={getStatusColor(metric?.status)} 
            />
            <div>
              <p className="text-sm font-medium text-foreground">{metric?.value}</p>
              <p className="text-xs text-muted-foreground">{metric?.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SystemStatus;