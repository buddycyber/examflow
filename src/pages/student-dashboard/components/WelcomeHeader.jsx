import React from 'react';
import Icon from '../../../components/AppIcon';

const WelcomeHeader = ({ userName, currentLevel, nextExam, studyStreak }) => {
  const getCurrentGreeting = () => {
    const hour = new Date()?.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="bg-gradient-to-r from-primary to-primary/80 rounded-lg p-6 text-white">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="mb-4 lg:mb-0">
          <h1 className="text-2xl lg:text-3xl font-bold mb-2">
            {getCurrentGreeting()}, {userName}!
          </h1>
          <p className="text-primary-foreground/80 text-lg">
            Ready to continue your learning journey?
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Icon name="Trophy" size={20} className="text-yellow-300" />
            </div>
            <p className="text-sm text-primary-foreground/80">Current Level</p>
            <p className="text-xl font-bold">{currentLevel}</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Icon name="Flame" size={20} className="text-orange-300" />
            </div>
            <p className="text-sm text-primary-foreground/80">Study Streak</p>
            <p className="text-xl font-bold">{studyStreak} days</p>
          </div>
          
          {nextExam && (
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Icon name="Clock" size={20} className="text-blue-300" />
              </div>
              <p className="text-sm text-primary-foreground/80">Next Exam</p>
              <p className="text-sm font-medium">{nextExam}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WelcomeHeader;