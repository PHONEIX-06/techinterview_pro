import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import MetricsCard from './components/MetricsCard';
import RecentInterviewsTable from './components/RecentInterviewsTable';
import QuickActionsWidget from './components/QuickActionsWidget';
import UpcomingInterviewTimer from './components/UpcomingInterviewTimer';
import InterviewCalendarWidget from './components/InterviewCalendarWidget';
import ActivityFeed from './components/ActivityFeed';
import interviewService from '../../utils/interviewService';

const Dashboard = () => {
  const { user, userProfile, loading: authLoading } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    metrics: {
      upcomingCount: 0,
      completedCount: 0,
      averageRating: '0.0',
      successRate: 0
    },
    interviews: [],
    upcomingInterviews: [],
    nextInterview: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadDashboardData = async () => {
      if (!user?.id || !userProfile?.role) return;

      try {
        setLoading(true);
        setError(null);

        // Load dashboard data in parallel
        const [metricsResult, interviewsResult, upcomingResult] = await Promise.all([
          interviewService.getInterviewMetrics(user.id, userProfile.role),
          interviewService.getInterviews({ limit: 10 }),
          interviewService.getUpcomingInterviews(5)
        ]);

        if (isMounted) {
          // Update metrics
          if (metricsResult?.success) {
            const metricsData = metricsResult.data;
            setDashboardData(prev => ({
              ...prev,
              metrics: {
                upcomingCount: metricsData.upcomingCount,
                completedCount: metricsData.completedCount,
                averageRating: metricsData.averageRating || '0.0',
                successRate: metricsData.successRate
              }
            }));
          }

          // Update interviews list
          if (interviewsResult?.success) {
            setDashboardData(prev => ({
              ...prev,
              interviews: interviewsResult.data || []
            }));
          }

          // Update upcoming interviews and next interview
          if (upcomingResult?.success) {
            const upcomingInterviews = upcomingResult.data || [];
            setDashboardData(prev => ({
              ...prev,
              upcomingInterviews,
              nextInterview: upcomingInterviews.length > 0 ? upcomingInterviews[0] : null
            }));
          }
        }
      } catch (error) {
        if (isMounted) {
          setError('Failed to load dashboard data. Please try again.');
          console.log('Dashboard error:', error);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (!authLoading && user && userProfile) {
      loadDashboardData();
    }

    return () => {
      isMounted = false;
    };
  }, [user, userProfile, authLoading]);

  // Format metrics for display
  const metricsData = [
    {
      title: 'Upcoming Interviews',
      value: dashboardData.metrics.upcomingCount.toString(),
      change: '+' + Math.max(0, dashboardData.metrics.upcomingCount - 10),
      changeType: 'positive',
      icon: 'Calendar',
      color: 'primary'
    },
    {
      title: 'Completed Sessions',
      value: dashboardData.metrics.completedCount.toString(),
      change: '+' + Math.max(0, dashboardData.metrics.completedCount - 75),
      changeType: 'positive',
      icon: 'CheckCircle',
      color: 'success'
    },
    {
      title: 'Average Rating',
      value: dashboardData.metrics.averageRating,
      change: '+0.2',
      changeType: 'positive',
      icon: 'Star',
      color: 'warning'
    },
    {
      title: 'Success Rate',
      value: dashboardData.metrics.successRate + '%',
      change: '+5%',
      changeType: 'positive',
      icon: 'TrendingUp',
      color: 'success'
    }
  ];

  // Generate mock activities (in a real app, this would come from an analytics table)
  const recentActivities = [
    {
      id: 1,
      type: 'interview_completed',
      user: userProfile?.full_name || 'Unknown User',
      action: userProfile?.role === 'interviewer' ? 'completed interview with' : 'completed interview session',
      target: userProfile?.role === 'interviewer' ? 'Sarah Johnson' : 'with Mike Chen',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      description: 'Senior Frontend Developer position',
      metadata: {
        position: 'Senior Frontend Developer',
        duration: '45 minutes',
        rating: 4.5
      }
    },
    {
      id: 2,
      type: 'interview_scheduled',
      user: userProfile?.full_name || 'Unknown User',
      action: userProfile?.role === 'interviewer' ? 'scheduled interview with' : 'scheduled interview session',
      target: userProfile?.role === 'interviewer' ? 'Alex Rodriguez' : 'with Emily Davis',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      description: 'Full Stack Engineer position for tomorrow',
      metadata: {
        position: 'Full Stack Engineer'
      }
    }
  ];

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-16">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-text-secondary">Loading dashboard...</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-16">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <p className="text-error mb-4">{error}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="text-primary hover:text-primary-foreground transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Breadcrumb />
          
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              Welcome back, {userProfile?.full_name || 'User'}! 👋
            </h1>
            <p className="text-text-secondary">
              Here's what's happening with your interviews today.
            </p>
          </div>

          {/* Metrics Cards - Full Width */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {metricsData.map((metric, index) => (
              <MetricsCard
                key={index}
                title={metric.title}
                value={metric.value}
                change={metric.change}
                changeType={metric.changeType}
                icon={metric.icon}
                color={metric.color}
              />
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
            {/* Left Panel - Recent Interviews Table */}
            <div className="lg:col-span-8">
              <RecentInterviewsTable interviews={dashboardData.interviews} />
            </div>

            {/* Right Panel - Quick Actions & Timer */}
            <div className="lg:col-span-4 space-y-6">
              <QuickActionsWidget />
              {dashboardData.nextInterview && (
                <UpcomingInterviewTimer nextInterview={dashboardData.nextInterview} />
              )}
            </div>
          </div>

          {/* Bottom Section - Calendar & Activity Feed */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <InterviewCalendarWidget interviews={dashboardData.upcomingInterviews} />
            <ActivityFeed activities={recentActivities} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;