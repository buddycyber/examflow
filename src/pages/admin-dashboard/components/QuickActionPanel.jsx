import React from 'react';
import Button from '../../../components/ui/Button';

const QuickActionPanel = ({ onCreateExam, onAddStudent, onGenerateReport, onViewAnalytics }) => {
  const quickActions = [
    {
      title: 'Create New Exam',
      description: 'Set up a new examination with questions and scheduling',
      icon: 'Plus',
      color: 'default',
      onClick: onCreateExam
    },
    {
      title: 'Add Student',
      description: 'Register a new student account with email provisioning',
      icon: 'UserPlus',
      color: 'default',
      onClick: onAddStudent
    },
    {
      title: 'Generate Report',
      description: 'Create comprehensive performance and analytics reports',
      icon: 'FileText',
      color: 'outline',
      onClick: onGenerateReport
    },
    {
      title: 'View Analytics',
      description: 'Access detailed performance metrics and trends',
      icon: 'BarChart3',
      color: 'outline',
      onClick: onViewAnalytics
    }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {quickActions?.map((action, index) => (
          <div
            key={index}
            className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors duration-150 cursor-pointer group"
            onClick={action?.onClick}
          >
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-primary/10 text-primary rounded-lg group-hover:bg-primary/20 transition-colors duration-150">
                <Button
                  variant="ghost"
                  size="icon"
                  iconName={action?.icon}
                  className="w-6 h-6 p-0 hover:bg-transparent"
                />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-foreground mb-1 group-hover:text-primary transition-colors duration-150">
                  {action?.title}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {action?.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickActionPanel;