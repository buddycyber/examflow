import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ExamHeader = ({ 
  examTitle, 
  timeRemaining, 
  totalQuestions, 
  answeredQuestions,
  onSubmitExam 
}) => {
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes?.toString()?.padStart(2, '0')}:${secs?.toString()?.padStart(2, '0')}`;
    }
    return `${minutes}:${secs?.toString()?.padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    if (timeRemaining <= 300) return 'text-error'; // Last 5 minutes
    if (timeRemaining <= 900) return 'text-warning'; // Last 15 minutes
    return 'text-foreground';
  };

  const progressPercentage = (answeredQuestions / totalQuestions) * 100;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border shadow-sm">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Exam Title */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
            <Icon name="FileText" size={20} color="white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground truncate max-w-xs lg:max-w-md">
              {examTitle}
            </h1>
            <div className="text-xs text-muted-foreground">
              {answeredQuestions} of {totalQuestions} answered
            </div>
          </div>
        </div>

        {/* Progress Bar - Hidden on mobile */}
        <div className="hidden md:flex items-center space-x-4 flex-1 max-w-md mx-8">
          <div className="flex-1 bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            {Math.round(progressPercentage)}%
          </span>
        </div>

        {/* Timer and Submit */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Icon name="Clock" size={16} className={getTimeColor()} />
            <span className={`text-lg font-mono font-semibold ${getTimeColor()}`}>
              {formatTime(timeRemaining)}
            </span>
          </div>
          
          <Button
            variant="destructive"
            size="sm"
            onClick={onSubmitExam}
            iconName="Send"
            iconPosition="left"
            iconSize={16}
            className="hidden sm:flex"
          >
            Submit Exam
          </Button>
          
          <Button
            variant="destructive"
            size="icon"
            onClick={onSubmitExam}
            className="sm:hidden"
          >
            <Icon name="Send" size={16} />
          </Button>
        </div>
      </div>

      {/* Mobile Progress Bar */}
      <div className="md:hidden px-6 pb-3">
        <div className="flex items-center space-x-3">
          <div className="flex-1 bg-muted rounded-full h-1.5">
            <div 
              className="bg-primary h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground">
            {Math.round(progressPercentage)}%
          </span>
        </div>
      </div>
    </header>
  );
};

export default ExamHeader;