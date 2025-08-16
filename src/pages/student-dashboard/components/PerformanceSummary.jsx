import React from 'react';
import Icon from '../../../components/AppIcon';

const PerformanceSummary = ({ stats, achievements, upcomingDeadlines }) => {
  return (
    <div className="space-y-6">
      {/* Performance Stats */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Performance Summary</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name="Target" size={16} className="text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">Overall Average</span>
            </div>
            <span className="text-lg font-semibold text-foreground">{stats?.overallAverage}%</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
                <Icon name="CheckCircle" size={16} className="text-success" />
              </div>
              <span className="text-sm text-muted-foreground">Exams Completed</span>
            </div>
            <span className="text-lg font-semibold text-foreground">{stats?.completedExams}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-warning/10 rounded-lg flex items-center justify-center">
                <Icon name="Clock" size={16} className="text-warning" />
              </div>
              <span className="text-sm text-muted-foreground">Study Streak</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-lg font-semibold text-foreground">{stats?.studyStreak}</span>
              <span className="text-sm text-muted-foreground">days</span>
              <Icon name="Flame" size={16} className="text-warning" />
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                <Icon name="TrendingUp" size={16} className="text-accent" />
              </div>
              <span className="text-sm text-muted-foreground">Improvement</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-lg font-semibold text-success">+{stats?.improvement}%</span>
              <Icon name="ArrowUp" size={14} className="text-success" />
            </div>
          </div>
        </div>
      </div>
      {/* Recent Achievements */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Recent Achievements</h3>
        
        <div className="space-y-3">
          {achievements?.map((achievement) => (
            <div key={achievement?.id} className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                achievement?.type === 'level' ?'bg-primary/10'
                  : achievement?.type === 'score' ?'bg-success/10' :'bg-warning/10'
              }`}>
                <Icon 
                  name={
                    achievement?.type === 'level' ?'Trophy' 
                      : achievement?.type === 'score' ?'Star' :'Zap'
                  } 
                  size={16} 
                  className={
                    achievement?.type === 'level' ?'text-primary'
                      : achievement?.type === 'score' ?'text-success' :'text-warning'
                  }
                />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{achievement?.title}</p>
                <p className="text-xs text-muted-foreground">{achievement?.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Upcoming Deadlines */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Upcoming Deadlines</h3>
        
        <div className="space-y-3">
          {upcomingDeadlines?.map((deadline) => (
            <div key={deadline?.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div>
                <p className="text-sm font-medium text-foreground">{deadline?.examTitle}</p>
                <p className="text-xs text-muted-foreground">{deadline?.date}</p>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                deadline?.urgency === 'high' ?'bg-error/10 text-error'
                  : deadline?.urgency === 'medium' ?'bg-warning/10 text-warning' :'bg-success/10 text-success'
              }`}>
                {deadline?.timeLeft}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PerformanceSummary;