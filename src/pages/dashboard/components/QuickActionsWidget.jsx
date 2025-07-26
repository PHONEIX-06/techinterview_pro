import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActionsWidget = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: 'Schedule Interview',
      description: 'Set up a new technical interview session',
      icon: 'Calendar',
      color: 'primary',
      action: () => navigate('/interview-scheduling')
    },
    {
      title: 'Join Interview',
      description: 'Enter an ongoing interview room',
      icon: 'Video',
      color: 'success',
      action: () => navigate('/live-interview-room')
    },
    {
      title: 'Browse Templates',
      description: 'Explore coding challenge templates',
      icon: 'FileText',
      color: 'secondary',
      action: () => console.log('Browse templates clicked')
    }
  ];

  const getColorClasses = (color) => {
    switch (color) {
      case 'success':
        return 'bg-success hover:bg-success/90 text-success-foreground';
      case 'secondary':
        return 'bg-secondary hover:bg-secondary/90 text-secondary-foreground';
      default:
        return 'bg-primary hover:bg-primary/90 text-primary-foreground';
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border shadow-sm p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Icon name="Zap" size={20} className="text-primary" />
        <h3 className="text-lg font-semibold text-text-primary">Quick Actions</h3>
      </div>

      <div className="space-y-4">
        {quickActions.map((action, index) => (
          <button
            key={index}
            onClick={action.action}
            className={`w-full p-4 rounded-lg transition-all duration-200 text-left group ${getColorClasses(action.color)}`}
          >
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <Icon name={action.icon} size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium mb-1">{action.title}</h4>
                <p className="text-sm opacity-90">{action.description}</p>
              </div>
              <Icon name="ChevronRight" size={16} className="opacity-60 group-hover:opacity-100 transition-opacity" />
            </div>
          </button>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-border">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-text-primary">Recent Activity</h4>
          <Button variant="ghost" size="sm" iconName="MoreHorizontal" />
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center space-x-3 text-sm">
            <div className="w-2 h-2 bg-success rounded-full"></div>
            <span className="text-text-secondary">Interview completed with Sarah Johnson</span>
            <span className="text-text-secondary text-xs ml-auto">2h ago</span>
          </div>
          <div className="flex items-center space-x-3 text-sm">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <span className="text-text-secondary">New interview scheduled for tomorrow</span>
            <span className="text-text-secondary text-xs ml-auto">4h ago</span>
          </div>
          <div className="flex items-center space-x-3 text-sm">
            <div className="w-2 h-2 bg-warning rounded-full"></div>
            <span className="text-text-secondary">Feedback submitted for Mike Chen</span>
            <span className="text-text-secondary text-xs ml-auto">1d ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActionsWidget;