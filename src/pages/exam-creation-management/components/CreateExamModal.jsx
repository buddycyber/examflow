import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const CreateExamModal = ({ isOpen, onClose, onSave }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [examData, setExamData] = useState({
    title: '',
    description: '',
    level: '',
    duration: '',
    scheduledDate: '',
    scheduledTime: '',
    maxAttempts: '1',
    passingScore: '70',
    classLink: '',
    classLinkType: 'zoom',
    questionBankId: '',
    totalQuestions: '10',
    randomizeQuestions: true,
    showResults: true,
    allowLateSubmission: false,
    lateSubmissionPenalty: '10'
  });

  const levelOptions = [
    { value: '1', label: 'Level 1 - Beginner' },
    { value: '2', label: 'Level 2 - Intermediate' },
    { value: '3', label: 'Level 3 - Advanced' },
    { value: '4', label: 'Level 4 - Expert' }
  ];

  const classLinkTypeOptions = [
    { value: 'zoom', label: 'Zoom Meeting' },
    { value: 'meet', label: 'Google Meet' },
    { value: 'youtube', label: 'YouTube Live' },
    { value: 'other', label: 'Other Platform' }
  ];

  const questionBankOptions = [
    { value: 'math-basic', label: 'Mathematics - Basic Concepts' },
    { value: 'science-physics', label: 'Science - Physics Fundamentals' },
    { value: 'english-grammar', label: 'English - Grammar & Composition' },
    { value: 'history-world', label: 'History - World History' }
  ];

  const handleInputChange = (field, value) => {
    setExamData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = () => {
    const newExam = {
      id: Date.now()?.toString(),
      ...examData,
      status: 'draft',
      enrolledStudents: 0,
      createdAt: new Date()?.toISOString(),
      scheduledDate: examData?.scheduledDate && examData?.scheduledTime 
        ? `${examData?.scheduledDate}T${examData?.scheduledTime}` 
        : null
    };
    onSave(newExam);
    onClose();
    setCurrentStep(1);
    setExamData({
      title: '',
      description: '',
      level: '',
      duration: '',
      scheduledDate: '',
      scheduledTime: '',
      maxAttempts: '1',
      passingScore: '70',
      classLink: '',
      classLinkType: 'zoom',
      questionBankId: '',
      totalQuestions: '10',
      randomizeQuestions: true,
      showResults: true,
      allowLateSubmission: false,
      lateSubmissionPenalty: '10'
    });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground mb-4">Basic Details</h3>
            <Input
              label="Exam Title"
              type="text"
              placeholder="Enter exam title"
              value={examData?.title}
              onChange={(e) => handleInputChange('title', e?.target?.value)}
              required
            />
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Description</label>
              <textarea
                className="w-full min-h-[100px] px-3 py-2 text-sm border border-border rounded-lg bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                placeholder="Enter exam description"
                value={examData?.description}
                onChange={(e) => handleInputChange('description', e?.target?.value)}
              />
            </div>
            <Select
              label="Exam Level"
              options={levelOptions}
              value={examData?.level}
              onChange={(value) => handleInputChange('level', value)}
              placeholder="Select exam level"
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Duration (minutes)"
                type="number"
                placeholder="60"
                value={examData?.duration}
                onChange={(e) => handleInputChange('duration', e?.target?.value)}
                required
              />
              
              <Input
                label="Total Questions"
                type="number"
                placeholder="10"
                value={examData?.totalQuestions}
                onChange={(e) => handleInputChange('totalQuestions', e?.target?.value)}
                required
              />
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground mb-4">Scheduling & Settings</h3>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Scheduled Date"
                type="date"
                value={examData?.scheduledDate}
                onChange={(e) => handleInputChange('scheduledDate', e?.target?.value)}
              />
              
              <Input
                label="Scheduled Time"
                type="time"
                value={examData?.scheduledTime}
                onChange={(e) => handleInputChange('scheduledTime', e?.target?.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Max Attempts"
                type="number"
                placeholder="1"
                value={examData?.maxAttempts}
                onChange={(e) => handleInputChange('maxAttempts', e?.target?.value)}
                required
              />
              
              <Input
                label="Passing Score (%)"
                type="number"
                placeholder="70"
                value={examData?.passingScore}
                onChange={(e) => handleInputChange('passingScore', e?.target?.value)}
                required
              />
            </div>
            <div className="space-y-4">
              <h4 className="text-md font-medium text-foreground">Class Link (Optional)</h4>
              
              <Select
                label="Platform Type"
                options={classLinkTypeOptions}
                value={examData?.classLinkType}
                onChange={(value) => handleInputChange('classLinkType', value)}
              />
              
              <Input
                label="Class Link URL"
                type="url"
                placeholder="https://zoom.us/j/123456789"
                value={examData?.classLink}
                onChange={(e) => handleInputChange('classLink', e?.target?.value)}
              />
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground mb-4">Question Bank & Advanced Settings</h3>
            <Select
              label="Question Bank"
              options={questionBankOptions}
              value={examData?.questionBankId}
              onChange={(value) => handleInputChange('questionBankId', value)}
              placeholder="Select question bank"
              required
            />
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div>
                  <label className="text-sm font-medium text-foreground">Randomize Questions</label>
                  <p className="text-xs text-muted-foreground">Questions will appear in random order</p>
                </div>
                <input
                  type="checkbox"
                  checked={examData?.randomizeQuestions}
                  onChange={(e) => handleInputChange('randomizeQuestions', e?.target?.checked)}
                  className="w-4 h-4 text-primary bg-input border-border rounded focus:ring-ring"
                />
              </div>
              
              <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div>
                  <label className="text-sm font-medium text-foreground">Show Results Immediately</label>
                  <p className="text-xs text-muted-foreground">Students see results after submission</p>
                </div>
                <input
                  type="checkbox"
                  checked={examData?.showResults}
                  onChange={(e) => handleInputChange('showResults', e?.target?.checked)}
                  className="w-4 h-4 text-primary bg-input border-border rounded focus:ring-ring"
                />
              </div>
              
              <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div>
                  <label className="text-sm font-medium text-foreground">Allow Late Submission</label>
                  <p className="text-xs text-muted-foreground">Students can submit after deadline</p>
                </div>
                <input
                  type="checkbox"
                  checked={examData?.allowLateSubmission}
                  onChange={(e) => handleInputChange('allowLateSubmission', e?.target?.checked)}
                  className="w-4 h-4 text-primary bg-input border-border rounded focus:ring-ring"
                />
              </div>
              
              {examData?.allowLateSubmission && (
                <Input
                  label="Late Submission Penalty (%)"
                  type="number"
                  placeholder="10"
                  value={examData?.lateSubmissionPenalty}
                  onChange={(e) => handleInputChange('lateSubmissionPenalty', e?.target?.value)}
                />
              )}
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-lg shadow-strong w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">Create New Exam</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            iconName="X"
            iconSize={20}
          />
        </div>
        
        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-border">
          <div className="flex items-center justify-between">
            {[1, 2, 3]?.map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step === currentStep 
                    ? 'bg-primary text-primary-foreground' 
                    : step < currentStep 
                      ? 'bg-success text-success-foreground'
                      : 'bg-muted text-muted-foreground'
                }`}>
                  {step < currentStep ? (
                    <Icon name="Check" size={16} />
                  ) : (
                    step
                  )}
                </div>
                {step < 3 && (
                  <div className={`w-16 h-1 mx-2 ${
                    step < currentStep ? 'bg-success' : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>Basic Details</span>
            <span>Scheduling</span>
            <span>Questions</span>
          </div>
        </div>
        
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {renderStepContent()}
        </div>
        
        <div className="flex items-center justify-between p-6 border-t border-border">
          <Button
            variant="ghost"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            iconName="ChevronLeft"
            iconPosition="left"
            iconSize={16}
          >
            Previous
          </Button>
          
          <div className="flex gap-2">
            <Button
              variant="ghost"
              onClick={onClose}
            >
              Cancel
            </Button>
            
            {currentStep === 3 ? (
              <Button
                variant="default"
                onClick={handleSave}
                iconName="Save"
                iconPosition="left"
                iconSize={16}
              >
                Create Exam
              </Button>
            ) : (
              <Button
                variant="default"
                onClick={handleNext}
                iconName="ChevronRight"
                iconPosition="right"
                iconSize={16}
              >
                Next
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateExamModal;