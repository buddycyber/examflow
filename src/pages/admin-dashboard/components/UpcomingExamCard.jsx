import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const UpcomingExamCard = ({ exam, onViewDetails, onEditExam }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    const time = new Date(`2000-01-01T${timeString}`);
    return time?.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getDifficultyColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'easy':
        return 'bg-success/10 text-success border-success/20';
      case 'medium':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'hard':
        return 'bg-error/10 text-error border-error/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 hover:shadow-moderate transition-shadow duration-200">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-semibold text-foreground mb-1">{exam?.title}</h4>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Icon name="Calendar" size={14} />
              <span>{formatDate(exam?.date)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Clock" size={14} />
              <span>{formatTime(exam?.time)}</span>
            </div>
          </div>
        </div>
        <div className={`px-2 py-1 rounded-md text-xs font-medium border ${getDifficultyColor(exam?.level)}`}>
          {exam?.level}
        </div>
      </div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-1 text-muted-foreground">
            <Icon name="Users" size={14} />
            <span>{exam?.enrolledStudents} enrolled</span>
          </div>
          <div className="flex items-center space-x-1 text-muted-foreground">
            <Icon name="FileText" size={14} />
            <span>{exam?.totalQuestions} questions</span>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          {exam?.duration} minutes
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewDetails(exam?.id)}
          iconName="Eye"
          iconPosition="left"
          iconSize={14}
        >
          View
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEditExam(exam?.id)}
          iconName="Edit"
          iconPosition="left"
          iconSize={14}
        >
          Edit
        </Button>
      </div>
    </div>
  );
};

export default UpcomingExamCard;