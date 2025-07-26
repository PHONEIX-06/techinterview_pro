import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const VideoPanel = ({ 
  localStream = null, 
  remoteStream = null, 
  isVideoEnabled = true, 
  isAudioEnabled = true,
  onToggleVideo = () => {},
  onToggleAudio = () => {},
  onToggleScreenShare = () => {},
  isScreenSharing = false,
  participantName = "Sarah Johnson",
  interviewerName = "Mike Chen"
}) => {
  const [isPiPMode, setIsPiPMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  const togglePictureInPicture = () => {
    setIsPiPMode(!isPiPMode);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`bg-surface border border-border rounded-lg overflow-hidden ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'h-full'
      }`}
    >
      {/* Video Container */}
      <div className="relative h-full">
        {/* Main Video (Remote Participant) */}
        <div className="relative w-full h-full bg-gray-900">
          {remoteStream ? (
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
             
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-gray-800">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-3">
                  <Icon name="User" size={32} color="white" />
                </div>
                <p className="text-white font-medium">{participantName}</p>
                <p className="text-gray-300 text-sm">Camera is off</p>
              </div>
            </div>
          )}

          {/* Participant Name Overlay */}
          <div className="absolute bottom-4 left-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded-lg text-sm font-medium">
            {participantName}
          </div>

          {/* Connection Quality Indicator */}
          <div className="absolute top-4 left-4 flex items-center space-x-2">
            <div className="flex items-center space-x-1 bg-black bg-opacity-60 text-white px-2 py-1 rounded-lg text-xs">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span>HD</span>
            </div>
          </div>

          {/* Video Controls Overlay */}
          <div className="absolute bottom-4 right-4 flex items-center space-x-2">
            <button
              onClick={togglePictureInPicture}
              className="p-2 bg-black bg-opacity-60 text-white rounded-lg hover:bg-opacity-80 transition-all duration-200"
              title="Picture in Picture"
            >
              <Icon name="PictureInPicture" size={16} />
            </button>
            <button
              onClick={toggleFullscreen}
              className="p-2 bg-black bg-opacity-60 text-white rounded-lg hover:bg-opacity-80 transition-all duration-200"
              title="Fullscreen"
            >
              <Icon name={isFullscreen ? "Minimize" : "Maximize"} size={16} />
            </button>
          </div>
        </div>

        {/* Picture-in-Picture Local Video */}
        <div className={`absolute transition-all duration-300 ${
          isPiPMode 
            ? 'top-4 right-4 w-48 h-36' :'bottom-4 right-20 w-32 h-24'
        } bg-gray-900 border-2 border-white rounded-lg overflow-hidden shadow-lg`}>
          {localStream && isVideoEnabled ? (
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-gray-800">
              <div className="text-center">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mx-auto mb-1">
                  <Icon name="User" size={16} color="white" />
                </div>
                <p className="text-white text-xs font-medium">{interviewerName}</p>
              </div>
            </div>
          )}

          {/* Local Video Controls */}
          <div className="absolute bottom-1 left-1 right-1 flex items-center justify-center space-x-1">
            <button
              onClick={onToggleVideo}
              className={`p-1 rounded text-xs ${
                isVideoEnabled 
                  ? 'bg-black bg-opacity-60 text-white' :'bg-error text-error-foreground'
              }`}
              title={isVideoEnabled ? "Turn off camera" : "Turn on camera"}
            >
              <Icon name={isVideoEnabled ? "Video" : "VideoOff"} size={12} />
            </button>
            <button
              onClick={onToggleAudio}
              className={`p-1 rounded text-xs ${
                isAudioEnabled 
                  ? 'bg-black bg-opacity-60 text-white' :'bg-error text-error-foreground'
              }`}
              title={isAudioEnabled ? "Mute microphone" : "Unmute microphone"}
            >
              <Icon name={isAudioEnabled ? "Mic" : "MicOff"} size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Control Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
        <div className="flex items-center justify-center space-x-4">
          <Button
            variant={isAudioEnabled ? "outline" : "destructive"}
            size="sm"
            onClick={onToggleAudio}
            iconName={isAudioEnabled ? "Mic" : "MicOff"}
            className="bg-black bg-opacity-60 border-white border-opacity-30 text-white hover:bg-opacity-80"
          >
            {isAudioEnabled ? "Mute" : "Unmute"}
          </Button>

          <Button
            variant={isVideoEnabled ? "outline" : "destructive"}
            size="sm"
            onClick={onToggleVideo}
            iconName={isVideoEnabled ? "Video" : "VideoOff"}
            className="bg-black bg-opacity-60 border-white border-opacity-30 text-white hover:bg-opacity-80"
          >
            {isVideoEnabled ? "Stop Video" : "Start Video"}
          </Button>

          <Button
            variant={isScreenSharing ? "success" : "outline"}
            size="sm"
            onClick={onToggleScreenShare}
            iconName="Monitor"
            className="bg-black bg-opacity-60 border-white border-opacity-30 text-white hover:bg-opacity-80"
          >
            {isScreenSharing ? "Stop Sharing" : "Share Screen"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VideoPanel;