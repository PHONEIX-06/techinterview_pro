import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecentSchedules = () => {
  const recentSchedules = [
    {
      id: 1,
      title: 'Senior Frontend Developer Interview',
      candidate: 'Sarah Johnson',
      candidateEmail: 'sarah.johnson@email.com',
      date: '2025-01-28',
      time: '10:00 AM',
      duration: '60 min',
      status: 'confirmed',
      position: 'Senior Frontend Developer',
      interviewType: 'Technical Coding'
    },
    {
      id: 2,
      title: 'Full Stack Engineer Interview',
      candidate: 'Michael Chen',
      candidateEmail: 'michael.chen@email.com',
      date: '2025-01-28',
      time: '2:00 PM',
      duration: '90 min',
      status: 'pending',
      position: 'Full Stack Engineer',
      interviewType: 'System Design'
    },
    {
      id: 3,
      title: 'Backend Developer Interview',
      candidate: 'Emily Rodriguez',
      candidateEmail: 'emily.rodriguez@email.com',
      date: '2025-01-29',
      time: '11:00 AM',
      duration: '45 min',
      status: 'confirmed',
      position: 'Backend Developer',
      interviewType: 'Technical Coding'
    },
    {
      id: 4,
      title: 'DevOps Engineer Interview',
      candidate: 'David Kim',
      candidateEmail: 'david.kim@email.com',
      date: '2025-01-29',
      time: '3:30 PM',
      duration: '60 min',
      status: 'draft',
      position: 'DevOps Engineer',
      interviewType: 'Mixed Interview'
    }
  ];

  const getStatusColor = (status) => {
    const statusColors = {
      confirmed: 'bg-success bg-opacity-10 text-success border-success border-opacity-20',
      pending: 'bg-warning bg-opacity-10 text-warning border-warning border-opacity-20',
      draft: 'bg-text-secondary bg-opacity-10 text-text-secondary border-text-secondary border-opacity-20'
    };
    return statusColors[status] || statusColors.draft;
  };

  const getStatusIcon = (status) => {
    const statusIcons = {
      confirmed: 'CheckCircle',
      pending: 'Clock',
      draft: 'Edit'
    };
    return statusIcons[status] || 'Edit';
  };

  const handleViewDetails = (scheduleId) => {
    console.log('View details for schedule:', scheduleId);
  };

  const handleEditSchedule = (scheduleId) => {
    console.log('Edit schedule:', scheduleId);
  };

  const handleCancelSchedule = (scheduleId) => {
    console.log('Cancel schedule:', scheduleId);
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-secondary bg-opacity-10 rounded-lg">
            <Icon name="History" size={20} className="text-secondary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-text-primary">Recent Schedules</h2>
            <p className="text-sm text-text-secondary">Your latest interview scheduling activity</p>
          </div>
        </div>
        
        <Button variant="outline" size="sm" iconName="Plus" iconPosition="left">
          New Schedule
        </Button>
      </div>

      <div className="space-y-4">
        {recentSchedules.map(schedule => (
          <div key={schedule.id} className="border border-border rounded-lg p-4 hover:bg-muted hover:bg-opacity-50 transition-colors duration-200">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-medium text-text-primary">{schedule.title}</h3>
                  <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(schedule.status)}`}>
                    <Icon name={getStatusIcon(schedule.status)} size={12} />
                    <span className="capitalize">{schedule.status}</span>
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-text-secondary">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Icon name="User" size={14} />
                      <span>{schedule.candidate}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Icon name="Mail" size={14} />
                      <span>{schedule.candidateEmail}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Icon name="Briefcase" size={14} />
                      <span>{schedule.position}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Icon name="Calendar" size={14} />
                      <span>{new Date(schedule.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Icon name="Clock" size={14} />
                      <span>{schedule.time} ({schedule.duration})</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Icon name="Code" size={14} />
                      <span>{schedule.interviewType}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-border">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleViewDetails(schedule.id)}
                iconName="Eye"
                iconPosition="left"
              >
                View
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEditSchedule(schedule.id)}
                iconName="Edit"
                iconPosition="left"
              >
                Edit
              </Button>
              
              {schedule.status !== 'draft' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCancelSchedule(schedule.id)}
                  iconName="X"
                  iconPosition="left"
                  className="text-error hover:text-error hover:bg-error hover:bg-opacity-10"
                >
                  Cancel
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <Button variant="outline" iconName="ArrowRight" iconPosition="right">
          View All Schedules
        </Button>
      </div>
    </div>
  );
};

export default RecentSchedules;