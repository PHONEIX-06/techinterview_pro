import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const CalendarWidget = ({ onTimeSlotSelect, selectedSlot }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedTimeZone, setSelectedTimeZone] = useState('America/New_York');
  const [selectedDate, setSelectedDate] = useState(null);

  const timeZoneOptions = [
    { value: 'America/New_York', label: 'Eastern Time (ET)' },
    { value: 'America/Chicago', label: 'Central Time (CT)' },
    { value: 'America/Denver', label: 'Mountain Time (MT)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
    { value: 'Europe/London', label: 'Greenwich Mean Time (GMT)' },
    { value: 'Europe/Berlin', label: 'Central European Time (CET)' },
    { value: 'Asia/Tokyo', label: 'Japan Standard Time (JST)' },
    { value: 'Asia/Kolkata', label: 'India Standard Time (IST)' }
  ];

  const availableSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
  ];

  const busySlots = ['10:30', '15:00']; // Mock busy slots

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isPastDate = (date) => {
    if (!date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const handleDateSelect = (date) => {
    if (isPastDate(date)) return;
    setSelectedDate(date);
  };

  const handleTimeSlotSelect = (time) => {
    if (!selectedDate || busySlots.includes(time)) return;
    
    const slot = {
      date: selectedDate,
      time: time,
      timeZone: selectedTimeZone,
      formatted: `${selectedDate.toLocaleDateString()} at ${time}`
    };
    
    onTimeSlotSelect(slot);
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 bg-accent bg-opacity-10 rounded-lg">
          <Icon name="Clock" size={20} className="text-accent" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-text-primary">Select Time</h2>
          <p className="text-sm text-text-secondary">Choose your preferred interview slot</p>
        </div>
      </div>

      {/* Time Zone Selector */}
      <div className="mb-6">
        <Select
          label="Time Zone"
          options={timeZoneOptions}
          value={selectedTimeZone}
          onChange={setSelectedTimeZone}
        />
      </div>

      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        <div className="flex space-x-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth(-1)}
            iconName="ChevronLeft"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth(1)}
            iconName="ChevronRight"
          />
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="mb-6">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map(day => (
            <div key={day} className="text-center text-xs font-medium text-text-secondary py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {getDaysInMonth(currentDate).map((date, index) => (
            <button
              key={index}
              onClick={() => date && handleDateSelect(date)}
              disabled={!date || isPastDate(date)}
              className={`
                aspect-square flex items-center justify-center text-sm rounded-lg transition-all duration-200
                ${!date ? 'invisible' : ''}
                ${isPastDate(date) ? 'text-text-secondary cursor-not-allowed opacity-50' : ''}
                ${isToday(date) ? 'bg-primary text-primary-foreground font-semibold' : ''}
                ${selectedDate && date && selectedDate.toDateString() === date.toDateString() 
                  ? 'bg-accent text-accent-foreground ring-2 ring-accent ring-opacity-50' 
                  : 'hover:bg-muted text-text-primary'}
              `}
            >
              {date?.getDate()}
            </button>
          ))}
        </div>
      </div>

      {/* Time Slots */}
      {selectedDate && (
        <div className="space-y-4">
          <h4 className="text-md font-medium text-text-primary">
            Available Times for {selectedDate.toLocaleDateString()}
          </h4>
          
          <div className="grid grid-cols-2 gap-2">
            {availableSlots.map(time => {
              const isBusy = busySlots.includes(time);
              const isSelected = selectedSlot && selectedSlot.time === time && 
                selectedSlot.date.toDateString() === selectedDate.toDateString();
              
              return (
                <button
                  key={time}
                  onClick={() => handleTimeSlotSelect(time)}
                  disabled={isBusy}
                  className={`
                    px-3 py-2 text-sm rounded-lg border transition-all duration-200
                    ${isBusy 
                      ? 'border-error bg-error bg-opacity-10 text-error cursor-not-allowed' 
                      : isSelected
                        ? 'border-accent bg-accent text-accent-foreground'
                        : 'border-border hover:border-primary hover:bg-primary hover:bg-opacity-10 text-text-primary'
                    }
                  `}
                >
                  {time}
                  {isBusy && (
                    <span className="block text-xs mt-1">Busy</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Selected Slot Confirmation */}
      {selectedSlot && (
        <div className="mt-6 p-4 bg-success bg-opacity-10 border border-success border-opacity-20 rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="CheckCircle" size={16} className="text-success" />
            <span className="text-sm font-medium text-success">Selected Time Slot</span>
          </div>
          <p className="text-sm text-text-primary mt-1">
            {selectedSlot.formatted} ({selectedTimeZone.split('/')[1].replace('_', ' ')})
          </p>
        </div>
      )}

      {/* Availability Legend */}
      <div className="mt-6 pt-4 border-t border-border">
        <h5 className="text-sm font-medium text-text-primary mb-2">Legend</h5>
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary rounded"></div>
            <span className="text-text-secondary">Today</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-accent rounded"></div>
            <span className="text-text-secondary">Selected</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-error bg-opacity-20 border border-error rounded"></div>
            <span className="text-text-secondary">Busy</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarWidget;