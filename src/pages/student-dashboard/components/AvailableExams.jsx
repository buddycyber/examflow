import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AvailableExams = ({ exams, onStartExam }) => {
  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-foreground">Available Exams</h2>
        <div className="text-sm text-muted-foreground">
          {exams?.filter(exam => exam?.isAvailable)?.length} available
        </div>
      </div>
      <div className="space-y-4">
        {exams?.map((exam) => (
          <div key={exam?.id} className={`border rounded-lg p-4 transition-all duration-200 ${
            exam?.isAvailable 
              ? 'border-border bg-background hover:border-primary/50' :'border-border bg-muted/30'
          }`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className={`font-medium ${
                    exam?.isAvailable ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {exam?.title}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    exam?.level === 'Beginner' ?'bg-success/10 text-success'
                      : exam?.level === 'Intermediate' ?'bg-warning/10 text-warning' :'bg-error/10 text-error'
                  }`}>
                    {exam?.level}
                  </span>
                  {!exam?.isAvailable && (
                    <Icon name="Lock" size={16} className="text-muted-foreground" />
                  )}
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                  <div className="flex items-center space-x-1">
                    <Icon name="Clock" size={14} />
                    <span>{exam?.duration} mins</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icon name="FileText" size={14} />
                    <span>{exam?.questionCount} questions</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icon name="RotateCcw" size={14} />
                    <span>{exam?.attempts} attempts</span>
                  </div>
                </div>
                
                {exam?.description && (
                  <p className="text-sm text-muted-foreground mb-3">
                    {exam?.description}
                  </p>
                )}
                
                {exam?.lastAttempt && (
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="text-muted-foreground">Last attempt:</span>
                    <span className={`font-medium ${
                      exam?.lastAttempt?.passed ? 'text-success' : 'text-error'
                    }`}>
                      {exam?.lastAttempt?.score}%
                    </span>
                    <span className="text-muted-foreground">
                      on {exam?.lastAttempt?.date}
                    </span>
                  </div>
                )}
                
                {!exam?.isAvailable && exam?.prerequisite && (
                  <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <Icon name="Info" size={14} className="inline mr-1" />
                      {exam?.prerequisite}
                    </p>
                  </div>
                )}
              </div>
              
              <div className="ml-4">
                <Button
                  variant={exam?.isAvailable ? "default" : "ghost"}
                  disabled={!exam?.isAvailable}
                  onClick={() => onStartExam(exam)}
                  iconName={exam?.isAvailable ? "Play" : "Lock"}
                  iconPosition="left"
                  iconSize={16}
                >
                  {exam?.isAvailable ? 'Start Exam' : 'Locked'}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AvailableExams;