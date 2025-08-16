import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecentResults = ({ results, onReviewAnswers }) => {
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-error';
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return 'bg-success/10';
    if (score >= 60) return 'bg-warning/10';
    return 'bg-error/10';
  };

  const getGradeIcon = (score) => {
    if (score >= 80) return 'Trophy';
    if (score >= 60) return 'Award';
    return 'AlertCircle';
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-foreground">Recent Results</h2>
        <Button
          variant="ghost"
          iconName="BarChart3"
          iconPosition="left"
          iconSize={16}
          className="text-sm"
        >
          View All
        </Button>
      </div>
      <div className="space-y-4">
        {results?.map((result) => (
          <div key={result?.id} className="border rounded-lg p-4 hover:border-primary/50 transition-all duration-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    getScoreBgColor(result?.score)
                  }`}>
                    <Icon 
                      name={getGradeIcon(result?.score)} 
                      size={20} 
                      className={getScoreColor(result?.score)}
                    />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">{result?.examTitle}</h3>
                    <p className="text-sm text-muted-foreground">{result?.subject}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Score</p>
                    <p className={`text-lg font-semibold ${getScoreColor(result?.score)}`}>
                      {result?.score}%
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Grade</p>
                    <p className={`text-sm font-medium ${getScoreColor(result?.score)}`}>
                      {result?.grade}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Time Taken</p>
                    <p className="text-sm font-medium text-foreground">
                      {result?.timeTaken}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Completed</p>
                    <p className="text-sm font-medium text-foreground">
                      {result?.completedDate}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Icon name="CheckCircle" size={14} className="text-success" />
                      <span>{result?.correctAnswers} correct</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Icon name="XCircle" size={14} className="text-error" />
                      <span>{result?.incorrectAnswers} incorrect</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Icon name="HelpCircle" size={14} className="text-warning" />
                      <span>{result?.skippedAnswers} skipped</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {result?.passed && (
                      <div className="flex items-center space-x-1 text-success">
                        <Icon name="CheckCircle" size={14} />
                        <span className="text-xs font-medium">Passed</span>
                      </div>
                    )}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onReviewAnswers(result)}
                      iconName="Eye"
                      iconPosition="left"
                      iconSize={14}
                    >
                      Review
                    </Button>
                  </div>
                </div>
                
                {result?.feedback && (
                  <div className="mt-3 p-3 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <Icon name="MessageSquare" size={14} className="inline mr-1" />
                      {result?.feedback}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {results?.length === 0 && (
          <div className="text-center py-8">
            <Icon name="FileText" size={48} className="text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No recent results available</p>
            <p className="text-sm text-muted-foreground mt-1">
              Complete an exam to see your results here
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentResults;