import React from 'react';
import Icon from '../../../components/AppIcon';

const ActivityFeed = ({ activities = [] }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'interview_completed':
        return { name: 'CheckCircle', color: 'text-success' };
      case 'interview_scheduled':
        return { name: 'Calendar', color: 'text-primary' };
      case 'feedback_submitted':
        return { name: 'MessageSquare', color: 'text-warning' };
      case 'interview_cancelled':
        return { name: 'XCircle', color: 'text-error' };
      case 'template_created':
        return { name: 'FileText', color: 'text-secondary' };
      case 'user_joined':
        return { name: 'UserPlus', color: 'text-success' };
      default:
        return { name: 'Activity', color: 'text-text-secondary' };
    }
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const activityDate = new Date(date);
    const diffInSeconds = Math.floor((now - activityDate) / 1000);

    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes}m ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours}h ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days}d ago`;
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border shadow-sm p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Icon name="Activity" size={20} className="text-primary" />
        <h3 className="text-lg font-semibold text-text-primary">Recent Activity</h3>
      </div>

      {activities.length > 0 ? (
        <div className="space-y-4">
          {activities.map((activity, index) => {
            const iconConfig = getActivityIcon(activity.type);
            return (
              <div key={activity.id || index} className="flex items-start space-x-3">
                <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-opacity-10 flex items-center justify-center ${
                  iconConfig.color === 'text-success' ? 'bg-success' :
                  iconConfig.color === 'text-primary' ? 'bg-primary' :
                  iconConfig.color === 'text-warning' ? 'bg-warning' :
                  iconConfig.color === 'text-error' ? 'bg-error' :
                  iconConfig.color === 'text-secondary' ? 'bg-secondary' : 'bg-muted'
                }`}>
                  <Icon name={iconConfig.name} size={16} className={iconConfig.color} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-text-primary">
                      <span className="font-medium">{activity.user}</span>
                      <span className="ml-1">{activity.action}</span>
                      {activity.target && (
                        <span className="font-medium ml-1">{activity.target}</span>
                      )}
                    </p>
                    <span className="text-xs text-text-secondary flex-shrink-0 ml-2">
                      {formatTimeAgo(activity.timestamp)}
                    </span>
                  </div>
                  
                  {activity.description && (
                    <p className="text-xs text-text-secondary mt-1">
                      {activity.description}
                    </p>
                  )}
                  
                  {activity.metadata && (
                    <div className="mt-2 p-2 bg-muted rounded-md">
                      <div className="flex items-center space-x-2 text-xs text-text-secondary">
                        {activity.metadata.position && (
                          <span>Position: {activity.metadata.position}</span>
                        )}
                        {activity.metadata.duration && (
                          <span>Duration: {activity.metadata.duration}</span>
                        )}
                        {activity.metadata.rating && (
                          <div className="flex items-center space-x-1">
                            <Icon name="Star" size={12} className="text-warning" />
                            <span>{activity.metadata.rating}/5</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8">
          <Icon name="Activity" size={48} className="text-text-secondary mx-auto mb-4" />
          <h4 className="font-medium text-text-primary mb-2">No recent activity</h4>
          <p className="text-sm text-text-secondary">
            Your recent interview activities will appear here.
          </p>
        </div>
      )}

      {activities.length > 0 && (
        <div className="mt-6 pt-4 border-t border-border">
          <button className="w-full text-sm text-primary hover:text-primary/80 font-medium transition-colors duration-200">
            View all activity
          </button>
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;