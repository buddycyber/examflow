import React from 'react';
import Icon from '../../../components/AppIcon';

const AutoSaveIndicator = ({ status, lastSaved }) => {
  const formatLastSaved = (timestamp) => {
    if (!timestamp) return '';
    
    const now = new Date();
    const saved = new Date(timestamp);
    const diffInSeconds = Math.floor((now - saved) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes}m ago`;
    } else {
      return saved?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  };

  const getStatusConfig = () => {
    switch (status) {
      case 'saving':
        return {
          icon: 'Loader2',
          text: 'Saving...',
          className: 'text-muted-foreground',
          iconClassName: 'animate-spin'
        };
      case 'saved':
        return {
          icon: 'Check',
          text: `Saved ${formatLastSaved(lastSaved)}`,
          className: 'text-success',
          iconClassName: ''
        };
      case 'error':
        return {
          icon: 'AlertCircle',
          text: 'Save failed',
          className: 'text-error',
          iconClassName: ''
        };
      case 'offline':
        return {
          icon: 'WifiOff',
          text: 'Offline - will save when connected',
          className: 'text-warning',
          iconClassName: ''
        };
      default:
        return null;
    }
  };

  const config = getStatusConfig();
  
  if (!config) return null;

  return (
    <div className={`flex items-center space-x-1 text-xs ${config?.className}`}>
      <Icon 
        name={config?.icon} 
        size={12} 
        className={config?.iconClassName} 
      />
      <span>{config?.text}</span>
    </div>
  );
};

export default AutoSaveIndicator;