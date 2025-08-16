import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ClassLinks = ({ classLinks }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const isLinkAvailable = (link) => {
    const now = currentTime?.getTime();
    const startTime = new Date(link.availableFrom)?.getTime();
    const endTime = new Date(link.availableUntil)?.getTime();
    
    return now >= startTime && now <= endTime;
  };

  const getTimeUntilAvailable = (link) => {
    const now = currentTime?.getTime();
    const startTime = new Date(link.availableFrom)?.getTime();
    const diff = startTime - now;
    
    if (diff <= 0) return null;
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getPlatformIcon = (platform) => {
    switch (platform?.toLowerCase()) {
      case 'zoom':
        return 'Video';
      case 'meet':
        return 'Video';
      case 'youtube':
        return 'Play';
      default:
        return 'ExternalLink';
    }
  };

  const getPlatformColor = (platform) => {
    switch (platform?.toLowerCase()) {
      case 'zoom':
        return 'bg-blue-500/10 text-blue-600';
      case 'meet':
        return 'bg-green-500/10 text-green-600';
      case 'youtube':
        return 'bg-red-500/10 text-red-600';
      default:
        return 'bg-primary/10 text-primary';
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-foreground">Class Links</h2>
        <div className="text-sm text-muted-foreground">
          {classLinks?.filter(link => isLinkAvailable(link))?.length} available now
        </div>
      </div>
      <div className="space-y-4">
        {classLinks?.map((link) => {
          const isAvailable = isLinkAvailable(link);
          const timeUntil = getTimeUntilAvailable(link);
          
          return (
            <div key={link?.id} className={`border rounded-lg p-4 transition-all duration-200 ${
              isAvailable 
                ? 'border-primary/50 bg-primary/5' :'border-border bg-background'
            }`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      getPlatformColor(link?.platform)
                    }`}>
                      <Icon name={getPlatformIcon(link?.platform)} size={16} />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">{link?.title}</h3>
                      <p className="text-sm text-muted-foreground">{link?.subject}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center space-x-1">
                      <Icon name="Calendar" size={14} />
                      <span>{new Date(link.availableFrom)?.toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Icon name="Clock" size={14} />
                      <span>
                        {new Date(link.availableFrom)?.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })} - {new Date(link.availableUntil)?.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                  </div>
                  
                  {link?.description && (
                    <p className="text-sm text-muted-foreground mb-3">
                      {link?.description}
                    </p>
                  )}
                  
                  {!isAvailable && timeUntil && (
                    <div className="flex items-center space-x-2 text-sm">
                      <Icon name="Timer" size={14} className="text-warning" />
                      <span className="text-warning">Available in {timeUntil}</span>
                    </div>
                  )}
                  
                  {isAvailable && link?.liveNow && (
                    <div className="flex items-center space-x-2 text-sm">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                      <span className="text-red-600 font-medium">Live Now</span>
                    </div>
                  )}
                </div>
                
                <div className="ml-4">
                  {isAvailable ? (
                    <Button
                      variant="default"
                      onClick={() => window.open(link?.url, '_blank')}
                      iconName="ExternalLink"
                      iconPosition="right"
                      iconSize={16}
                      className="bg-primary hover:bg-primary/90"
                    >
                      Join {link?.platform}
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      disabled
                      iconName="Clock"
                      iconPosition="left"
                      iconSize={16}
                    >
                      Not Available
                    </Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        
        {classLinks?.length === 0 && (
          <div className="text-center py-8">
            <Icon name="Calendar" size={48} className="text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No class links scheduled</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassLinks;