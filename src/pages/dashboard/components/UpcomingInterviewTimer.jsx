import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const UpcomingInterviewTimer = ({ nextInterview = null }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    if (!nextInterview) return;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const interviewTime = new Date(nextInterview.date).getTime();
      const difference = interviewTime - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [nextInterview]);

  const handleJoinEarly = () => {
    console.log('Join early clicked for interview:', nextInterview.id);
  };

  const handleViewDetails = () => {
    console.log('View details clicked for interview:', nextInterview.id);
  };

  if (!nextInterview) {
    return (
      <div className="bg-card rounded-lg border border-border shadow-sm p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="Clock" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-text-primary">Next Interview</h3>
        </div>
        
        <div className="text-center py-8">
          <Icon name="Calendar" size={48} className="text-text-secondary mx-auto mb-4" />
          <h4 className="font-medium text-text-primary mb-2">No upcoming interviews</h4>
          <p className="text-sm text-text-secondary mb-4">Schedule your next interview to see the countdown here.</p>
          <Button variant="outline" size="sm" iconName="Plus" iconPosition="left">
            Schedule Interview
          </Button>
        </div>
      </div>
    );
  }

  const isWithinJoinWindow = () => {
    const now = new Date().getTime();
    const interviewTime = new Date(nextInterview.date).getTime();
    const timeDiff = interviewTime - now;
    return timeDiff <= 15 * 60 * 1000 && timeDiff > 0; // 15 minutes before
  };

  return (
    <div className="bg-card rounded-lg border border-border shadow-sm p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Icon name="Clock" size={20} className="text-primary" />
        <h3 className="text-lg font-semibold text-text-primary">Next Interview</h3>
      </div>

      <div className="mb-6">
        <h4 className="font-medium text-text-primary mb-1">{nextInterview.position}</h4>
        <p className="text-sm text-text-secondary mb-2">with {nextInterview.candidate}</p>
        <p className="text-xs text-text-secondary">
          {new Date(nextInterview.date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-6">
        <div className="text-center">
          <div className="bg-primary bg-opacity-10 rounded-lg p-3 mb-2">
            <span className="text-2xl font-bold text-primary">{timeLeft.days}</span>
          </div>
          <span className="text-xs text-text-secondary">Days</span>
        </div>
        <div className="text-center">
          <div className="bg-primary bg-opacity-10 rounded-lg p-3 mb-2">
            <span className="text-2xl font-bold text-primary">{timeLeft.hours}</span>
          </div>
          <span className="text-xs text-text-secondary">Hours</span>
        </div>
        <div className="text-center">
          <div className="bg-primary bg-opacity-10 rounded-lg p-3 mb-2">
            <span className="text-2xl font-bold text-primary">{timeLeft.minutes}</span>
          </div>
          <span className="text-xs text-text-secondary">Minutes</span>
        </div>
        <div className="text-center">
          <div className="bg-primary bg-opacity-10 rounded-lg p-3 mb-2">
            <span className="text-2xl font-bold text-primary">{timeLeft.seconds}</span>
          </div>
          <span className="text-xs text-text-secondary">Seconds</span>
        </div>
      </div>

      <div className="space-y-3">
        {isWithinJoinWindow() && (
          <Button
            variant="default"
            fullWidth
            onClick={handleJoinEarly}
            iconName="Video"
            iconPosition="left"
            className="animate-pulse"
          >
            Join Interview Room
          </Button>
        )}
        
        <Button
          variant="outline"
          fullWidth
          onClick={handleViewDetails}
          iconName="Eye"
          iconPosition="left"
        >
          View Details
        </Button>
      </div>

      {isWithinJoinWindow() && (
        <div className="mt-4 p-3 bg-success bg-opacity-10 rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="CheckCircle" size={16} className="text-success" />
            <span className="text-sm font-medium text-success">Ready to join</span>
          </div>
          <p className="text-xs text-success mt-1">
            You can now enter the interview room up to 15 minutes early.
          </p>
        </div>
      )}
    </div>
  );
};

export default UpcomingInterviewTimer;