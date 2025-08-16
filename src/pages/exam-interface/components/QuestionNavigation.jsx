import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuestionNavigation = ({ 
  questions, 
  currentQuestionIndex, 
  onQuestionSelect,
  isCollapsed,
  onToggleCollapse 
}) => {
  const getQuestionStatus = (question) => {
    if (question?.flagged) return 'flagged';
    if (question?.answered) return 'answered';
    return 'unanswered';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'answered':
        return 'bg-success text-success-foreground';
      case 'flagged':
        return 'bg-warning text-warning-foreground';
      default:
        return 'bg-muted text-muted-foreground hover:bg-muted/80';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'answered':
        return 'Check';
      case 'flagged':
        return 'Flag';
      default:
        return null;
    }
  };

  const answeredCount = questions?.filter(q => q?.answered)?.length;
  const flaggedCount = questions?.filter(q => q?.flagged)?.length;

  return (
    <aside className={`fixed right-0 top-16 bottom-0 bg-card border-l border-border transition-all duration-300 z-40 ${
      isCollapsed ? 'w-12' : 'w-64'
    }`}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          {!isCollapsed && (
            <div>
              <h3 className="text-sm font-semibold text-foreground">Questions</h3>
              <div className="text-xs text-muted-foreground">
                {answeredCount} answered • {flaggedCount} flagged
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="w-8 h-8"
          >
            <Icon name={isCollapsed ? "ChevronLeft" : "ChevronRight"} size={16} />
          </Button>
        </div>

        {/* Legend - Only when expanded */}
        {!isCollapsed && (
          <div className="p-4 border-b border-border">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-xs">
                <div className="w-3 h-3 bg-success rounded-full"></div>
                <span className="text-muted-foreground">Answered</span>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <div className="w-3 h-3 bg-warning rounded-full"></div>
                <span className="text-muted-foreground">Flagged</span>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <div className="w-3 h-3 bg-muted rounded-full"></div>
                <span className="text-muted-foreground">Unanswered</span>
              </div>
            </div>
          </div>
        )}

        {/* Question Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className={`grid gap-2 ${isCollapsed ? 'grid-cols-1' : 'grid-cols-4'}`}>
            {questions?.map((question, index) => {
              const status = getQuestionStatus(question);
              const isActive = index === currentQuestionIndex;
              const statusIcon = getStatusIcon(status);

              return (
                <div key={question?.id} className="relative group">
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    onClick={() => onQuestionSelect(index)}
                    className={`w-full h-10 ${
                      isCollapsed ? 'px-2' : 'px-3'
                    } ${!isActive ? getStatusColor(status) : ''} transition-all duration-150`}
                  >
                    <div className="flex items-center justify-center space-x-1">
                      <span className={`text-sm font-medium ${isCollapsed ? 'text-xs' : ''}`}>
                        {index + 1}
                      </span>
                      {!isCollapsed && statusIcon && (
                        <Icon name={statusIcon} size={12} />
                      )}
                    </div>
                  </Button>
                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute right-full top-1/2 -translate-y-1/2 mr-2 px-3 py-2 bg-popover border border-border rounded-lg shadow-moderate opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none z-50 whitespace-nowrap">
                      <div className="text-sm font-medium text-popover-foreground">
                        Question {index + 1}
                      </div>
                      <div className="text-xs text-muted-foreground capitalize">
                        {status}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary - Only when expanded */}
        {!isCollapsed && (
          <div className="p-4 border-t border-border">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <div className="text-lg font-semibold text-success">{answeredCount}</div>
                <div className="text-xs text-muted-foreground">Answered</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-warning">{flaggedCount}</div>
                <div className="text-xs text-muted-foreground">Flagged</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-muted-foreground">
                  {questions?.length - answeredCount}
                </div>
                <div className="text-xs text-muted-foreground">Remaining</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default QuestionNavigation;