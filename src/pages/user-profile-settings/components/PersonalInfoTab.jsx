import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const PersonalInfoTab = () => {
  const [profileData, setProfileData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@company.com",
    phone: "+1 (555) 123-4567",
    timezone: "America/New_York",
    jobTitle: "Senior Frontend Developer",
    company: "TechCorp Inc.",
    experienceLevel: "senior",
    bio: "Passionate frontend developer with 8+ years of experience in React, TypeScript, and modern web technologies. Love mentoring junior developers and contributing to open-source projects."
  });

  const [profileImage, setProfileImage] = useState("https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face");
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const timezoneOptions = [
    { value: "America/New_York", label: "Eastern Time (ET)" },
    { value: "America/Chicago", label: "Central Time (CT)" },
    { value: "America/Denver", label: "Mountain Time (MT)" },
    { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
    { value: "Europe/London", label: "Greenwich Mean Time (GMT)" },
    { value: "Europe/Paris", label: "Central European Time (CET)" },
    { value: "Asia/Tokyo", label: "Japan Standard Time (JST)" },
    { value: "Asia/Shanghai", label: "China Standard Time (CST)" },
    { value: "Asia/Kolkata", label: "India Standard Time (IST)" },
    { value: "Australia/Sydney", label: "Australian Eastern Time (AET)" }
  ];

  const experienceLevelOptions = [
    { value: "junior", label: "Junior (0-2 years)" },
    { value: "mid", label: "Mid-level (3-5 years)" },
    { value: "senior", label: "Senior (6-10 years)" },
    { value: "lead", label: "Lead (10+ years)" },
    { value: "principal", label: "Principal/Staff (15+ years)" }
  ];

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (file) => {
    if (file && file.type.startsWith('image/')) {
      setIsUploading(true);
      // Simulate upload process
      setTimeout(() => {
        const imageUrl = URL.createObjectURL(file);
        setProfileImage(imageUrl);
        setIsUploading(false);
      }, 1500);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    handleImageUpload(file);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    handleImageUpload(file);
  };

  const handleSave = () => {
    console.log('Saving personal information:', profileData);
    // Show success message
  };

  const handleReset = () => {
    setProfileData({
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@company.com",
      phone: "+1 (555) 123-4567",
      timezone: "America/New_York",
      jobTitle: "Senior Frontend Developer",
      company: "TechCorp Inc.",
      experienceLevel: "senior",
      bio: "Passionate frontend developer with 8+ years of experience in React, TypeScript, and modern web technologies. Love mentoring junior developers and contributing to open-source projects."
    });
  };

  return (
    <div className="space-y-8">
      {/* Profile Photo Section */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
          <Icon name="Camera" size={20} className="mr-2" />
          Profile Photo
        </h3>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-muted border-2 border-border">
              {isUploading ? (
                <div className="w-full h-full flex items-center justify-center">
                  <Icon name="Loader2" size={24} className="animate-spin text-primary" />
                </div>
              ) : (
                <Image
                  src={profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          </div>
          
          <div className="flex-1">
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200 ${
                isDragOver 
                  ? 'border-primary bg-primary bg-opacity-5' :'border-border hover:border-primary hover:bg-muted'
              }`}
              onDrop={handleDrop}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
            >
              <Icon name="Upload" size={32} className="mx-auto mb-2 text-text-secondary" />
              <p className="text-sm text-text-secondary mb-2">
                Drag and drop your photo here, or click to browse
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="profile-upload"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => document.getElementById('profile-upload').click()}
                disabled={isUploading}
              >
                Choose File
              </Button>
              <p className="text-xs text-text-secondary mt-2">
                PNG, JPG up to 5MB
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
          <Icon name="User" size={20} className="mr-2" />
          Contact Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="First Name"
            type="text"
            value={profileData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            required
          />
          
          <Input
            label="Last Name"
            type="text"
            value={profileData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            required
          />
          
          <Input
            label="Email Address"
            type="email"
            value={profileData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            description="This will be used for interview invitations"
            required
          />
          
          <Input
            label="Phone Number"
            type="tel"
            value={profileData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            description="Optional, for urgent communications"
          />
          
          <div className="md:col-span-2">
            <Select
              label="Timezone"
              options={timezoneOptions}
              value={profileData.timezone}
              onChange={(value) => handleInputChange('timezone', value)}
              description="Used for scheduling interviews"
              searchable
              required
            />
          </div>
        </div>
      </div>

      {/* Professional Information */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
          <Icon name="Briefcase" size={20} className="mr-2" />
          Professional Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Job Title"
            type="text"
            value={profileData.jobTitle}
            onChange={(e) => handleInputChange('jobTitle', e.target.value)}
            placeholder="e.g., Senior Frontend Developer"
          />
          
          <Input
            label="Company"
            type="text"
            value={profileData.company}
            onChange={(e) => handleInputChange('company', e.target.value)}
            placeholder="e.g., TechCorp Inc."
          />
          
          <div className="md:col-span-2">
            <Select
              label="Experience Level"
              options={experienceLevelOptions}
              value={profileData.experienceLevel}
              onChange={(value) => handleInputChange('experienceLevel', value)}
              description="This helps match you with appropriate interview difficulty"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-text-primary mb-2">
              Professional Bio
            </label>
            <textarea
              value={profileData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              placeholder="Tell us about your background, skills, and interests..."
            />
            <p className="text-xs text-text-secondary mt-1">
              This will be visible to interviewers
            </p>
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
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default PersonalInfoTab;