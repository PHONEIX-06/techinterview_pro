import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecentInterviewsTable = ({ interviews = [] }) => {
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [filterStatus, setFilterStatus] = useState('all');

  const statusColors = {
    completed: 'bg-success bg-opacity-10 text-success',
    scheduled: 'bg-primary bg-opacity-10 text-primary',
    cancelled: 'bg-error bg-opacity-10 text-error',
    in_progress: 'bg-warning bg-opacity-10 text-warning'
  };

  const statusLabels = {
    completed: 'Completed',
    scheduled: 'Scheduled',
    cancelled: 'Cancelled',
    in_progress: 'In Progress'
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredInterviews = interviews.filter(interview => 
    filterStatus === 'all' || interview.status === filterStatus
  );

  const sortedInterviews = [...filteredInterviews].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];
    
    if (sortField === 'date') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }
    
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    }
    return aValue < bValue ? 1 : -1;
  });

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleViewRecording = (interviewId) => {
    console.log('View recording for interview:', interviewId);
  };

  const handleViewFeedback = (interviewId) => {
    console.log('View feedback for interview:', interviewId);
  };

  const handleReschedule = (interviewId) => {
    console.log('Reschedule interview:', interviewId);
  };

  return (
    <div className="bg-card rounded-lg border border-border shadow-sm">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-primary">Recent Interviews</h3>
          <div className="flex items-center space-x-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-1 text-sm border border-border rounded-md bg-input text-text-primary focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="scheduled">Scheduled</option>
              <option value="cancelled">Cancelled</option>
              <option value="in_progress">In Progress</option>
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer hover:bg-muted-foreground hover:bg-opacity-5"
                onClick={() => handleSort('date')}
              >
                <div className="flex items-center space-x-1">
                  <span>Date & Time</span>
                  <Icon 
                    name={sortField === 'date' && sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown'} 
                    size={14} 
                  />
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer hover:bg-muted-foreground hover:bg-opacity-5"
                onClick={() => handleSort('candidate')}
              >
                <div className="flex items-center space-x-1">
                  <span>Candidate</span>
                  <Icon 
                    name={sortField === 'candidate' && sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown'} 
                    size={14} 
                  />
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer hover:bg-muted-foreground hover:bg-opacity-5"
                onClick={() => handleSort('position')}
              >
                <div className="flex items-center space-x-1">
                  <span>Position</span>
                  <Icon 
                    name={sortField === 'position' && sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown'} 
                    size={14} 
                  />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {sortedInterviews.map((interview) => (
              <tr key={interview.id} className="hover:bg-muted hover:bg-opacity-50 transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-text-primary">
                    {formatDate(interview.date)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8">
                      <div className="h-8 w-8 rounded-full bg-primary bg-opacity-10 flex items-center justify-center">
                        <Icon name="User" size={16} className="text-primary" />
                      </div>
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-text-primary">
                        {interview.candidate}
                      </div>
                      <div className="text-sm text-text-secondary">
                        {interview.interviewer}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-text-primary">{interview.position}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[interview.status]}`}>
                    {statusLabels[interview.status]}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    {interview.status === 'completed' && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewRecording(interview.id)}
                          iconName="Play"
                          iconPosition="left"
                        >
                          Recording
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewFeedback(interview.id)}
                          iconName="MessageSquare"
                          iconPosition="left"
                        >
                          Feedback
                        </Button>
                      </>
                    )}
                    {interview.status === 'scheduled' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleReschedule(interview.id)}
                        iconName="Calendar"
                        iconPosition="left"
                      >
                        Reschedule
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sortedInterviews.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Calendar" size={48} className="text-text-secondary mx-auto mb-4" />
          <h3 className="text-lg font-medium text-text-primary mb-2">No interviews found</h3>
          <p className="text-text-secondary">
            {filterStatus === 'all' ? 'No interviews scheduled yet.' : `No ${filterStatus} interviews found.`}
          </p>
        </div>
      )}
    </div>
  );
};

export default RecentInterviewsTable;