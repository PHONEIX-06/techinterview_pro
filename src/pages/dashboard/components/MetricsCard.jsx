import React from 'react';
import Icon from '../../../components/AppIcon';

const MetricsCard = ({ title, value, change, changeType, icon, color = 'primary' }) => {
  const getColorClasses = () => {
    switch (color) {
      case 'success':
        return 'bg-success bg-opacity-10 text-success';
      case 'warning':
        return 'bg-warning bg-opacity-10 text-warning';
      case 'error':
        return 'bg-error bg-opacity-10 text-error';
      default:
        return 'bg-primary bg-opacity-10 text-primary';
    }
  };

  const getChangeColor = () => {
    return changeType === 'positive' ? 'text-success' : 'text-error';
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-text-secondary mb-1">{title}</p>
          <p className="text-2xl font-bold text-text-primary mb-2">{value}</p>
          {change && (
            <div className="flex items-center space-x-1">
              <Icon 
                name={changeType === 'positive' ? 'TrendingUp' : 'TrendingDown'} 
                size={16} 
                className={getChangeColor()} 
              />
              <span className={`text-sm font-medium ${getChangeColor()}`}>
                {change}
              </span>
              <span className="text-sm text-text-secondary">vs last month</span>
            </div>
          )}
        </div>
        <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${getColorClasses()}`}>
          <Icon name={icon} size={24} />
        </div>
      </div>
    </div>
  );
};

export default MetricsCard;