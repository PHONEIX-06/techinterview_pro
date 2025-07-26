import React, { useState } from 'react';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Icon from '../../components/AppIcon';
import PersonalInfoTab from './components/PersonalInfoTab';
import InterviewPreferencesTab from './components/InterviewPreferencesTab';
import AccountSecurityTab from './components/AccountSecurityTab';
import IntegrationSettingsTab from './components/IntegrationSettingsTab';

const UserProfileSettings = () => {
  const [activeTab, setActiveTab] = useState('personal');

  const tabs = [
    {
      id: 'personal',
      label: 'Personal Information',
      icon: 'User',
      component: PersonalInfoTab
    },
    {
      id: 'preferences',
      label: 'Interview Preferences',
      icon: 'Settings',
      component: InterviewPreferencesTab
    },
    {
      id: 'security',
      label: 'Account Security',
      icon: 'Shield',
      component: AccountSecurityTab
    },
    {
      id: 'integrations',
      label: 'Integration Settings',
      icon: 'Link',
      component: IntegrationSettingsTab
    }
  ];

  const breadcrumbItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Profile Settings', path: '/user-profile-settings', current: true }
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Breadcrumb items={breadcrumbItems} />
          
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
                <Icon name="Settings" size={24} color="white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-text-primary">Profile & Settings</h1>
                <p className="text-text-secondary">
                  Manage your personal information, interview preferences, and account settings
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-lg border border-border p-4 sticky top-24">
                <nav className="space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-primary text-primary-foreground shadow-elevation-1'
                          : 'text-text-secondary hover:text-text-primary hover:bg-muted'
                      }`}
                    >
                      <Icon 
                        name={tab.icon} 
                        size={18} 
                        color={activeTab === tab.id ? 'white' : 'currentColor'} 
                      />
                      <span className="text-sm font-medium">{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-card rounded-lg border border-border">
                {/* Tab Header */}
                <div className="px-6 py-4 border-b border-border">
                  <div className="flex items-center space-x-3">
                    <Icon 
                      name={tabs.find(tab => tab.id === activeTab)?.icon} 
                      size={20} 
                      className="text-primary" 
                    />
                    <h2 className="text-xl font-semibold text-text-primary">
                      {tabs.find(tab => tab.id === activeTab)?.label}
                    </h2>
                  </div>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                  {ActiveComponent && <ActiveComponent />}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Tab Navigation */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-border p-4 z-40">
            <div className="flex items-center justify-between space-x-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-primary text-primary-foreground'
                      : 'text-text-secondary hover:text-text-primary hover:bg-muted'
                  }`}
                >
                  <Icon 
                    name={tab.icon} 
                    size={16} 
                    color={activeTab === tab.id ? 'white' : 'currentColor'} 
                  />
                  <span className="text-xs font-medium text-center leading-tight">
                    {tab.label.split(' ')[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Content Padding */}
          <div className="lg:hidden h-20"></div>
        </div>
      </main>
    </div>
  );
};

export default UserProfileSettings;