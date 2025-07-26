import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const InterviewPreferencesTab = () => {
  const [preferences, setPreferences] = useState({
    defaultLanguage: "javascript",
    preferredDuration: "60",
    videoQuality: "hd",
    audioQuality: "high",
    notifications: {
      email: true,
      browser: true,
      sms: false,
      reminder24h: true,
      reminder1h: true,
      reminder15m: false
    }
  });

  const [availabilitySlots, setAvailabilitySlots] = useState([
    { day: "monday", enabled: true, startTime: "09:00", endTime: "17:00" },
    { day: "tuesday", enabled: true, startTime: "09:00", endTime: "17:00" },
    { day: "wednesday", enabled: true, startTime: "09:00", endTime: "17:00" },
    { day: "thursday", enabled: true, startTime: "09:00", endTime: "17:00" },
    { day: "friday", enabled: true, startTime: "09:00", endTime: "17:00" },
    { day: "saturday", enabled: false, startTime: "10:00", endTime: "16:00" },
    { day: "sunday", enabled: false, startTime: "10:00", endTime: "16:00" }
  ]);

  const languageOptions = [
    { value: "javascript", label: "JavaScript" },
    { value: "typescript", label: "TypeScript" },
    { value: "python", label: "Python" },
    { value: "java", label: "Java" },
    { value: "cpp", label: "C++" },
    { value: "csharp", label: "C#" },
    { value: "go", label: "Go" },
    { value: "rust", label: "Rust" },
    { value: "php", label: "PHP" },
    { value: "ruby", label: "Ruby" },
    { value: "swift", label: "Swift" },
    { value: "kotlin", label: "Kotlin" }
  ];

  const durationOptions = [
    { value: "30", label: "30 minutes" },
    { value: "45", label: "45 minutes" },
    { value: "60", label: "1 hour" },
    { value: "90", label: "1.5 hours" },
    { value: "120", label: "2 hours" }
  ];

  const videoQualityOptions = [
    { value: "sd", label: "Standard Definition (480p)" },
    { value: "hd", label: "High Definition (720p)" },
    { value: "fhd", label: "Full HD (1080p)" },
    { value: "auto", label: "Auto (Adaptive)" }
  ];

  const audioQualityOptions = [
    { value: "low", label: "Low (32 kbps)" },
    { value: "medium", label: "Medium (64 kbps)" },
    { value: "high", label: "High (128 kbps)" },
    { value: "highest", label: "Highest (256 kbps)" }
  ];

  const dayLabels = {
    monday: "Monday",
    tuesday: "Tuesday",
    wednesday: "Wednesday",
    thursday: "Thursday",
    friday: "Friday",
    saturday: "Saturday",
    sunday: "Sunday"
  };

  const handlePreferenceChange = (field, value) => {
    setPreferences(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNotificationChange = (field, checked) => {
    setPreferences(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [field]: checked
      }
    }));
  };

  const handleAvailabilityChange = (index, field, value) => {
    setAvailabilitySlots(prev => 
      prev.map((slot, i) => 
        i === index ? { ...slot, [field]: value } : slot
      )
    );
  };

  const handleSave = () => {
    console.log('Saving interview preferences:', { preferences, availabilitySlots });
    // Show success message
  };

  const handleReset = () => {
    setPreferences({
      defaultLanguage: "javascript",
      preferredDuration: "60",
      videoQuality: "hd",
      audioQuality: "high",
      notifications: {
        email: true,
        browser: true,
        sms: false,
        reminder24h: true,
        reminder1h: true,
        reminder15m: false
      }
    });
    
    setAvailabilitySlots([
      { day: "monday", enabled: true, startTime: "09:00", endTime: "17:00" },
      { day: "tuesday", enabled: true, startTime: "09:00", endTime: "17:00" },
      { day: "wednesday", enabled: true, startTime: "09:00", endTime: "17:00" },
      { day: "thursday", enabled: true, startTime: "09:00", endTime: "17:00" },
      { day: "friday", enabled: true, startTime: "09:00", endTime: "17:00" },
      { day: "saturday", enabled: false, startTime: "10:00", endTime: "16:00" },
      { day: "sunday", enabled: false, startTime: "10:00", endTime: "16:00" }
    ]);
  };

  return (
    <div className="space-y-8">
      {/* Default Settings */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
          <Icon name="Settings" size={20} className="mr-2" />
          Default Interview Settings
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="Default Programming Language"
            options={languageOptions}
            value={preferences.defaultLanguage}
            onChange={(value) => handlePreferenceChange('defaultLanguage', value)}
            description="Your preferred language for coding challenges"
            searchable
          />
          
          <Select
            label="Preferred Interview Duration"
            options={durationOptions}
            value={preferences.preferredDuration}
            onChange={(value) => handlePreferenceChange('preferredDuration', value)}
            description="Default duration for interview sessions"
          />
        </div>
      </div>

      {/* Availability Calendar */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
          <Icon name="Calendar" size={20} className="mr-2" />
          Weekly Availability
        </h3>
        
        <div className="space-y-4">
          {availabilitySlots.map((slot, index) => (
            <div key={slot.day} className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 p-4 bg-muted rounded-lg">
              <div className="flex items-center space-x-3 sm:w-32">
                <Checkbox
                  checked={slot.enabled}
                  onChange={(e) => handleAvailabilityChange(index, 'enabled', e.target.checked)}
                />
                <span className="text-sm font-medium text-text-primary">
                  {dayLabels[slot.day]}
                </span>
              </div>
              
              {slot.enabled && (
                <div className="flex items-center space-x-3 flex-1">
                  <div className="flex items-center space-x-2">
                    <label className="text-sm text-text-secondary">From:</label>
                    <input
                      type="time"
                      value={slot.startTime}
                      onChange={(e) => handleAvailabilityChange(index, 'startTime', e.target.value)}
                      className="px-2 py-1 border border-border rounded text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <label className="text-sm text-text-secondary">To:</label>
                    <input
                      type="time"
                      value={slot.endTime}
                      onChange={(e) => handleAvailabilityChange(index, 'endTime', e.target.value)}
                      className="px-2 py-1 border border-border rounded text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <p className="text-xs text-text-secondary mt-4">
          Times are shown in your selected timezone. Interviewers will see available slots converted to their timezone.
        </p>
      </div>

      {/* Notification Preferences */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
          <Icon name="Bell" size={20} className="mr-2" />
          Notification Preferences
        </h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Checkbox
              label="Email Notifications"
              description="Receive interview updates via email"
              checked={preferences.notifications.email}
              onChange={(e) => handleNotificationChange('email', e.target.checked)}
            />
            
            <Checkbox
              label="Browser Notifications"
              description="Show desktop notifications"
              checked={preferences.notifications.browser}
              onChange={(e) => handleNotificationChange('browser', e.target.checked)}
            />
            
            <Checkbox
              label="SMS Notifications"
              description="Receive text messages for urgent updates"
              checked={preferences.notifications.sms}
              onChange={(e) => handleNotificationChange('sms', e.target.checked)}
            />
          </div>
          
          <div className="border-t border-border pt-4">
            <h4 className="text-sm font-medium text-text-primary mb-3">Interview Reminders</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Checkbox
                label="24 hours before"
                checked={preferences.notifications.reminder24h}
                onChange={(e) => handleNotificationChange('reminder24h', e.target.checked)}
              />
              
              <Checkbox
                label="1 hour before"
                checked={preferences.notifications.reminder1h}
                onChange={(e) => handleNotificationChange('reminder1h', e.target.checked)}
              />
              
              <Checkbox
                label="15 minutes before"
                checked={preferences.notifications.reminder15m}
                onChange={(e) => handleNotificationChange('reminder15m', e.target.checked)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Video & Audio Quality */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
          <Icon name="Video" size={20} className="mr-2" />
          Video & Audio Quality
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="Video Quality"
            options={videoQualityOptions}
            value={preferences.videoQuality}
            onChange={(value) => handlePreferenceChange('videoQuality', value)}
            description="Higher quality uses more bandwidth"
          />
          
          <Select
            label="Audio Quality"
            options={audioQualityOptions}
            value={preferences.audioQuality}
            onChange={(value) => handlePreferenceChange('audioQuality', value)}
            description="Higher quality provides better sound clarity"
          />
        </div>
        
        <div className="mt-4 p-4 bg-warning bg-opacity-10 border border-warning rounded-lg">
          <div className="flex items-start space-x-2">
            <Icon name="Info" size={16} className="text-warning mt-0.5" />
            <div>
              <p className="text-sm text-warning font-medium">Bandwidth Consideration</p>
              <p className="text-xs text-warning mt-1">
                Higher quality settings require more bandwidth. If you experience connection issues, try lowering these settings.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-border">
        <Button
          variant="outline"
          onClick={handleReset}
          iconName="RotateCcw"
          iconPosition="left"
        >
          Reset to Defaults
        </Button>
        
        <Button
          variant="default"
          onClick={handleSave}
          iconName="Save"
          iconPosition="left"
        >
          Save Preferences
        </Button>
      </div>
    </div>
  );
};

export default InterviewPreferencesTab;