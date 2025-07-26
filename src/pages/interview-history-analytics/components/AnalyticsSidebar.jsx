import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import Icon from '../../../components/AppIcon';

const AnalyticsSidebar = ({ analyticsData }) => {
  const COLORS = ['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  const StatCard = ({ title, value, change, icon, color = 'text-primary' }) => (
    <div className="bg-card rounded-lg border border-border p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-text-secondary">{title}</p>
          <p className="text-2xl font-semibold text-text-primary">{value}</p>
          {change && (
            <p className={`text-xs flex items-center space-x-1 mt-1 ${
              change.type === 'increase' ? 'text-success' : 'text-error'
            }`}>
              <Icon name={change.type === 'increase' ? 'TrendingUp' : 'TrendingDown'} size={12} />
              <span>{change.value}</span>
            </p>
          )}
        </div>
        <div className={`p-2 rounded-lg bg-opacity-10 ${color}`}>
          <Icon name={icon} size={20} className={color} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-text-primary">Key Metrics</h3>
        
        <StatCard
          title="Total Interviews"
          value={analyticsData.totalInterviews}
          change={{ type: 'increase', value: '+12% this month' }}
          icon="Users"
          color="text-primary"
        />
        
        <StatCard
          title="Success Rate"
          value={`${analyticsData.successRate}%`}
          change={{ type: 'increase', value: '+5% this month' }}
          icon="TrendingUp"
          color="text-success"
        />
        
        <StatCard
          title="Avg Rating"
          value={analyticsData.averageRating.toFixed(1)}
          change={{ type: 'increase', value: '+0.3 this month' }}
          icon="Star"
          color="text-warning"
        />
        
        <StatCard
          title="Avg Duration"
          value={`${analyticsData.averageDuration}m`}
          icon="Clock"
          color="text-secondary"
        />
      </div>

      {/* Success Rate Trend */}
      <div className="bg-card rounded-lg border border-border p-4">
        <h4 className="text-sm font-medium text-text-primary mb-4">Success Rate Trend</h4>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={analyticsData.successTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12, fill: '#64748B' }}
                axisLine={{ stroke: '#E2E8F0' }}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#64748B' }}
                axisLine={{ stroke: '#E2E8F0' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#FFFFFF', 
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="rate" 
                stroke="#2563EB" 
                strokeWidth={2}
                dot={{ fill: '#2563EB', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="bg-card rounded-lg border border-border p-4">
        <h4 className="text-sm font-medium text-text-primary mb-4">Rating Distribution</h4>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analyticsData.ratingDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis 
                dataKey="rating" 
                tick={{ fontSize: 12, fill: '#64748B' }}
                axisLine={{ stroke: '#E2E8F0' }}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#64748B' }}
                axisLine={{ stroke: '#E2E8F0' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#FFFFFF', 
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
              <Bar dataKey="count" fill="#2563EB" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Programming Languages */}
      <div className="bg-card rounded-lg border border-border p-4">
        <h4 className="text-sm font-medium text-text-primary mb-4">Most Used Languages</h4>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={analyticsData.languageUsage}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="count"
              >
                {analyticsData.languageUsage.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#FFFFFF', 
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 space-y-2">
          {analyticsData.languageUsage.map((lang, index) => (
            <div key={lang.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-text-primary">{lang.name}</span>
              </div>
              <span className="text-text-secondary">{lang.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Interview Performance */}
      <div className="bg-card rounded-lg border border-border p-4">
        <h4 className="text-sm font-medium text-text-primary mb-4">Performance Metrics</h4>
        <div className="space-y-4">
          {analyticsData.performanceMetrics.map((metric) => (
            <div key={metric.name}>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-text-primary">{metric.name}</span>
                <span className="text-text-secondary">{metric.value}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${metric.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-card rounded-lg border border-border p-4">
        <h4 className="text-sm font-medium text-text-primary mb-4">Recent Activity</h4>
        <div className="space-y-3">
          {analyticsData.recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className={`p-1 rounded-full ${
                activity.type === 'interview' ? 'bg-primary/10' :
                activity.type === 'rating' ? 'bg-warning/10' : 'bg-success/10'
              }`}>
                <Icon 
                  name={
                    activity.type === 'interview' ? 'Video' :
                    activity.type === 'rating' ? 'Star' : 'CheckCircle'
                  } 
                  size={12} 
                  className={
                    activity.type === 'interview' ? 'text-primary' :
                    activity.type === 'rating' ? 'text-warning' : 'text-success'
                  }
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-text-primary">{activity.description}</p>
                <p className="text-xs text-text-secondary">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsSidebar;