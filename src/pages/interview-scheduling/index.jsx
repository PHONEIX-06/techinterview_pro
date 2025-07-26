import React, { useState } from 'react';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import SchedulingForm from './components/SchedulingForm';
import CalendarWidget from './components/CalendarWidget';
import SchedulingStats from './components/SchedulingStats';
import RecentSchedules from './components/RecentSchedules';

const InterviewScheduling = () => {
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [scheduledInterview, setScheduledInterview] = useState(null);

  const breadcrumbItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Interview Scheduling', path: '/interview-scheduling', current: true }
  ];

  const handleScheduleInterview = (formData) => {
    if (!selectedTimeSlot) {
      alert('Please select a time slot before scheduling the interview.');
      return;
    }

    const interviewData = {
      ...formData,
      timeSlot: selectedTimeSlot,
      scheduledAt: new Date().toISOString(),
      id: Date.now()
    };

    setScheduledInterview(interviewData);
    setShowSuccessModal(true);
    
    // Reset form and time slot
    setSelectedTimeSlot(null);
    
    console.log('Interview scheduled:', interviewData);
  };

  const handleSaveDraft = (formData) => {
    const draftData = {
      ...formData,
      timeSlot: selectedTimeSlot,
      savedAt: new Date().toISOString(),
      id: Date.now()
    };

    console.log('Draft saved:', draftData);
    alert('Interview draft saved successfully!');
  };

  const handleStartNow = (formData) => {
    if (!selectedTimeSlot) {
      alert('Please select a time slot before starting the interview.');
      return;
    }

    const immediateInterviewData = {
      ...formData,
      timeSlot: selectedTimeSlot,
      startedAt: new Date().toISOString(),
      id: Date.now()
    };

    console.log('Starting interview immediately:', immediateInterviewData);
    // In a real app, this would redirect to the live interview room
    alert('Redirecting to live interview room...');
  };

  const handleTimeSlotSelect = (slot) => {
    setSelectedTimeSlot(slot);
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    setScheduledInterview(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Breadcrumb items={breadcrumbItems} />
          
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-text-primary mb-2">Interview Scheduling</h1>
            <p className="text-text-secondary">
              Create and manage technical interview sessions with comprehensive calendar integration
            </p>
          </div>

          <SchedulingStats />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
            {/* Left Panel - Scheduling Form */}
            <div className="lg:col-span-7">
              <SchedulingForm
                onSchedule={handleScheduleInterview}
                onSaveDraft={handleSaveDraft}
                onStartNow={handleStartNow}
              />
            </div>

            {/* Right Panel - Calendar Widget */}
            <div className="lg:col-span-5">
              <CalendarWidget
                onTimeSlotSelect={handleTimeSlotSelect}
                selectedSlot={selectedTimeSlot}
              />
            </div>
          </div>

          {/* Recent Schedules Section */}
          <RecentSchedules />
        </div>
      </main>

      {/* Success Modal */}
      {showSuccessModal && scheduledInterview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-surface rounded-lg shadow-elevation-3 p-6 max-w-md w-full mx-4">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center w-16 h-16 bg-success bg-opacity-10 rounded-full mx-auto mb-4">
                <svg className="w-8 h-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-2">Interview Scheduled Successfully!</h3>
              <p className="text-text-secondary">
                The interview invitation has been sent to {scheduledInterview.candidateName}
              </p>
            </div>

            <div className="bg-muted rounded-lg p-4 mb-6 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-text-secondary">Interview:</span>
                <span className="text-text-primary font-medium">{scheduledInterview.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Candidate:</span>
                <span className="text-text-primary">{scheduledInterview.candidateName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Date & Time:</span>
                <span className="text-text-primary">{selectedTimeSlot?.formatted}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Duration:</span>
                <span className="text-text-primary">{scheduledInterview.duration} minutes</span>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={closeSuccessModal}
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary hover:bg-opacity-90 transition-colors duration-200"
              >
                Done
              </button>
              <button
                onClick={() => {
                  closeSuccessModal();
                  console.log('View interview details');
                }}
                className="flex-1 px-4 py-2 border border-border text-text-primary rounded-lg hover:bg-muted transition-colors duration-200"
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewScheduling;