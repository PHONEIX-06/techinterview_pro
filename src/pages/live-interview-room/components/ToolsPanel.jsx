import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ToolsPanel = ({ 
  onOpenWhiteboard = () => {},
  onToggleScreenShare = () => {},
  onOpenChallenges = () => {},
  isScreenSharing = false,
  sessionData = {}
}) => {
  const [activeTimer, setActiveTimer] = useState(null);
  const [timerMinutes, setTimerMinutes] = useState(30);
  const [timeRemaining, setTimeRemaining] = useState(null);

  const tools = [
    {
      id: 'whiteboard',
      name: 'Whiteboard',
      icon: 'PenTool',
      description: 'Open collaborative whiteboard for system design',
      action: onOpenWhiteboard
    },
    {
      id: 'screen-share',
      name: isScreenSharing ? 'Stop Sharing' : 'Screen Share',
      icon: 'Monitor',
      description: 'Share your screen with participants',
      action: onToggleScreenShare,
      variant: isScreenSharing ? 'success' : 'outline'
    },
    {
      id: 'challenges',
      name: 'Code Challenges',
      icon: 'Code2',
      description: 'Browse coding challenge templates',
      action: onOpenChallenges
    },
    {
      id: 'timer',
      name: 'Timer',
      icon: 'Timer',
      description: 'Set a countdown timer for coding challenges',
      action: () => startTimer()
    }
  ];

  const quickTimers = [15, 30, 45, 60];

  const startTimer = (minutes = timerMinutes) => {
    setActiveTimer(Date.now());
    setTimeRemaining(minutes * 60);
    
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setActiveTimer(null);
          // Timer finished notification
          console.log('Timer finished!');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopTimer = () => {
    setActiveTimer(null);
    setTimeRemaining(null);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const sessionStats = {
    duration: "24:15",
    linesOfCode: 127,
    testsPassed: 3,
    totalTests: 4
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-4 space-y-4">
      {/* Session Stats */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-text-primary flex items-center space-x-2">
          <Icon name="BarChart3" size={16} />
          <span>Session Stats</span>
        </h3>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-muted p-3 rounded-lg">
            <div className="flex items-center space-x-2 mb-1">
              <Icon name="Clock" size={14} className="text-primary" />
              <span className="text-xs text-text-secondary">Duration</span>
            </div>
            <p className="text-lg font-semibold text-text-primary font-mono">{sessionStats.duration}</p>
          </div>
          
          <div className="bg-muted p-3 rounded-lg">
            <div className="flex items-center space-x-2 mb-1">
              <Icon name="Code" size={14} className="text-primary" />
              <span className="text-xs text-text-secondary">Lines</span>
            </div>
            <p className="text-lg font-semibold text-text-primary">{sessionStats.linesOfCode}</p>
          </div>
          
          <div className="bg-muted p-3 rounded-lg">
            <div className="flex items-center space-x-2 mb-1">
              <Icon name="CheckCircle" size={14} className="text-success" />
              <span className="text-xs text-text-secondary">Tests Passed</span>
            </div>
            <p className="text-lg font-semibold text-success">{sessionStats.testsPassed}/{sessionStats.totalTests}</p>
          </div>
          
          <div className="bg-muted p-3 rounded-lg">
            <div className="flex items-center space-x-2 mb-1">
              <Icon name="Zap" size={14} className="text-warning" />
              <span className="text-xs text-text-secondary">Score</span>
            </div>
            <p className="text-lg font-semibold text-warning">85%</p>
          </div>
        </div>
      </div>

      {/* Timer Section */}
      {timeRemaining !== null && (
        <div className="bg-primary bg-opacity-10 border border-primary border-opacity-30 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Icon name="Timer" size={16} className="text-primary" />
              <span className="text-sm font-semibold text-primary">Challenge Timer</span>
            </div>
            <button
              onClick={stopTimer}
              className="p-1 text-primary hover:bg-primary hover:bg-opacity-20 rounded transition-colors duration-200"
            >
              <Icon name="X" size={14} />
            </button>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-mono font-bold text-primary mb-2">
              {formatTime(timeRemaining)}
            </div>
            <div className="w-full bg-primary bg-opacity-20 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-1000"
                style={{ width: `${(timeRemaining / (timerMinutes * 60)) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Quick Timer Buttons */}
      {timeRemaining === null && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-text-primary">Quick Timers</h4>
          <div className="grid grid-cols-2 gap-2">
            {quickTimers.map((minutes) => (
              <Button
                key={minutes}
                variant="outline"
                size="sm"
                onClick={() => startTimer(minutes)}
                className="text-xs"
              >
                {minutes}m
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Tools */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-text-primary flex items-center space-x-2">
          <Icon name="Wrench" size={16} />
          <span>Interview Tools</span>
        </h3>
        
        <div className="space-y-2">
          {tools.map((tool) => (
            <Button
              key={tool.id}
              variant={tool.variant || "outline"}
              size="sm"
              onClick={tool.action}
              iconName={tool.icon}
              iconPosition="left"
              fullWidth
              className="justify-start text-left"
            >
              <div className="flex-1">
                <div className="font-medium">{tool.name}</div>
                <div className="text-xs opacity-75">{tool.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </div>

      {/* Participants */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-text-primary flex items-center space-x-2">
          <Icon name="Users" size={16} />
          <span>Participants</span>
        </h3>
        
        <div className="space-y-2">
          <div className="flex items-center space-x-3 p-2 bg-muted rounded-lg">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <Icon name="User" size={16} color="white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-text-primary">Sarah Johnson</p>
              <p className="text-xs text-text-secondary">Candidate</p>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span className="text-xs text-success">Online</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-2 bg-muted rounded-lg">
            <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
              <Icon name="User" size={16} color="white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-text-primary">Mike Chen</p>
              <p className="text-xs text-text-secondary">Interviewer</p>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span className="text-xs text-success">Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Connection Status */}
      <div className="bg-success bg-opacity-10 border border-success border-opacity-30 p-3 rounded-lg">
        <div className="flex items-center space-x-2">
          <Icon name="Wifi" size={16} className="text-success" />
          <div className="flex-1">
            <p className="text-sm font-medium text-success">Connection Stable</p>
            <p className="text-xs text-success opacity-75">Latency: 45ms • Quality: HD</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolsPanel;