import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const ScheduleModal = ({ isOpen, onClose, exam, onSave }) => {
  const [scheduleData, setScheduleData] = useState({
    scheduledDate: exam?.scheduledDate?.split('T')?.[0] || '',
    scheduledTime: exam?.scheduledDate?.split('T')?.[1]?.substring(0, 5) || '',
    timezone: 'America/New_York',
    duration: exam?.duration || '60',
    maxAttempts: exam?.maxAttempts || '1',
    attemptDelay: '0',
    classLink: exam?.classLink || '',
    classLinkType: exam?.classLinkType || 'zoom',
    linkActivation: 'scheduled',
    linkActivationTime: '15',
    allowLateSubmission: exam?.allowLateSubmission || false,
    lateSubmissionDeadline: '',
    lateSubmissionPenalty: exam?.lateSubmissionPenalty || '10',
    autoGrade: true,
    releaseResults: 'immediate',
    resultReleaseDate: '',
    notifications: {
      email: true,
      sms: false,
      reminder24h: true,
      reminder1h: true
    }
  });

  const timezoneOptions = [
    { value: 'America/New_York', label: 'Eastern Time (ET)' },
    { value: 'America/Chicago', label: 'Central Time (CT)' },
    { value: 'America/Denver', label: 'Mountain Time (MT)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
    { value: 'UTC', label: 'UTC' }
  ];

  const classLinkTypeOptions = [
    { value: 'zoom', label: 'Zoom Meeting' },
    { value: 'meet', label: 'Google Meet' },
    { value: 'youtube', label: 'YouTube Live' },
    { value: 'teams', label: 'Microsoft Teams' },
    { value: 'other', label: 'Other Platform' }
  ];

  const linkActivationOptions = [
    { value: 'scheduled', label: 'At Scheduled Time' },
    { value: 'early', label: 'Minutes Before' },
    { value: 'manual', label: 'Manual Activation' }
  ];

  const resultReleaseOptions = [
    { value: 'immediate', label: 'Immediately After Submission' },
    { value: 'scheduled', label: 'At Specific Date/Time' },
    { value: 'manual', label: 'Manual Release' }
  ];

  const handleInputChange = (field, value) => {
    if (field?.includes('.')) {
      const [parent, child] = field?.split('.');
      setScheduleData(prev => ({
        ...prev,
        [parent]: {
          ...prev?.[parent],
          [child]: value
        }
      }));
    } else {
      setScheduleData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSave = () => {
    const updatedExam = {
      ...exam,
      ...scheduleData,
      scheduledDate: scheduleData?.scheduledDate && scheduleData?.scheduledTime 
        ? `${scheduleData?.scheduledDate}T${scheduleData?.scheduledTime}` 
        : null,
      status: scheduleData?.scheduledDate ? 'scheduled' : 'draft'
    };
    onSave(updatedExam);
    onClose();
  };

  const formatDateTime = () => {
    if (scheduleData?.scheduledDate && scheduleData?.scheduledTime) {
      const date = new Date(`${scheduleData.scheduledDate}T${scheduleData.scheduledTime}`);
      return date?.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    return 'Not scheduled';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-lg shadow-strong w-full max-w-3xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Schedule Exam</h2>
            <p className="text-sm text-muted-foreground">{exam?.title}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            iconName="X"
            iconSize={20}
          />
        </div>
        
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
          {/* Date & Time Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Date & Time</h3>
            
            <div className="grid grid-cols-3 gap-4">
              <Input
                label="Exam Date"
                type="date"
                value={scheduleData?.scheduledDate}
                onChange={(e) => handleInputChange('scheduledDate', e?.target?.value)}
                required
              />
              
              <Input
                label="Start Time"
                type="time"
                value={scheduleData?.scheduledTime}
                onChange={(e) => handleInputChange('scheduledTime', e?.target?.value)}
                required
              />
              
              <Select
                label="Timezone"
                options={timezoneOptions}
                value={scheduleData?.timezone}
                onChange={(value) => handleInputChange('timezone', value)}
              />
            </div>
            
            <div className="p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Icon name="Calendar" size={16} className="text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">Scheduled For:</span>
              </div>
              <p className="text-sm text-muted-foreground">{formatDateTime()}</p>
            </div>
          </div>
          
          {/* Exam Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Exam Settings</h3>
            
            <div className="grid grid-cols-3 gap-4">
              <Input
                label="Duration (minutes)"
                type="number"
                value={scheduleData?.duration}
                onChange={(e) => handleInputChange('duration', e?.target?.value)}
                required
              />
              
              <Input
                label="Max Attempts"
                type="number"
                value={scheduleData?.maxAttempts}
                onChange={(e) => handleInputChange('maxAttempts', e?.target?.value)}
                required
              />
              
              <Input
                label="Delay Between Attempts (hours)"
                type="number"
                value={scheduleData?.attemptDelay}
                onChange={(e) => handleInputChange('attemptDelay', e?.target?.value)}
              />
            </div>
          </div>
          
          {/* Class Link Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Class Link Settings</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Platform Type"
                options={classLinkTypeOptions}
                value={scheduleData?.classLinkType}
                onChange={(value) => handleInputChange('classLinkType', value)}
              />
              
              <Select
                label="Link Activation"
                options={linkActivationOptions}
                value={scheduleData?.linkActivation}
                onChange={(value) => handleInputChange('linkActivation', value)}
              />
            </div>
            
            <Input
              label="Class Link URL"
              type="url"
              placeholder="https://zoom.us/j/123456789"
              value={scheduleData?.classLink}
              onChange={(e) => handleInputChange('classLink', e?.target?.value)}
            />
            
            {scheduleData?.linkActivation === 'early' && (
              <Input
                label="Activate Link (minutes before exam)"
                type="number"
                value={scheduleData?.linkActivationTime}
                onChange={(e) => handleInputChange('linkActivationTime', e?.target?.value)}
              />
            )}
          </div>
          
          {/* Late Submission */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Late Submission</h3>
              <input
                type="checkbox"
                checked={scheduleData?.allowLateSubmission}
                onChange={(e) => handleInputChange('allowLateSubmission', e?.target?.checked)}
                className="w-4 h-4 text-primary bg-input border-border rounded focus:ring-ring"
              />
            </div>
            
            {scheduleData?.allowLateSubmission && (
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Late Submission Deadline"
                  type="datetime-local"
                  value={scheduleData?.lateSubmissionDeadline}
                  onChange={(e) => handleInputChange('lateSubmissionDeadline', e?.target?.value)}
                />
                
                <Input
                  label="Late Penalty (%)"
                  type="number"
                  value={scheduleData?.lateSubmissionPenalty}
                  onChange={(e) => handleInputChange('lateSubmissionPenalty', e?.target?.value)}
                />
              </div>
            )}
          </div>
          
          {/* Result Release */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Result Release</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Release Results"
                options={resultReleaseOptions}
                value={scheduleData?.releaseResults}
                onChange={(value) => handleInputChange('releaseResults', value)}
              />
              
              {scheduleData?.releaseResults === 'scheduled' && (
                <Input
                  label="Release Date & Time"
                  type="datetime-local"
                  value={scheduleData?.resultReleaseDate}
                  onChange={(e) => handleInputChange('resultReleaseDate', e?.target?.value)}
                />
              )}
            </div>
          </div>
          
          {/* Notifications */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Notifications</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div>
                  <label className="text-sm font-medium text-foreground">Email Notifications</label>
                  <p className="text-xs text-muted-foreground">Send exam reminders via email</p>
                </div>
                <input
                  type="checkbox"
                  checked={scheduleData?.notifications?.email}
                  onChange={(e) => handleInputChange('notifications.email', e?.target?.checked)}
                  className="w-4 h-4 text-primary bg-input border-border rounded focus:ring-ring"
                />
              </div>
              
              <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div>
                  <label className="text-sm font-medium text-foreground">24-Hour Reminder</label>
                  <p className="text-xs text-muted-foreground">Remind students 24 hours before</p>
                </div>
                <input
                  type="checkbox"
                  checked={scheduleData?.notifications?.reminder24h}
                  onChange={(e) => handleInputChange('notifications.reminder24h', e?.target?.checked)}
                  className="w-4 h-4 text-primary bg-input border-border rounded focus:ring-ring"
                />
              </div>
              
              <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div>
                  <label className="text-sm font-medium text-foreground">1-Hour Reminder</label>
                  <p className="text-xs text-muted-foreground">Remind students 1 hour before</p>
                </div>
                <input
                  type="checkbox"
                  checked={scheduleData?.notifications?.reminder1h}
                  onChange={(e) => handleInputChange('notifications.reminder1h', e?.target?.checked)}
                  className="w-4 h-4 text-primary bg-input border-border rounded focus:ring-ring"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-end p-6 border-t border-border gap-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={handleSave}
            iconName="Calendar"
            iconPosition="left"
            iconSize={16}
          >
            Save Schedule
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleModal;