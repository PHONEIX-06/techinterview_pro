import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ChatPanel = ({ 
  messages = [],
  onSendMessage = () => {},
  currentUser = "Mike Chen",
  participantName = "Sarah Johnson"
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const mockMessages = [
    {
      id: 1,
      sender: "Mike Chen",
      message: "Hi Sarah! Welcome to the interview. Are you ready to start?",
      timestamp: new Date(Date.now() - 300000),
      type: "text"
    },
    {
      id: 2,
      sender: "Sarah Johnson",
      message: "Yes, I'm ready! Thank you for having me.",
      timestamp: new Date(Date.now() - 280000),
      type: "text"
    },
    {
      id: 3,
      sender: "Mike Chen",
      message: "Great! Let\'s start with a coding challenge. I\'ll share the problem statement in the editor.",
      timestamp: new Date(Date.now() - 260000),
      type: "text"
    },
    {
      id: 4,
      sender: "Sarah Johnson",
      message: "Perfect, I can see it now. Should I start coding right away?",
      timestamp: new Date(Date.now() - 240000),
      type: "text"
    },
    {
      id: 5,
      sender: "Mike Chen",
      message: "Yes, please go ahead. Feel free to think out loud as you work through the problem.",
      timestamp: new Date(Date.now() - 220000),
      type: "text"
    },
    {
      id: 6,
      sender: "Sarah Johnson",
      message: "algorithm_solution.py",
      timestamp: new Date(Date.now() - 180000),
      type: "file",
      fileName: "algorithm_solution.py",
      fileSize: "2.4 KB"
    },
    {
      id: 7,
      sender: "Mike Chen",
      message: "Thanks for sharing that! Let me review your approach.",
      timestamp: new Date(Date.now() - 120000),
      type: "text"
    }
  ];

  const allMessages = messages.length > 0 ? messages : mockMessages;

  useEffect(() => {
    scrollToBottom();
  }, [allMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const message = {
        id: Date.now(),
        sender: currentUser,
        message: newMessage.trim(),
        timestamp: new Date(),
        type: "text"
      };
      onSendMessage(message);
      setNewMessage('');
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const message = {
        id: Date.now(),
        sender: currentUser,
        message: file.name,
        timestamp: new Date(),
        type: "file",
        fileName: file.name,
        fileSize: formatFileSize(file.size)
      };
      onSendMessage(message);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatTime = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  const isCurrentUser = (sender) => sender === currentUser;

  return (
    <div className="flex flex-col h-full bg-surface border border-border rounded-lg overflow-hidden">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-muted">
        <div className="flex items-center space-x-2">
          <Icon name="MessageCircle" size={20} className="text-primary" />
          <h3 className="font-semibold text-text-primary">Chat</h3>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-success rounded-full"></div>
            <span className="text-xs text-text-secondary">2 participants</span>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {allMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${isCurrentUser(msg.sender) ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-xs lg:max-w-md ${isCurrentUser(msg.sender) ? 'order-2' : 'order-1'}`}>
              {/* Sender Name & Time */}
              <div className={`flex items-center space-x-2 mb-1 ${
                isCurrentUser(msg.sender) ? 'justify-end' : 'justify-start'
              }`}>
                <span className="text-xs font-medium text-text-secondary">
                  {isCurrentUser(msg.sender) ? 'You' : msg.sender}
                </span>
                <span className="text-xs text-text-secondary">
                  {formatTime(msg.timestamp)}
                </span>
              </div>

              {/* Message Content */}
              {msg.type === 'file' ? (
                <div className={`p-3 rounded-lg border ${
                  isCurrentUser(msg.sender)
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-muted text-text-primary border-border'
                }`}>
                  <div className="flex items-center space-x-2">
                    <Icon name="Paperclip" size={16} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{msg.fileName}</p>
                      <p className="text-xs opacity-75">{msg.fileSize}</p>
                    </div>
                    <button className="p-1 hover:bg-black hover:bg-opacity-10 rounded">
                      <Icon name="Download" size={14} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className={`p-3 rounded-lg ${
                  isCurrentUser(msg.sender)
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-text-primary'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                </div>
              )}
            </div>

            {/* Avatar */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
              isCurrentUser(msg.sender) ? 'order-1 ml-2 bg-primary text-primary-foreground' : 'order-2 mr-2 bg-secondary text-secondary-foreground'
            }`}>
              {msg.sender.split(' ').map(n => n[0]).join('').toUpperCase()}
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-center space-x-2 bg-muted p-3 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-text-secondary rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-text-secondary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-text-secondary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <span className="text-xs text-text-secondary">{participantName} is typing...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-border bg-muted">
        <form onSubmit={handleSendMessage} className="flex items-end space-x-2">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="resize-none"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileUpload}
              className="hidden"
              accept=".pdf,.doc,.docx,.txt,.py,.js,.jsx,.ts,.tsx,.java,.cpp,.c"
            />
            
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              iconName="Paperclip"
              className="shrink-0"
            />
            
            <Button
              type="submit"
              variant="default"
              size="sm"
              disabled={!newMessage.trim()}
              iconName="Send"
              className="shrink-0"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatPanel;