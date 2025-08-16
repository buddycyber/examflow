import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ExamTable = ({ exams, onEdit, onDelete, onViewQuestions, onSchedule, onDuplicate }) => {
  const [sortField, setSortField] = useState('title');
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedExams, setSelectedExams] = useState([]);

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
    if (!dateString) return 'Not scheduled';
    return new Date(dateString)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSelectExam = (examId) => {
    setSelectedExams(prev => 
      prev?.includes(examId)
        ? prev?.filter(id => id !== examId)
        : [...prev, examId]
    );
  };

  const handleSelectAll = () => {
    if (selectedExams?.length === exams?.length) {
      setSelectedExams([]);
    } else {
      setSelectedExams(exams?.map(exam => exam?.id));
    }
  };

  const sortedExams = [...exams]?.sort((a, b) => {
    let aValue = a?.[sortField];
    let bValue = b?.[sortField];
    
    if (sortField === 'scheduledDate') {
      aValue = aValue ? new Date(aValue) : new Date(0);
      bValue = bValue ? new Date(bValue) : new Date(0);
    }
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const SortableHeader = ({ field, children }) => (
    <th 
      className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground transition-colors"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-2">
        {children}
        <div className="flex flex-col">
          <Icon 
            name="ChevronUp" 
            size={12} 
            className={`${sortField === field && sortDirection === 'asc' ? 'text-primary' : 'text-muted-foreground/50'}`}
          />
          <Icon 
            name="ChevronDown" 
            size={12} 
            className={`${sortField === field && sortDirection === 'desc' ? 'text-primary' : 'text-muted-foreground/50'} -mt-1`}
          />
        </div>
      </div>
    </th>
  );

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Table Actions */}
      {selectedExams?.length > 0 && (
        <div className="px-6 py-3 bg-muted border-b border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground">
              {selectedExams?.length} exam{selectedExams?.length > 1 ? 's' : ''} selected
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                iconName="Copy"
                iconPosition="left"
                iconSize={16}
                onClick={() => {
                  selectedExams?.forEach(examId => {
                    const exam = exams?.find(e => e?.id === examId);
                    if (exam && onDuplicate) onDuplicate(exam);
                  });
                  setSelectedExams([]);
                }}
              >
                Duplicate
              </Button>
              <Button
                variant="destructive"
                size="sm"
                iconName="Trash2"
                iconPosition="left"
                iconSize={16}
                onClick={() => {
                  selectedExams?.forEach(examId => {
                    const exam = exams?.find(e => e?.id === examId);
                    if (exam && onDelete) onDelete(exam);
                  });
                  setSelectedExams([]);
                }}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedExams?.length === exams?.length && exams?.length > 0}
                  onChange={handleSelectAll}
                  className="w-4 h-4 text-primary bg-input border-border rounded focus:ring-ring"
                />
              </th>
              <SortableHeader field="title">Exam Title</SortableHeader>
              <SortableHeader field="level">Level</SortableHeader>
              <SortableHeader field="status">Status</SortableHeader>
              <SortableHeader field="scheduledDate">Scheduled Date</SortableHeader>
              <SortableHeader field="duration">Duration</SortableHeader>
              <SortableHeader field="enrolledStudents">Students</SortableHeader>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {sortedExams?.map((exam) => (
              <tr key={exam?.id} className="hover:bg-muted/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedExams?.includes(exam?.id)}
                    onChange={() => handleSelectExam(exam?.id)}
                    className="w-4 h-4 text-primary bg-input border-border rounded focus:ring-ring"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-foreground">{exam?.title}</div>
                    <div className="text-sm text-muted-foreground truncate max-w-xs">
                      {exam?.description}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <Icon name="BarChart3" size={16} className="text-muted-foreground" />
                    <span className="text-sm text-foreground">Level {exam?.level}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(exam?.status)}`}>
                    {exam?.status?.charAt(0)?.toUpperCase() + exam?.status?.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <Icon name="Calendar" size={16} className="text-muted-foreground" />
                    <span className="text-sm text-foreground">{formatDate(exam?.scheduledDate)}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <Icon name="Clock" size={16} className="text-muted-foreground" />
                    <span className="text-sm text-foreground">{exam?.duration} min</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <Icon name="Users" size={16} className="text-muted-foreground" />
                    <span className="text-sm text-foreground">{exam?.enrolledStudents}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(exam)}
                      iconName="Edit"
                      iconSize={14}
                      className="p-2"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewQuestions(exam)}
                      iconName="FileText"
                      iconSize={14}
                      className="p-2"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onSchedule(exam)}
                      iconName="Calendar"
                      iconSize={14}
                      className="p-2"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDuplicate(exam)}
                      iconName="Copy"
                      iconSize={14}
                      className="p-2"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(exam)}
                      iconName="Trash2"
                      iconSize={14}
                      className="p-2 text-error hover:text-error hover:bg-error/10"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {exams?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="FileText" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No exams found</h3>
          <p className="text-muted-foreground">Create your first exam to get started.</p>
        </div>
      )}
    </div>
  );
};

export default ExamTable;