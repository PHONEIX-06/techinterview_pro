import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const AuthBenefits = () => {
  const benefits = [
    {
      icon: 'Video',
      title: 'Live Video Interviews',
      description: 'Conduct seamless video interviews with HD quality and real-time communication.'
    },
    {
      icon: 'Code2',
      title: 'Collaborative Coding',
      description: 'Real-time code editor with syntax highlighting and live collaboration features.'
    },
    {
      icon: 'Calendar',
      title: 'Smart Scheduling',
      description: 'Automated interview scheduling with calendar integration and reminders.'
    },
    {
      icon: 'BarChart3',
      title: 'Advanced Analytics',
      description: 'Comprehensive interview analytics and performance tracking dashboard.'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Senior Engineering Manager',
      company: 'TechCorp',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face',
      quote: `TechInterview Pro has revolutionized our hiring process. The collaborative coding environment feels natural and helps us assess candidates effectively.`
    },
    {
      name: 'Michael Rodriguez',
      role: 'Full Stack Developer',
      company: 'StartupXYZ',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face',
      quote: `As a candidate, the platform made me feel comfortable during interviews. The interface is intuitive and the video quality is excellent.`
    }
  ];

  const stats = [
    { value: '10,000+', label: 'Interviews Conducted' },
    { value: '500+', label: 'Companies Trust Us' },
    { value: '98%', label: 'User Satisfaction' },
    { value: '50%', label: 'Faster Hiring Process' }
  ];

  return (
    <div className="h-full flex flex-col justify-center space-y-8 p-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-text-primary mb-4">
          Streamline Your Technical Interviews
        </h2>
        <p className="text-lg text-text-secondary">
          The complete platform for conducting professional technical interviews with real-time collaboration.
        </p>
      </div>

      {/* Benefits Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {benefits.map((benefit, index) => (
          <div key={index} className="flex items-start space-x-4">
            <div className="flex items-center justify-center w-12 h-12 bg-primary bg-opacity-10 rounded-lg flex-shrink-0">
              <Icon name={benefit.icon} size={24} className="text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-text-primary mb-1">{benefit.title}</h3>
              <p className="text-sm text-text-secondary">{benefit.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 py-6 border-t border-b border-border">
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            <div className="text-2xl font-bold text-primary mb-1">{stat.value}</div>
            <div className="text-xs text-text-secondary">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Testimonials */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-text-primary text-center">
          Trusted by Industry Leaders
        </h3>
        <div className="space-y-4">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-muted rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Image
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1">
                  <p className="text-sm text-text-secondary mb-2 italic">
                    "{testimonial.quote}"
                  </p>
                  <div>
                    <p className="text-sm font-medium text-text-primary">{testimonial.name}</p>
                    <p className="text-xs text-text-secondary">
                      {testimonial.role} at {testimonial.company}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Demo Video Placeholder */}
      <div className="bg-muted rounded-lg p-6 text-center">
        <div className="flex items-center justify-center w-16 h-16 bg-primary bg-opacity-10 rounded-full mx-auto mb-4">
          <Icon name="Play" size={32} className="text-primary" />
        </div>
        <h4 className="font-semibold text-text-primary mb-2">Watch Demo</h4>
        <p className="text-sm text-text-secondary">
          See how TechInterview Pro transforms your hiring process in just 2 minutes.
        </p>
      </div>

      {/* Security Badge */}
      <div className="flex items-center justify-center space-x-4 text-xs text-text-secondary">
        <div className="flex items-center space-x-1">
          <Icon name="Shield" size={16} className="text-success" />
          <span>SSL Secured</span>
        </div>
        <div className="flex items-center space-x-1">
          <Icon name="Lock" size={16} className="text-success" />
          <span>GDPR Compliant</span>
        </div>
        <div className="flex items-center space-x-1">
          <Icon name="CheckCircle" size={16} className="text-success" />
          <span>SOC 2 Certified</span>
        </div>
      </div>
    </div>
  );
};

export default AuthBenefits;