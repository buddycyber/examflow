import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const QuestionDisplay = ({ 
  question, 
  questionIndex, 
  totalQuestions, 
  answer, 
  onAnswerChange,
  onFlagToggle,
  autoSaveStatus 
}) => {
  const handleSingleChoice = (optionId) => {
    onAnswerChange(optionId);
  };

  const handleMultipleChoice = (optionId) => {
    const currentAnswers = Array.isArray(answer) ? answer : [];
    const newAnswers = currentAnswers?.includes(optionId)
      ? currentAnswers?.filter(id => id !== optionId)
      : [...currentAnswers, optionId];
    onAnswerChange(newAnswers);
  };

  const handleTextAnswer = (value) => {
    onAnswerChange(value);
  };

  const renderQuestionContent = () => {
    switch (question?.type) {
      case 'single-choice':
        return (
          <div className="space-y-3">
            {question?.options?.map((option) => (
              <label
                key={option?.id}
                className="flex items-start space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors"
              >
                <input
                  type="radio"
                  name={`question-${question?.id}`}
                  value={option?.id}
                  checked={answer === option?.id}
                  onChange={() => handleSingleChoice(option?.id)}
                  className="mt-1 w-4 h-4 text-primary border-border focus:ring-primary focus:ring-2"
                />
                <div className="flex-1">
                  <div className="text-sm text-foreground">{option?.text}</div>
                  {option?.description && (
                    <div className="text-xs text-muted-foreground mt-1">
                      {option?.description}
                    </div>
                  )}
                </div>
              </label>
            ))}
          </div>
        );

      case 'multiple-choice':
        return (
          <div className="space-y-3">
            {question?.options?.map((option) => (
              <div key={option?.id}>
                <Checkbox
                  label={option?.text}
                  description={option?.description}
                  checked={Array.isArray(answer) && answer?.includes(option?.id)}
                  onChange={(e) => handleMultipleChoice(option?.id)}
                  className="p-3 rounded-lg border border-border hover:bg-muted/50"
                />
              </div>
            ))}
          </div>
        );

      case 'text':
        return (
          <div className="space-y-4">
            <textarea
              value={answer || ''}
              onChange={(e) => handleTextAnswer(e?.target?.value)}
              placeholder="Type your answer here..."
              className="w-full min-h-32 p-4 border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              maxLength={question?.maxLength || 1000}
            />
            {question?.maxLength && (
              <div className="text-xs text-muted-foreground text-right">
                {(answer || '')?.length} / {question?.maxLength} characters
              </div>
            )}
          </div>
        );

      case 'number':
        return (
          <div className="space-y-4">
            <Input
              type="number"
              value={answer || ''}
              onChange={(e) => handleTextAnswer(e?.target?.value)}
              placeholder="Enter your numerical answer"
              min={question?.min}
              max={question?.max}
              className="text-lg"
            />
            {(question?.min !== undefined || question?.max !== undefined) && (
              <div className="text-xs text-muted-foreground">
                {question?.min !== undefined && question?.max !== undefined
                  ? `Range: ${question?.min} - ${question?.max}`
                  : question?.min !== undefined
                  ? `Minimum: ${question?.min}`
                  : `Maximum: ${question?.max}`
                }
              </div>
            )}
          </div>
        );

      default:
        return <div className="text-muted-foreground">Unsupported question type</div>;
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 lg:p-8">
      {/* Question Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              Question {questionIndex + 1} of {totalQuestions}
            </span>
            <div className="flex items-center space-x-2">
              {question?.difficulty && (
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  question?.difficulty === 'easy' ? 'bg-success/10 text-success' :
                  question?.difficulty === 'medium'? 'bg-warning/10 text-warning' : 'bg-error/10 text-error'
                }`}>
                  {question?.difficulty}
                </span>
              )}
              {question?.points && (
                <span className="px-2 py-1 text-xs font-medium bg-muted text-muted-foreground rounded-full">
                  {question?.points} {question?.points === 1 ? 'point' : 'points'}
                </span>
              )}
            </div>
          </div>
          <h2 className="text-lg lg:text-xl font-semibold text-foreground leading-relaxed">
            {question?.text}
          </h2>
          {question?.description && (
            <p className="text-muted-foreground mt-2 leading-relaxed">
              {question?.description}
            </p>
          )}
        </div>
        
        <div className="flex items-center space-x-2 ml-4">
          <Button
            variant={question?.flagged ? "warning" : "ghost"}
            size="sm"
            onClick={() => onFlagToggle(question?.id)}
            iconName="Flag"
            iconPosition="left"
            iconSize={16}
            className="whitespace-nowrap"
          >
            {question?.flagged ? 'Flagged' : 'Flag'}
          </Button>
        </div>
      </div>
      {/* Question Image */}
      {question?.image && (
        <div className="mb-6">
          <div className="relative rounded-lg overflow-hidden border border-border">
            <img
              src={question?.image}
              alt="Question illustration"
              className="w-full h-auto max-h-64 object-contain bg-muted"
              onError={(e) => {
                e.target.src = '/assets/images/no_image.png';
              }}
            />
          </div>
        </div>
      )}
      {/* Answer Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-foreground">Your Answer:</h3>
          <div className="flex items-center space-x-2">
            {autoSaveStatus === 'saving' && (
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                <Icon name="Loader2" size={12} className="animate-spin" />
                <span>Saving...</span>
              </div>
            )}
            {autoSaveStatus === 'saved' && (
              <div className="flex items-center space-x-1 text-xs text-success">
                <Icon name="Check" size={12} />
                <span>Saved</span>
              </div>
            )}
            {autoSaveStatus === 'error' && (
              <div className="flex items-center space-x-1 text-xs text-error">
                <Icon name="AlertCircle" size={12} />
                <span>Save failed</span>
              </div>
            )}
          </div>
        </div>
        
        {renderQuestionContent()}
      </div>
      {/* Question Instructions */}
      {question?.instructions && (
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-start space-x-2">
            <Icon name="Info" size={16} className="text-primary mt-0.5 flex-shrink-0" />
            <div className="text-sm text-muted-foreground">
              {question?.instructions}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionDisplay;