import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import InterviewRoomNavigation from '../../components/ui/InterviewRoomNavigation';
import VideoPanel from './components/VideoPanel';
import ChatPanel from './components/ChatPanel';
import CodeEditor from './components/CodeEditor';
import WhiteboardPanel from './components/WhiteboardPanel';
import ToolsPanel from './components/ToolsPanel';
import Icon from '../../components/AppIcon';


const LiveInterviewRoom = () => {
  const navigate = useNavigate();
  
  // Session state
  const [sessionData] = useState({
    interviewTitle: 'Senior Frontend Developer Interview',
    candidate: 'Sarah Johnson',
    interviewer: 'Mike Chen',
    startTime: new Date(),
    duration: 60
  });

  // Media state
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('connected');

  // UI state
  const [activePanel, setActivePanel] = useState('code'); // 'code', 'chat', 'video'
  const [isWhiteboardOpen, setIsWhiteboardOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);

  // Code editor state
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [theme, setTheme] = useState('dark');
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState(null);

  // Chat state
  const [messages, setMessages] = useState([]);

  // Check for mobile view
  useEffect(() => {
    const checkMobileView = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    checkMobileView();
    window.addEventListener('resize', checkMobileView);
    return () => window.removeEventListener('resize', checkMobileView);
  }, []);

  // Media controls
  const handleToggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled);
    console.log('Video toggled:', !isVideoEnabled);
  };

  const handleToggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled);
    console.log('Audio toggled:', !isAudioEnabled);
  };

  const handleToggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing);
    console.log('Screen sharing toggled:', !isScreenSharing);
  };

  // Code editor handlers
  const handleCodeChange = (newCode) => {
    setCode(newCode);
  };

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
  };

  const handleRunCode = (codeToRun) => {
    setIsExecuting(true);
    // Simulate code execution
    setTimeout(() => {
      setExecutionResult({
        success: true,
        output: `[0, 1]\n[1, 2]`,
        executionTime: "0.045s",
        memoryUsed: "2.1 MB"
      });
      setIsExecuting(false);
    }, 2000);
  };

  // Chat handlers
  const handleSendMessage = (message) => {
    setMessages(prev => [...prev, message]);
  };

  // Session handlers
  const handleEndSession = () => {
    console.log('Session ended');
    navigate('/dashboard');
  };

  // Tool handlers
  const handleOpenWhiteboard = () => {
    setIsWhiteboardOpen(true);
  };

  const handleCloseWhiteboard = () => {
    setIsWhiteboardOpen(false);
  };

  const handleOpenChallenges = () => {
    console.log('Opening coding challenges...');
  };

  // Mobile panel navigation
  const renderMobileNavigation = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border p-2 z-40">
      <div className="flex items-center justify-around">
        {[
          { id: 'video', icon: 'Video', label: 'Video' },
          { id: 'code', icon: 'Code', label: 'Code' },
          { id: 'chat', icon: 'MessageCircle', label: 'Chat' }
        ].map((panel) => (
          <button
            key={panel.id}
            onClick={() => setActivePanel(panel.id)}
            className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors duration-200 ${
              activePanel === panel.id
                ? 'bg-primary text-primary-foreground'
                : 'text-text-secondary hover:text-text-primary hover:bg-muted'
            }`}
          >
            <Icon name={panel.icon} size={20} />
            <span className="text-xs font-medium">{panel.label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Interview Room Navigation */}
      <InterviewRoomNavigation
        sessionData={sessionData}
        onEndSession={handleEndSession}
        connectionStatus={connectionStatus}
      />

      {/* Main Content */}
      <div className="pt-16 h-screen overflow-hidden">
        {/* Desktop Layout */}
        {!isMobileView ? (
          <div className="h-full flex">
            {/* Left Panel - Video & Tools */}
            <div className="w-80 flex flex-col space-y-4 p-4 border-r border-border bg-muted">
              {/* Video Panel */}
              <div className="h-64">
                <VideoPanel
                  isVideoEnabled={isVideoEnabled}
                  isAudioEnabled={isAudioEnabled}
                  onToggleVideo={handleToggleVideo}
                  onToggleAudio={handleToggleAudio}
                  onToggleScreenShare={handleToggleScreenShare}
                  isScreenSharing={isScreenSharing}
                  participantName={sessionData.candidate}
                  interviewerName={sessionData.interviewer}
                />
              </div>

              {/* Tools Panel */}
              <div className="flex-1 overflow-y-auto">
                <ToolsPanel
                  onOpenWhiteboard={handleOpenWhiteboard}
                  onToggleScreenShare={handleToggleScreenShare}
                  onOpenChallenges={handleOpenChallenges}
                  isScreenSharing={isScreenSharing}
                  sessionData={sessionData}
                />
              </div>
            </div>

            {/* Center Panel - Code Editor */}
            <div className="flex-1 p-4">
              <CodeEditor
                initialCode={code}
                language={language}
                theme={theme}
                onCodeChange={handleCodeChange}
                onLanguageChange={handleLanguageChange}
                onThemeChange={handleThemeChange}
                onRunCode={handleRunCode}
                isExecuting={isExecuting}
                executionResult={executionResult}
              />
            </div>

            {/* Right Panel - Chat */}
            <div className="w-80 p-4 border-l border-border bg-muted">
              <ChatPanel
                messages={messages}
                onSendMessage={handleSendMessage}
                currentUser={sessionData.interviewer}
                participantName={sessionData.candidate}
              />
            </div>
          </div>
        ) : (
          /* Mobile Layout */
          <div className="h-full pb-16">
            {activePanel === 'video' && (
              <div className="h-full p-4">
                <VideoPanel
                  isVideoEnabled={isVideoEnabled}
                  isAudioEnabled={isAudioEnabled}
                  onToggleVideo={handleToggleVideo}
                  onToggleAudio={handleToggleAudio}
                  onToggleScreenShare={handleToggleScreenShare}
                  isScreenSharing={isScreenSharing}
                  participantName={sessionData.candidate}
                  interviewerName={sessionData.interviewer}
                />
              </div>
            )}

            {activePanel === 'code' && (
              <div className="h-full p-4">
                <CodeEditor
                  initialCode={code}
                  language={language}
                  theme={theme}
                  onCodeChange={handleCodeChange}
                  onLanguageChange={handleLanguageChange}
                  onThemeChange={handleThemeChange}
                  onRunCode={handleRunCode}
                  isExecuting={isExecuting}
                  executionResult={executionResult}
                />
              </div>
            )}

            {activePanel === 'chat' && (
              <div className="h-full p-4">
                <ChatPanel
                  messages={messages}
                  onSendMessage={handleSendMessage}
                  currentUser={sessionData.interviewer}
                  participantName={sessionData.candidate}
                />
              </div>
            )}
          </div>
        )}

        {/* Mobile Navigation */}
        {isMobileView && renderMobileNavigation()}
      </div>

      {/* Whiteboard Modal */}
      <WhiteboardPanel
        isVisible={isWhiteboardOpen}
        onClose={handleCloseWhiteboard}
      />
    </div>
  );
};

export default LiveInterviewRoom;