import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const InterviewRoomNavigation = ({ 
  sessionData = {
    interviewTitle: 'Senior Frontend Developer Interview',
    candidate: 'Sarah Johnson',
    interviewer: 'Mike Chen',
    startTime: new Date(),
    duration: 60
  },
  onEndSession = () => {},
  connectionStatus = 'connected'
}) => {
  const [sessionTime, setSessionTime] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'text-success';
      case 'connecting': return 'text-warning';
      case 'disconnected': return 'text-error';
      default: return 'text-text-secondary';
    }
  };

  const getConnectionStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected': return 'Wifi';
      case 'connecting': return 'WifiOff';
      case 'disconnected': return 'WifiOff';
      default: return 'Wifi';
    }
  };

  const handleEndSession = () => {
    setShowEndConfirm(false);
    onEndSession();
    navigate('/dashboard');
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    console.log(isRecording ? 'Recording stopped' : 'Recording started');
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-surface border-b border-border shadow-elevation-1">
        <div className="flex items-center justify-between h-16 px-6">
          {/* Left Section - Session Info */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
                <Icon name="Video" size={20} color="white" />
              </div>
              <span className="text-lg font-semibold text-text-primary">Live Interview</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <Icon name="Clock" size={16} className="text-text-secondary" />
                <span className="font-mono text-text-primary">{formatTime(sessionTime)}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Icon name="User" size={16} className="text-text-secondary" />
                <span className="text-text-secondary">{sessionData.candidate}</span>
              </div>
            </div>
          </div>

          {/* Center Section - Connection Status */}
          <div className="flex items-center space-x-2">
            <Icon 
              name={getConnectionStatusIcon()} 
              size={16} 
              className={`${getConnectionStatusColor()} ${connectionStatus === 'connecting' ? 'animate-pulse' : ''}`} 
            />
            <span className={`text-sm font-medium ${getConnectionStatusColor()}`}>
              {connectionStatus.charAt(0).toUpperCase() + connectionStatus.slice(1)}
            </span>
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center space-x-3">
            {/* Recording Toggle */}
            <Button
              variant={isRecording ? "destructive" : "outline"}
              size="sm"
              onClick={toggleRecording}
              iconName={isRecording ? "Square" : "Circle"}
              iconPosition="left"
              className="hidden sm:flex"
            >
              {isRecording ? 'Stop Recording' : 'Start Recording'}
            </Button>

            {/* Mobile Recording Button */}
            <button
              onClick={toggleRecording}
              className={`sm:hidden p-2 rounded-lg transition-all duration-200 ${
                isRecording 
                  ? 'bg-error text-error-foreground' 
                  : 'bg-muted text-text-secondary hover:text-text-primary'
              }`}
            >
              <Icon name={isRecording ? "Square" : "Circle"} size={18} />
            </button>

            {/* Settings */}
            <button className="p-2 text-text-secondary hover:text-text-primary hover:bg-muted rounded-lg transition-all duration-200">
              <Icon name="Settings" size={18} />
            </button>

            {/* End Session */}
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowEndConfirm(true)}
              iconName="PhoneOff"
              iconPosition="left"
            >
              End Session
            </Button>
          </div>
        </div>

        {/* Mobile Session Info */}
        <div className="md:hidden px-6 py-2 bg-muted border-t border-border">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <span className="font-mono text-text-primary">{formatTime(sessionTime)}</span>
              <span className="text-text-secondary">{sessionData.candidate}</span>
            </div>
            {isRecording && (
              <div className="flex items-center space-x-1 text-error">
                <div className="w-2 h-2 bg-error rounded-full animate-pulse"></div>
                <span className="text-xs font-medium">REC</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* End Session Confirmation Modal */}
      {showEndConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-surface rounded-lg shadow-elevation-3 p-6 max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex items-center justify-center w-10 h-10 bg-error bg-opacity-10 rounded-full">
                <Icon name="AlertTriangle" size={20} className="text-error" />
              </div>
              <h3 className="text-lg font-semibold text-text-primary">End Interview Session</h3>
            </div>
            
            <p className="text-text-secondary mb-6">
              Are you sure you want to end this interview session? This action cannot be undone and all participants will be disconnected.
            </p>
            
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowEndConfirm(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleEndSession}
                className="flex-1"
              >
                End Session
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InterviewRoomNavigation;