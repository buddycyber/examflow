import React from 'react';
import Icon from '../../../components/AppIcon';

const ActivityFeedItem = ({ activity }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'registration':
        return 'UserPlus';
      case 'exam_completion':
        return 'CheckCircle';
      case 'high_score':
        return 'Trophy';
      case 'login':
        return 'LogIn';
      default:
        return 'Activity';
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'registration':
        return 'text-primary';
      case 'exam_completion':
        return 'text-success';
      case 'high_score':
        return 'text-warning';
      case 'login':
        return 'text-muted-foreground';
      default:
        return 'text-muted-foreground';
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - activityTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <div className="flex items-start space-x-3 p-3 hover:bg-muted/50 rounded-lg transition-colors duration-150">
      <div className={`p-2 rounded-full bg-muted ${getActivityColor(activity?.type)}`}>
        <Icon name={getActivityIcon(activity?.type)} size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground">
          <span className="font-medium">{activity?.studentName}</span>
          <span className="text-muted-foreground ml-1">{activity?.description}</span>
        </p>
        {activity?.details && (
          <p className="text-xs text-muted-foreground mt-1">{activity?.details}</p>
        )}
        <p className="text-xs text-muted-foreground mt-1">
          {formatTimeAgo(activity?.timestamp)}
        </p>
      </div>
      {activity?.score && (
        <div className="text-sm font-medium text-success">
          {activity?.score}%
        </div>
      )}
    </div>
  );
};

export default ActivityFeedItem;