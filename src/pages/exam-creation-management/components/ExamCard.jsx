import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ExamCard = ({ exam, onEdit, onDelete, onViewQuestions, onSchedule }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-success text-success-foreground';
      case 'draft':
        return 'bg-warning text-warning-foreground';
      case 'completed':
        return 'bg-secondary text-secondary-foreground';
      case 'scheduled':
        return 'bg-primary text-primary-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-moderate transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-foreground">{exam?.title}</h3>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(exam?.status)}`}>
              {exam?.status?.charAt(0)?.toUpperCase() + exam?.status?.slice(1)}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mb-3">{exam?.description}</p>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Icon name="Calendar" size={16} className="text-muted-foreground" />
              <span className="text-foreground">
                {exam?.scheduledDate ? formatDate(exam?.scheduledDate) : 'Not scheduled'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Clock" size={16} className="text-muted-foreground" />
              <span className="text-foreground">{exam?.duration} minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Users" size={16} className="text-muted-foreground" />
              <span className="text-foreground">{exam?.enrolledStudents} students</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="BarChart3" size={16} className="text-muted-foreground" />
              <span className="text-foreground">Level {exam?.level}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 ml-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(exam)}
            iconName="Edit"
            iconPosition="left"
            iconSize={16}
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewQuestions(exam)}
            iconName="FileText"
            iconPosition="left"
            iconSize={16}
          >
            Questions
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSchedule(exam)}
            iconName="Calendar"
            iconPosition="left"
            iconSize={16}
          >
            Schedule
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(exam)}
            iconName="Trash2"
            iconPosition="left"
            iconSize={16}
            className="text-error hover:text-error hover:bg-error/10"
          >
            Delete
          </Button>
        </div>
      </div>
      {exam?.classLink && (
        <div className="mt-4 p-3 bg-muted rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Video" size={16} className="text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Class Link</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground truncate">{exam?.classLink}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open(exam?.classLink, '_blank')}
              iconName="ExternalLink"
              iconSize={14}
            >
              Open
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamCard;