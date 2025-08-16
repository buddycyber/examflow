import React from 'react';
import Icon from '../../../components/AppIcon';

const ProgressTimeline = ({ levels, currentLevel }) => {
  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-foreground">Learning Progress</h2>
        <div className="text-sm text-muted-foreground">
          Level {currentLevel} of {levels?.length}
        </div>
      </div>
      <div className="space-y-4">
        {levels?.map((level, index) => {
          const isCompleted = index < currentLevel - 1;
          const isCurrent = index === currentLevel - 1;
          const isLocked = index > currentLevel - 1;
          
          return (
            <div key={level?.id} className="flex items-center space-x-4">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                isCompleted 
                  ? 'bg-success border-success text-success-foreground' 
                  : isCurrent 
                    ? 'bg-primary border-primary text-primary-foreground'
                    : 'bg-muted border-border text-muted-foreground'
              }`}>
                {isCompleted ? (
                  <Icon name="Check" size={16} />
                ) : (
                  <span className="text-sm font-medium">{index + 1}</span>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className={`font-medium ${
                    isLocked ? 'text-muted-foreground' : 'text-foreground'
                  }`}>
                    {level?.title}
                  </h3>
                  {isLocked && (
                    <Icon name="Lock" size={16} className="text-muted-foreground" />
                  )}
                </div>
                
                <div className="flex items-center space-x-4 mt-1">
                  <span className={`text-sm ${
                    isLocked ? 'text-muted-foreground' : 'text-muted-foreground'
                  }`}>
                    {level?.examCount} exams
                  </span>
                  
                  {isCompleted && (
                    <div className="flex items-center space-x-1 text-success">
                      <Icon name="Trophy" size={14} />
                      <span className="text-sm font-medium">{level?.score}%</span>
                    </div>
                  )}
                  
                  {isCurrent && (
                    <div className="flex-1 max-w-32">
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${level?.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
                
                {isLocked && level?.unlockRequirement && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Unlock: {level?.unlockRequirement}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressTimeline;