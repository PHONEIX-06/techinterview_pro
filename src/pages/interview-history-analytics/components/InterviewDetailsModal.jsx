import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const InterviewDetailsModal = ({ interview, isOpen, onClose, onScheduleFollowup }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(0);

  if (!isOpen || !interview) return null;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'FileText' },
    { id: 'recording', label: 'Recording', icon: 'Play' },
    { id: 'code', label: 'Code Review', icon: 'Code' },
    { id: 'feedback', label: 'Feedback', icon: 'MessageSquare' }
  ];

  const getRatingStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Icon
        key={i}
        name="Star"
        size={16}
        className={i < rating ? 'text-warning fill-current' : 'text-muted-foreground'}
      />
    ));
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { bg: 'bg-success', text: 'text-success-foreground', label: 'Completed' },
      cancelled: { bg: 'bg-error', text: 'text-error-foreground', label: 'Cancelled' },
      no_show: { bg: 'bg-warning', text: 'text-warning-foreground', label: 'No Show' }
    };
    
    const config = statusConfig[status] || statusConfig.completed;
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    console.log(isPlaying ? 'Paused recording' : 'Playing recording');
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Interview Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xl font-semibold text-text-primary mb-2">{interview.position}</h3>
          <div className="flex items-center space-x-4 text-sm text-text-secondary">
            <span>{new Date(interview.date).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</span>
            <span>•</span>
            <span>{interview.duration} minutes</span>
            <span>•</span>
            {getStatusBadge(interview.status)}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {getRatingStars(interview.rating)}
          <span className="text-sm text-text-secondary ml-2">({interview.rating}/5)</span>
        </div>
      </div>

      {/* Participants */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-muted/50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-text-primary mb-3">Candidate</h4>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-primary-foreground">
                {interview.candidate.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div>
              <div className="text-sm font-medium text-text-primary">{interview.candidate}</div>
              <div className="text-xs text-text-secondary">{interview.candidateEmail}</div>
            </div>
          </div>
        </div>

        <div className="bg-muted/50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-text-primary mb-3">Interviewer</h4>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-secondary-foreground">
                {interview.interviewer.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div>
              <div className="text-sm font-medium text-text-primary">{interview.interviewer}</div>
              <div className="text-xs text-text-secondary">Senior Developer</div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div>
        <h4 className="text-sm font-medium text-text-primary mb-3">Interview Summary</h4>
        <p className="text-sm text-text-secondary leading-relaxed">{interview.summary}</p>
      </div>

      {/* Technical Skills Assessed */}
      <div>
        <h4 className="text-sm font-medium text-text-primary mb-3">Technical Skills Assessed</h4>
        <div className="flex flex-wrap gap-2">
          {interview.skillsAssessed?.map((skill, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  const renderRecordingTab = () => (
    <div className="space-y-6">
      {/* Video Player */}
      <div className="bg-black rounded-lg aspect-video flex items-center justify-center relative">
        <div className="text-center">
          <Icon name="Play" size={48} className="text-white mb-4 mx-auto" />
          <p className="text-white text-sm">Interview Recording</p>
          <p className="text-gray-400 text-xs">{interview.duration} minutes</p>
        </div>
        
        {/* Play/Pause Overlay */}
        <button
          onClick={handlePlayPause}
          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 hover:bg-opacity-30 transition-all duration-200"
        >
          <Icon 
            name={isPlaying ? "Pause" : "Play"} 
            size={64} 
            className="text-white opacity-80 hover:opacity-100" 
          />
        </button>
      </div>

      {/* Playback Controls */}
      <div className="bg-muted/50 rounded-lg p-4">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePlayPause}
            iconName={isPlaying ? "Pause" : "Play"}
            iconPosition="left"
          >
            {isPlaying ? 'Pause' : 'Play'}
          </Button>
          
          <div className="flex-1">
            <div className="flex items-center justify-between text-xs text-text-secondary mb-1">
              <span>{formatTime(playbackTime)}</span>
              <span>{formatTime(interview.duration * 60)}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${(playbackTime / (interview.duration * 60)) * 100}%` }}
              />
            </div>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            iconName="Download"
            iconPosition="left"
          >
            Download
          </Button>
        </div>
      </div>

      {/* Recording Timestamps */}
      <div>
        <h4 className="text-sm font-medium text-text-primary mb-3">Key Moments</h4>
        <div className="space-y-2">
          {interview.keyMoments?.map((moment, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div>
                <div className="text-sm font-medium text-text-primary">{moment.title}</div>
                <div className="text-xs text-text-secondary">{moment.description}</div>
              </div>
              <button
                onClick={() => setPlaybackTime(moment.timestamp)}
                className="text-xs text-primary hover:text-primary/80 font-medium"
              >
                {formatTime(moment.timestamp)}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCodeTab = () => (
    <div className="space-y-6">
      {/* Code Editor Replay */}
      <div>
        <h4 className="text-sm font-medium text-text-primary mb-3">Code Solution</h4>
        <div className="bg-surface rounded-lg border border-border p-4">
          <pre className="text-sm text-text-primary overflow-x-auto">
            <code>{interview.codeSnippet}</code>
          </pre>
        </div>
      </div>

      {/* Code Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-sm font-medium text-text-primary mb-3">Code Quality Metrics</h4>
          <div className="space-y-3">
            {interview.codeMetrics?.map((metric) => (
              <div key={metric.name}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-text-primary">{metric.name}</span>
                  <span className="text-text-secondary">{metric.score}/10</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(metric.score / 10) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-text-primary mb-3">Test Results</h4>
          <div className="space-y-2">
            {interview.testResults?.map((test, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                <span className="text-sm text-text-primary">{test.name}</span>
                <Icon 
                  name={test.passed ? "CheckCircle" : "XCircle"} 
                  size={16} 
                  className={test.passed ? "text-success" : "text-error"} 
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderFeedbackTab = () => (
    <div className="space-y-6">
      {/* Overall Feedback */}
      <div>
        <h4 className="text-sm font-medium text-text-primary mb-3">Overall Feedback</h4>
        <div className="bg-muted/50 rounded-lg p-4">
          <p className="text-sm text-text-secondary leading-relaxed">{interview.feedback}</p>
        </div>
      </div>

      {/* Detailed Ratings */}
      <div>
        <h4 className="text-sm font-medium text-text-primary mb-3">Detailed Ratings</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {interview.detailedRatings?.map((rating) => (
            <div key={rating.category} className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-text-primary">{rating.category}</span>
                <div className="flex items-center space-x-1">
                  {getRatingStars(rating.score)}
                </div>
              </div>
              <p className="text-xs text-text-secondary">{rating.comment}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div>
        <h4 className="text-sm font-medium text-text-primary mb-3">Recommendations</h4>
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Icon 
              name={interview.recommendation === 'hire' ? "CheckCircle" : interview.recommendation === 'maybe' ? "Clock" : "XCircle"} 
              size={20} 
              className={
                interview.recommendation === 'hire' ? "text-success" : 
                interview.recommendation === 'maybe' ? "text-warning" : "text-error"
              } 
            />
            <div>
              <div className="text-sm font-medium text-text-primary mb-1">
                {interview.recommendation === 'hire' ? 'Recommended for Hire' : 
                 interview.recommendation === 'maybe' ? 'Consider for Next Round' : 'Not Recommended'}
              </div>
              <p className="text-xs text-text-secondary">{interview.recommendationReason}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-surface rounded-lg shadow-elevation-3 max-w-4xl w-full max-h-[90vh] mx-4 flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-text-primary">Interview Details</h2>
          <div className="flex items-center space-x-2">
            {interview.status === 'completed' && interview.rating >= 4 && (
              <Button
                variant="default"
                size="sm"
                onClick={() => onScheduleFollowup(interview)}
                iconName="Calendar"
                iconPosition="left"
              >
                Schedule Follow-up
              </Button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-text-secondary hover:text-text-primary hover:bg-muted rounded-lg transition-all duration-200"
            >
              <Icon name="X" size={20} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-border">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 border-b-2 text-sm font-medium transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-primary text-primary' :'border-transparent text-text-secondary hover:text-text-primary'
                }`}
              >
                <Icon name={tab.icon} size={16} />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'overview' && renderOverviewTab()}
          {activeTab === 'recording' && renderRecordingTab()}
          {activeTab === 'code' && renderCodeTab()}
          {activeTab === 'feedback' && renderFeedbackTab()}
        </div>
      </div>
    </div>
  );
};

export default InterviewDetailsModal;