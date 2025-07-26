import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const InterviewCalendarWidget = ({ interviews = [] }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getInterviewsForDate = (date) => {
    const dateStr = date.toDateString();
    return interviews.filter(interview => 
      new Date(interview.date).toDateString() === dateStr
    );
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-8"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayInterviews = getInterviewsForDate(date);
      const isToday = date.toDateString() === new Date().toDateString();
      const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
      const hasInterviews = dayInterviews.length > 0;

      days.push(
        <button
          key={day}
          onClick={() => setSelectedDate(date)}
          className={`h-8 w-8 text-sm rounded-md transition-all duration-200 relative ${
            isSelected
              ? 'bg-primary text-primary-foreground'
              : isToday
              ? 'bg-primary bg-opacity-20 text-primary font-medium'
              : hasInterviews
              ? 'bg-success bg-opacity-10 text-success hover:bg-success hover:bg-opacity-20' :'text-text-primary hover:bg-muted'
          }`}
        >
          {day}
          {hasInterviews && (
            <div className="absolute bottom-0 right-0 w-2 h-2 bg-success rounded-full"></div>
          )}
        </button>
      );
    }

    return days;
  };

  const selectedDateInterviews = selectedDate ? getInterviewsForDate(selectedDate) : [];

  return (
    <div className="bg-card rounded-lg border border-border shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Icon name="Calendar" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-text-primary">Interview Calendar</h3>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateMonth(-1)}
            iconName="ChevronLeft"
          />
          <span className="text-sm font-medium text-text-primary min-w-[120px] text-center">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateMonth(1)}
            iconName="ChevronRight"
          />
        </div>
      </div>

      <div className="mb-4">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="h-8 flex items-center justify-center text-xs font-medium text-text-secondary">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {renderCalendarDays()}
        </div>
      </div>

      {selectedDate && (
        <div className="border-t border-border pt-4">
          <h4 className="font-medium text-text-primary mb-3">
            {selectedDate.toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric'
            })}
          </h4>
          
          {selectedDateInterviews.length > 0 ? (
            <div className="space-y-2">
              {selectedDateInterviews.map((interview) => (
                <div key={interview.id} className="flex items-center space-x-3 p-2 bg-muted rounded-md">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">
                      {interview.position}
                    </p>
                    <p className="text-xs text-text-secondary">
                      {new Date(interview.date).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })} • {interview.candidate}
                    </p>
                  </div>
                  <Icon name="ChevronRight" size={14} className="text-text-secondary" />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <Icon name="Calendar" size={32} className="text-text-secondary mx-auto mb-2" />
              <p className="text-sm text-text-secondary">No interviews scheduled</p>
            </div>
          )}
        </div>
      )}

      <div className="mt-4 flex items-center justify-between text-xs text-text-secondary">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <span>Today</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-success rounded-full"></div>
            <span>Has interviews</span>
          </div>
        </div>
        <Button variant="ghost" size="sm" iconName="Plus" iconPosition="left">
          Add Event
        </Button>
      </div>
    </div>
  );
};

export default InterviewCalendarWidget;