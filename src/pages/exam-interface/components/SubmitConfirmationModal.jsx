import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SubmitConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  examTitle,
  totalQuestions,
  answeredQuestions,
  flaggedQuestions,
  timeRemaining 
}) => {
  if (!isOpen) return null;

  const unansweredCount = totalQuestions - answeredQuestions;
  
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    return `${minutes}m ${secs}s`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg border border-border shadow-lg max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-warning/10 rounded-lg">
              <Icon name="AlertTriangle" size={20} className="text-warning" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Submit Exam</h2>
              <p className="text-sm text-muted-foreground">Confirm your submission</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="w-8 h-8"
          >
            <Icon name="X" size={16} />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Exam Info */}
          <div className="space-y-2">
            <h3 className="font-medium text-foreground">{examTitle}</h3>
            <p className="text-sm text-muted-foreground">
              You are about to submit your exam. This action cannot be undone.
            </p>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="CheckCircle" size={16} className="text-success" />
                <span className="text-sm font-medium text-foreground">Answered</span>
              </div>
              <div className="text-2xl font-bold text-success">{answeredQuestions}</div>
              <div className="text-xs text-muted-foreground">
                {Math.round((answeredQuestions / totalQuestions) * 100)}% complete
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="AlertCircle" size={16} className="text-warning" />
                <span className="text-sm font-medium text-foreground">Unanswered</span>
              </div>
              <div className="text-2xl font-bold text-warning">{unansweredCount}</div>
              <div className="text-xs text-muted-foreground">
                {Math.round((unansweredCount / totalQuestions) * 100)}% remaining
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="space-y-3">
            {flaggedQuestions > 0 && (
              <div className="flex items-center justify-between p-3 bg-warning/10 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Icon name="Flag" size={16} className="text-warning" />
                  <span className="text-sm text-foreground">Flagged Questions</span>
                </div>
                <span className="text-sm font-medium text-warning">{flaggedQuestions}</span>
              </div>
            )}

            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Icon name="Clock" size={16} className="text-muted-foreground" />
                <span className="text-sm text-foreground">Time Remaining</span>
              </div>
              <span className="text-sm font-medium text-foreground">
                {formatTime(timeRemaining)}
              </span>
            </div>
          </div>

          {/* Warning */}
          {unansweredCount > 0 && (
            <div className="flex items-start space-x-2 p-3 bg-warning/10 rounded-lg">
              <Icon name="AlertTriangle" size={16} className="text-warning mt-0.5" />
              <div className="text-sm">
                <p className="text-warning font-medium">Incomplete Submission</p>
                <p className="text-muted-foreground">
                  You have {unansweredCount} unanswered question{unansweredCount !== 1 ? 's' : ''}. 
                  These will be marked as incorrect.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-border">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Continue Exam
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            iconName="Send"
            iconPosition="left"
            iconSize={16}
          >
            Submit Exam
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SubmitConfirmationModal;