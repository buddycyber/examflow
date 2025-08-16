import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const IndividualResults = ({ userRole, selectedStudent, examResults }) => {
  const getScoreColor = (score) => {
    if (score >= 90) return 'text-success';
    if (score >= 70) return 'text-warning';
    return 'text-error';
  };

  const getGradeIcon = (score) => {
    if (score >= 90) return 'Trophy';
    if (score >= 70) return 'Award';
    return 'AlertCircle';
  };

  return (
    <div className="space-y-6">
      {/* Recent Exam Results */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Recent Exam Results</h3>
          <Button variant="outline" size="sm" iconName="Filter" iconPosition="left" iconSize={14}>
            Filter
          </Button>
        </div>

        <div className="space-y-4">
          {examResults?.map((result) => (
            <div key={result?.id} className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-start space-x-4">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${
                    result?.score >= 90 ? 'bg-success/10' : 
                    result?.score >= 70 ? 'bg-warning/10' : 'bg-error/10'
                  }`}>
                    <Icon 
                      name={getGradeIcon(result?.score)} 
                      size={20} 
                      className={getScoreColor(result?.score)} 
                    />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-foreground">{result?.examTitle}</h4>
                      <span className="px-2 py-1 bg-muted rounded text-xs text-muted-foreground">
                        Level {result?.level}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{result?.subject}</p>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <span>Attempted: {result?.attemptDate}</span>
                      <span>Duration: {result?.timeTaken}</span>
                      <span>Questions: {result?.totalQuestions}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${getScoreColor(result?.score)}`}>
                      {result?.score}%
                    </div>
                    <div className="text-xs text-muted-foreground">Score</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-lg font-semibold text-foreground">
                      {result?.correctAnswers}/{result?.totalQuestions}
                    </div>
                    <div className="text-xs text-muted-foreground">Correct</div>
                  </div>

                  <Button variant="outline" size="sm" iconName="Eye" iconPosition="left" iconSize={14}>
                    View Details
                  </Button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Progress</span>
                  <span>{result?.score}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      result?.score >= 90 ? 'bg-success' : 
                      result?.score >= 70 ? 'bg-warning' : 'bg-error'
                    }`}
                    style={{ width: `${result?.score}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Question Analysis */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Question-by-Question Analysis</h3>
        
        <div className="space-y-3">
          {examResults?.[0]?.questions?.map((question, index) => (
            <div key={index} className="border border-border rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    question?.isCorrect ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
                  }`}>
                    <Icon name={question?.isCorrect ? "Check" : "X"} size={16} />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-foreground">Question {index + 1}</span>
                    <div className="text-xs text-muted-foreground">Time spent: {question?.timeSpent}</div>
                  </div>
                </div>
                
                <Button variant="ghost" size="sm" iconName="HelpCircle" iconPosition="left" iconSize={14}>
                  Explanation
                </Button>
              </div>
              
              <p className="text-sm text-muted-foreground mb-2">{question?.text}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-muted-foreground">Your answer: </span>
                  <span className={question?.isCorrect ? 'text-success' : 'text-error'}>
                    {question?.userAnswer}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Correct answer: </span>
                  <span className="text-success">{question?.correctAnswer}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IndividualResults;