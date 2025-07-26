import React from 'react';
import { Helmet } from 'react-helmet';
import AuthForm from './components/AuthForm';
import AuthBenefits from './components/AuthBenefits';
import Icon from '../../components/AppIcon';

const LoginRegister = () => {
  return (
    <>
      <Helmet>
        <title>Sign In - TechInterview Pro</title>
        <meta name="description" content="Sign in to TechInterview Pro - The complete platform for conducting professional technical interviews with real-time collaboration." />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Mobile Header */}
        <div className="lg:hidden bg-surface border-b border-border p-4">
          <div className="flex items-center justify-center space-x-2">
            <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
              <Icon name="Code2" size={20} color="white" />
            </div>
            <span className="text-xl font-semibold text-text-primary">TechInterview Pro</span>
          </div>
        </div>

        <div className="flex min-h-screen lg:min-h-screen">
          {/* Left Panel - Auth Form */}
          <div className="w-full lg:w-3/5 flex items-center justify-center p-6 lg:p-12">
            <div className="w-full max-w-md">
              {/* Desktop Logo */}
              <div className="hidden lg:flex items-center justify-center space-x-2 mb-8">
                <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
                  <Icon name="Code2" size={24} color="white" />
                </div>
                <span className="text-2xl font-semibold text-text-primary">TechInterview Pro</span>
              </div>

              <AuthForm />
            </div>
          </div>

          {/* Right Panel - Benefits (Desktop/Tablet Only) */}
          <div className="hidden lg:block w-2/5 bg-muted border-l border-border">
            <AuthBenefits />
          </div>
        </div>

        {/* Mobile Benefits Section */}
        <div className="lg:hidden bg-muted border-t border-border">
          <div className="p-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-text-primary mb-2">
                Why Choose TechInterview Pro?
              </h2>
              <p className="text-text-secondary">
                The complete platform for technical interviews
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-surface rounded-lg">
                <div className="flex items-center justify-center w-10 h-10 bg-primary bg-opacity-10 rounded-lg">
                  <Icon name="Video" size={20} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-text-primary text-sm">Live Video</h3>
                  <p className="text-xs text-text-secondary">HD quality interviews</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-surface rounded-lg">
                <div className="flex items-center justify-center w-10 h-10 bg-primary bg-opacity-10 rounded-lg">
                  <Icon name="Code2" size={20} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-text-primary text-sm">Real-time Coding</h3>
                  <p className="text-xs text-text-secondary">Collaborative editor</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-surface rounded-lg">
                <div className="flex items-center justify-center w-10 h-10 bg-primary bg-opacity-10 rounded-lg">
                  <Icon name="Calendar" size={20} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-text-primary text-sm">Smart Scheduling</h3>
                  <p className="text-xs text-text-secondary">Automated booking</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-surface rounded-lg">
                <div className="flex items-center justify-center w-10 h-10 bg-primary bg-opacity-10 rounded-lg">
                  <Icon name="BarChart3" size={20} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-text-primary text-sm">Analytics</h3>
                  <p className="text-xs text-text-secondary">Performance tracking</p>
                </div>
              </div>
            </div>

            {/* Mobile Stats */}
            <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-border">
              <div className="text-center">
                <div className="text-xl font-bold text-primary">10,000+</div>
                <div className="text-xs text-text-secondary">Interviews</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-primary">500+</div>
                <div className="text-xs text-text-secondary">Companies</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-surface border-t border-border py-6">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-4 text-xs text-text-secondary">
                <span>&copy; {new Date().getFullYear()} TechInterview Pro. All rights reserved.</span>
              </div>
              <div className="flex items-center space-x-6 text-xs text-text-secondary">
                <a href="#" className="hover:text-text-primary transition-colors duration-200">Privacy Policy</a>
                <a href="#" className="hover:text-text-primary transition-colors duration-200">Terms of Service</a>
                <a href="#" className="hover:text-text-primary transition-colors duration-200">Support</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default LoginRegister;