import React from 'react';

import Button from '../../../components/ui/Button';

const ExamControls = ({ 
  currentQuestionIndex, 
  totalQuestions, 
  onPrevious, 
  onNext, 
  onSubmitExam,
  canGoNext,
  canGoPrevious 
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 z-40">
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        {/* Previous Button */}
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={!canGoPrevious}
          iconName="ChevronLeft"
          iconPosition="left"
          iconSize={16}
          className="min-w-24"
        >
          Previous
        </Button>

        {/* Question Counter */}
        <div className="flex items-center space-x-4">
          <div className="text-sm text-muted-foreground">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </div>
          
          {/* Progress Dots - Hidden on mobile */}
          <div className="hidden md:flex items-center space-x-1">
            {Array.from({ length: Math.min(totalQuestions, 10) }, (_, index) => {
              const questionIndex = Math.floor((index / 10) * totalQuestions);
              const isActive = questionIndex === currentQuestionIndex;
              const isPassed = questionIndex < currentQuestionIndex;
              
              return (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    isActive 
                      ? 'bg-primary' 
                      : isPassed 
                      ? 'bg-success' :'bg-muted'
                  }`}
                />
              );
            })}
            {totalQuestions > 10 && (
              <span className="text-xs text-muted-foreground ml-2">
                +{totalQuestions - 10} more
              </span>
            )}
          </div>
        </div>

        {/* Next/Submit Button */}
        {currentQuestionIndex === totalQuestions - 1 ? (
          <Button
            variant="default"
            onClick={onSubmitExam}
            iconName="Send"
            iconPosition="right"
            iconSize={16}
            className="min-w-24 bg-success hover:bg-success/90"
          >
            Submit
          </Button>
        ) : (
          <Button
            variant="default"
            onClick={onNext}
            disabled={!canGoNext}
            iconName="ChevronRight"
            iconPosition="right"
            iconSize={16}
            className="min-w-24"
          >
            Next
          </Button>
        )}
      </div>
    </div>
  );
};

export default ExamControls;