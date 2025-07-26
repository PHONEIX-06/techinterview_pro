import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const SchedulingForm = ({ onSchedule, onSaveDraft, onStartNow }) => {
  const [formData, setFormData] = useState({
    title: '',
    position: '',
    duration: '60',
    interviewType: 'technical',
    candidateEmail: '',
    candidateName: '',
    programmingLanguage: 'javascript',
    challengeTemplate: 'basic-algorithms',
    specialInstructions: '',
    recordingEnabled: true,
    reminderTiming: '24',
    customRoomSettings: false
  });

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [errors, setErrors] = useState({});

  const durationOptions = [
    { value: '30', label: '30 minutes' },
    { value: '45', label: '45 minutes' },
    { value: '60', label: '1 hour' },
    { value: '90', label: '1.5 hours' },
    { value: '120', label: '2 hours' }
  ];

  const interviewTypeOptions = [
    { value: 'technical', label: 'Technical Coding' },
    { value: 'system-design', label: 'System Design' },
    { value: 'behavioral', label: 'Behavioral' },
    { value: 'mixed', label: 'Mixed Interview' }
  ];

  const languageOptions = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
    { value: 'csharp', label: 'C#' },
    { value: 'go', label: 'Go' },
    { value: 'rust', label: 'Rust' },
    { value: 'typescript', label: 'TypeScript' }
  ];

  const challengeTemplateOptions = [
    { value: 'basic-algorithms', label: 'Basic Algorithms' },
    { value: 'data-structures', label: 'Data Structures' },
    { value: 'system-design', label: 'System Design' },
    { value: 'frontend-specific', label: 'Frontend Specific' },
    { value: 'backend-specific', label: 'Backend Specific' },
    { value: 'custom', label: 'Custom Challenge' }
  ];

  const reminderOptions = [
    { value: '1', label: '1 hour before' },
    { value: '24', label: '24 hours before' },
    { value: '48', label: '48 hours before' },
    { value: '168', label: '1 week before' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Interview title is required';
    if (!formData.position.trim()) newErrors.position = 'Position is required';
    if (!formData.candidateEmail.trim()) newErrors.candidateEmail = 'Candidate email is required';
    if (!formData.candidateName.trim()) newErrors.candidateName = 'Candidate name is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (action) => {
    if (action !== 'draft' && !validateForm()) return;
    
    const submissionData = { ...formData, action };
    
    switch (action) {
      case 'schedule':
        onSchedule(submissionData);
        break;
      case 'draft':
        onSaveDraft(submissionData);
        break;
      case 'start-now':
        onStartNow(submissionData);
        break;
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 bg-primary bg-opacity-10 rounded-lg">
          <Icon name="Calendar" size={20} className="text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-text-primary">Schedule Interview</h2>
          <p className="text-sm text-text-secondary">Create a new technical interview session</p>
        </div>
      </div>

      <form className="space-y-6">
        {/* Interview Details Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-text-primary border-b border-border pb-2">
            Interview Details
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Interview Title"
              type="text"
              placeholder="e.g., Senior Frontend Developer Interview"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              error={errors.title}
              required
            />
            
            <Input
              label="Position"
              type="text"
              placeholder="e.g., Senior Frontend Developer"
              value={formData.position}
              onChange={(e) => handleInputChange('position', e.target.value)}
              error={errors.position}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Duration"
              options={durationOptions}
              value={formData.duration}
              onChange={(value) => handleInputChange('duration', value)}
            />
            
            <Select
              label="Interview Type"
              options={interviewTypeOptions}
              value={formData.interviewType}
              onChange={(value) => handleInputChange('interviewType', value)}
            />
          </div>
        </div>

        {/* Candidate Information Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-text-primary border-b border-border pb-2">
            Candidate Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Candidate Email"
              type="email"
              placeholder="candidate@example.com"
              value={formData.candidateEmail}
              onChange={(e) => handleInputChange('candidateEmail', e.target.value)}
              error={errors.candidateEmail}
              required
            />
            
            <Input
              label="Candidate Name"
              type="text"
              placeholder="John Doe"
              value={formData.candidateName}
              onChange={(e) => handleInputChange('candidateName', e.target.value)}
              error={errors.candidateName}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-primary">
              Resume Upload
            </label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors duration-200">
              <Icon name="Upload" size={24} className="text-text-secondary mx-auto mb-2" />
              <p className="text-sm text-text-secondary mb-2">
                Drag and drop resume here, or click to browse
              </p>
              <Button variant="outline" size="sm">
                Choose File
              </Button>
            </div>
          </div>
        </div>

        {/* Interview Configuration Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-text-primary border-b border-border pb-2">
            Interview Configuration
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Programming Language"
              options={languageOptions}
              value={formData.programmingLanguage}
              onChange={(value) => handleInputChange('programmingLanguage', value)}
            />
            
            <Select
              label="Challenge Template"
              options={challengeTemplateOptions}
              value={formData.challengeTemplate}
              onChange={(value) => handleInputChange('challengeTemplate', value)}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-primary">
              Special Instructions
            </label>
            <textarea
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              rows="3"
              placeholder="Any specific instructions for the candidate or interview focus areas..."
              value={formData.specialInstructions}
              onChange={(e) => handleInputChange('specialInstructions', e.target.value)}
            />
          </div>
        </div>

        {/* Advanced Options */}
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center space-x-2 text-primary hover:text-primary-foreground hover:bg-primary hover:bg-opacity-10 px-3 py-2 rounded-lg transition-all duration-200"
          >
            <Icon name={showAdvanced ? "ChevronUp" : "ChevronDown"} size={16} />
            <span className="text-sm font-medium">Advanced Options</span>
          </button>

          {showAdvanced && (
            <div className="bg-muted rounded-lg p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="recording"
                    checked={formData.recordingEnabled}
                    onChange={(e) => handleInputChange('recordingEnabled', e.target.checked)}
                    className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                  />
                  <label htmlFor="recording" className="text-sm text-text-primary">
                    Enable session recording
                  </label>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="customRoom"
                    checked={formData.customRoomSettings}
                    onChange={(e) => handleInputChange('customRoomSettings', e.target.checked)}
                    className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                  />
                  <label htmlFor="customRoom" className="text-sm text-text-primary">
                    Custom room settings
                  </label>
                </div>
              </div>

              <Select
                label="Reminder Timing"
                options={reminderOptions}
                value={formData.reminderTiming}
                onChange={(value) => handleInputChange('reminderTiming', value)}
              />
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-border">
          <Button
            variant="default"
            onClick={() => handleSubmit('schedule')}
            iconName="Send"
            iconPosition="left"
            className="flex-1"
          >
            Send Invitation
          </Button>
          
          <Button
            variant="outline"
            onClick={() => handleSubmit('draft')}
            iconName="Save"
            iconPosition="left"
            className="flex-1"
          >
            Save as Draft
          </Button>
          
          <Button
            variant="success"
            onClick={() => handleSubmit('start-now')}
            iconName="Play"
            iconPosition="left"
            className="flex-1"
          >
            Schedule & Start Now
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SchedulingForm;