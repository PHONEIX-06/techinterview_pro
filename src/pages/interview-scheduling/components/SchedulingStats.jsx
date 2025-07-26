import React from 'react';
import Icon from '../../../components/AppIcon';

const SchedulingStats = () => {
  const stats = [
    {
      id: 1,
      label: 'Scheduled This Week',
      value: '12',
      change: '+3',
      changeType: 'increase',
      icon: 'Calendar',
      color: 'primary'
    },
    {
      id: 2,
      label: 'Pending Confirmations',
      value: '5',
      change: '-2',
      changeType: 'decrease',
      icon: 'Clock',
      color: 'warning'
    },
    {
      id: 3,
      label: 'Completed Today',
      value: '3',
      change: '+1',
      changeType: 'increase',
      icon: 'CheckCircle',
      color: 'success'
    },
    {
      id: 4,
      label: 'Average Duration',
      value: '58m',
      change: '+5m',
      changeType: 'increase',
      icon: 'Timer',
      color: 'accent'
    }
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      primary: 'bg-primary bg-opacity-10 text-primary',
      warning: 'bg-warning bg-opacity-10 text-warning',
      success: 'bg-success bg-opacity-10 text-success',
      accent: 'bg-accent bg-opacity-10 text-accent'
    };
    return colorMap[color] || colorMap.primary;
  };

  const getChangeColor = (changeType) => {
    return changeType === 'increase' ? 'text-success' : 'text-error';
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map(stat => (
        <div key={stat.id} className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-center justify-between mb-3">
            <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${getColorClasses(stat.color)}`}>
              <Icon name={stat.icon} size={20} />
            </div>
            <span className={`text-xs font-medium ${getChangeColor(stat.changeType)}`}>
              {stat.change}
            </span>
          </div>
          
          <div>
            <p className="text-2xl font-bold text-text-primary mb-1">{stat.value}</p>
            <p className="text-sm text-text-secondary">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SchedulingStats;