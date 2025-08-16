import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ResultsHeader = ({ userRole, selectedStudent, onStudentChange, students = [] }) => {
  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg">
            <Icon name="BarChart3" size={24} className="text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Results & Analytics</h1>
            <p className="text-sm text-muted-foreground">
              {userRole === 'admin' ? 'Comprehensive performance analysis and insights' : 'Your performance insights and progress tracking'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {userRole === 'admin' && students?.length > 0 && (
            <div className="flex items-center space-x-2">
              <Icon name="User" size={16} className="text-muted-foreground" />
              <select
                value={selectedStudent}
                onChange={(e) => onStudentChange(e?.target?.value)}
                className="px-3 py-2 bg-input border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="all">All Students</option>
                {students?.map(student => (
                  <option key={student?.id} value={student?.id}>
                    {student?.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          
          <Button variant="outline" iconName="Download" iconPosition="left" iconSize={16}>
            Export Report
          </Button>
          
          <Button variant="outline" iconName="RefreshCw" iconPosition="left" iconSize={16}>
            Refresh
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResultsHeader;