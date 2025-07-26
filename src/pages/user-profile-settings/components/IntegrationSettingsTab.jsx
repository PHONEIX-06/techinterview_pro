import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const IntegrationSettingsTab = () => {
  const [calendarIntegrations, setCalendarIntegrations] = useState([
    {
      id: "google-calendar",
      name: "Google Calendar",
      connected: true,
      email: "john.doe@gmail.com",
      syncEnabled: true,
      lastSync: "2025-01-26T19:30:00Z"
    },
    {
      id: "outlook",
      name: "Microsoft Outlook",
      connected: false,
      email: null,
      syncEnabled: false,
      lastSync: null
    }
  ]);

  const [webhookSettings, setWebhookSettings] = useState({
    enabled: false,
    url: "",
    events: {
      interviewScheduled: true,
      interviewStarted: false,
      interviewCompleted: true,
      interviewCancelled: true,
      candidateJoined: false,
      interviewerJoined: false
    },
    secret: "wh_secret_abc123xyz789"
  });

  const [apiKeys, setApiKeys] = useState([
    {
      id: "api-key-1",
      name: "Production API Key",
      key: "tip_live_abc123...xyz789",
      created: "2025-01-15T10:00:00Z",
      lastUsed: "2025-01-26T18:45:00Z",
      permissions: ["read", "write"]
    },
    {
      id: "api-key-2",
      name: "Development API Key",
      key: "tip_test_def456...uvw012",
      created: "2025-01-20T14:30:00Z",
      lastUsed: "2025-01-25T16:20:00Z",
      permissions: ["read"]
    }
  ]);

  const [showNewApiKeyForm, setShowNewApiKeyForm] = useState(false);
  const [newApiKeyData, setNewApiKeyData] = useState({
    name: "",
    permissions: []
  });

  const eventOptions = [
    { value: "interviewScheduled", label: "Interview Scheduled" },
    { value: "interviewStarted", label: "Interview Started" },
    { value: "interviewCompleted", label: "Interview Completed" },
    { value: "interviewCancelled", label: "Interview Cancelled" },
    { value: "candidateJoined", label: "Candidate Joined" },
    { value: "interviewerJoined", label: "Interviewer Joined" }
  ];

  const permissionOptions = [
    { value: "read", label: "Read Access" },
    { value: "write", label: "Write Access" },
    { value: "admin", label: "Admin Access" }
  ];

  const handleCalendarToggle = (integrationId) => {
    setCalendarIntegrations(prev =>
      prev.map(integration =>
        integration.id === integrationId
          ? { ...integration, connected: !integration.connected }
          : integration
      )
    );
  };

  const handleSyncToggle = (integrationId) => {
    setCalendarIntegrations(prev =>
      prev.map(integration =>
        integration.id === integrationId
          ? { ...integration, syncEnabled: !integration.syncEnabled }
          : integration
      )
    );
  };

  const handleWebhookChange = (field, value) => {
    setWebhookSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleWebhookEventChange = (event, checked) => {
    setWebhookSettings(prev => ({
      ...prev,
      events: {
        ...prev.events,
        [event]: checked
      }
    }));
  };

  const handleTestWebhook = () => {
    console.log('Testing webhook:', webhookSettings.url);
    // Show test result
  };

  const handleCreateApiKey = () => {
    if (newApiKeyData.name && newApiKeyData.permissions.length > 0) {
      const newKey = {
        id: `api-key-${Date.now()}`,
        name: newApiKeyData.name,
        key: `tip_live_${Math.random().toString(36).substring(2)}...${Math.random().toString(36).substring(2)}`,
        created: new Date().toISOString(),
        lastUsed: null,
        permissions: newApiKeyData.permissions
      };
      
      setApiKeys(prev => [...prev, newKey]);
      setNewApiKeyData({ name: "", permissions: [] });
      setShowNewApiKeyForm(false);
    }
  };

  const handleDeleteApiKey = (keyId) => {
    setApiKeys(prev => prev.filter(key => key.id !== keyId));
  };

  const handleRegenerateSecret = () => {
    const newSecret = `wh_secret_${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}`;
    setWebhookSettings(prev => ({
      ...prev,
      secret: newSecret
    }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const maskApiKey = (key) => {
    const parts = key.split('_');
    if (parts.length >= 3) {
      return `${parts[0]}_${parts[1]}_${'*'.repeat(8)}...${key.slice(-6)}`;
    }
    return key;
  };

  return (
    <div className="space-y-8">
      {/* Calendar Integration */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
          <Icon name="Calendar" size={20} className="mr-2" />
          Calendar Integration
        </h3>
        
        <div className="space-y-4">
          {calendarIntegrations.map((integration) => (
            <div key={integration.id} className="p-4 border border-border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                    <Icon 
                      name={integration.id === 'google-calendar' ? 'Calendar' : 'Mail'} 
                      size={20} 
                      className="text-text-secondary" 
                    />
                  </div>
                  <div>
                    <p className="font-medium text-text-primary">{integration.name}</p>
                    {integration.connected && integration.email && (
                      <p className="text-sm text-text-secondary">{integration.email}</p>
                    )}
                  </div>
                </div>
                
                <Button
                  variant={integration.connected ? "destructive" : "outline"}
                  size="sm"
                  onClick={() => handleCalendarToggle(integration.id)}
                >
                  {integration.connected ? 'Disconnect' : 'Connect'}
                </Button>
              </div>
              
              {integration.connected && (
                <div className="space-y-3 pl-13">
                  <Checkbox
                    label="Sync interview events to calendar"
                    description="Automatically create calendar events for scheduled interviews"
                    checked={integration.syncEnabled}
                    onChange={(e) => handleSyncToggle(integration.id)}
                  />
                  
                  {integration.lastSync && (
                    <p className="text-xs text-text-secondary">
                      Last synced: {formatDate(integration.lastSync)}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Webhook Configuration */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
          <Icon name="Webhook" size={20} className="mr-2" />
          Webhook Configuration
        </h3>
        
        <div className="space-y-6">
          <Checkbox
            label="Enable Webhooks"
            description="Receive real-time notifications about interview events"
            checked={webhookSettings.enabled}
            onChange={(e) => handleWebhookChange('enabled', e.target.checked)}
          />
          
          {webhookSettings.enabled && (
            <>
              <div className="space-y-4">
                <Input
                  label="Webhook URL"
                  type="url"
                  value={webhookSettings.url}
                  onChange={(e) => handleWebhookChange('url', e.target.value)}
                  placeholder="https://your-app.com/webhooks/techinterview"
                  description="The endpoint where we'll send event notifications"
                />
                
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleTestWebhook}
                    iconName="Send"
                    iconPosition="left"
                    disabled={!webhookSettings.url}
                  >
                    Test Webhook
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRegenerateSecret}
                    iconName="RefreshCw"
                    iconPosition="left"
                  >
                    Regenerate Secret
                  </Button>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-text-primary mb-3">Event Types</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {eventOptions.map((event) => (
                    <Checkbox
                      key={event.value}
                      label={event.label}
                      checked={webhookSettings.events[event.value]}
                      onChange={(e) => handleWebhookEventChange(event.value, e.target.checked)}
                    />
                  ))}
                </div>
              </div>
              
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="text-sm font-medium text-text-primary mb-2">Webhook Secret</h4>
                <div className="flex items-center space-x-3">
                  <code className="flex-1 px-3 py-2 bg-surface border border-border rounded text-sm font-mono">
                    {webhookSettings.secret}
                  </code>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigator.clipboard.writeText(webhookSettings.secret)}
                    iconName="Copy"
                  >
                    Copy
                  </Button>
                </div>
                <p className="text-xs text-text-secondary mt-2">
                  Use this secret to verify webhook authenticity
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* API Key Management */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-primary flex items-center">
            <Icon name="Key" size={20} className="mr-2" />
            API Key Management
          </h3>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowNewApiKeyForm(true)}
            iconName="Plus"
            iconPosition="left"
          >
            Create API Key
          </Button>
        </div>
        
        {showNewApiKeyForm && (
          <div className="mb-6 p-4 border border-border rounded-lg">
            <h4 className="font-medium text-text-primary mb-3">Create New API Key</h4>
            <div className="space-y-4">
              <Input
                label="Key Name"
                type="text"
                value={newApiKeyData.name}
                onChange={(e) => setNewApiKeyData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Production API Key"
              />
              
              <Select
                label="Permissions"
                options={permissionOptions}
                value={newApiKeyData.permissions}
                onChange={(value) => setNewApiKeyData(prev => ({ ...prev, permissions: value }))}
                multiple
                description="Select the permissions for this API key"
              />
              
              <div className="flex items-center space-x-3">
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleCreateApiKey}
                  disabled={!newApiKeyData.name || newApiKeyData.permissions.length === 0}
                >
                  Create Key
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowNewApiKeyForm(false);
                    setNewApiKeyData({ name: "", permissions: [] });
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
        
        <div className="space-y-4">
          {apiKeys.map((apiKey) => (
            <div key={apiKey.id} className="p-4 border border-border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-medium text-text-primary">{apiKey.name}</p>
                  <p className="text-sm text-text-secondary font-mono">
                    {maskApiKey(apiKey.key)}
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigator.clipboard.writeText(apiKey.key)}
                    iconName="Copy"
                  >
                    Copy
                  </Button>
                  
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteApiKey(apiKey.id)}
                    iconName="Trash2"
                  >
                    Delete
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-xs text-text-secondary">
                <div className="flex items-center space-x-4">
                  <span>Created: {formatDate(apiKey.created)}</span>
                  {apiKey.lastUsed && (
                    <span>Last used: {formatDate(apiKey.lastUsed)}</span>
                  )}
                </div>
                
                <div className="flex items-center space-x-1">
                  {apiKey.permissions.map((permission) => (
                    <span
                      key={permission}
                      className="px-2 py-1 bg-primary bg-opacity-10 text-primary rounded-full text-xs"
                    >
                      {permission}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 p-4 bg-warning bg-opacity-10 border border-warning rounded-lg">
          <div className="flex items-start space-x-2">
            <Icon name="AlertTriangle" size={16} className="text-warning mt-0.5" />
            <div>
              <p className="text-sm text-warning font-medium">Security Notice</p>
              <p className="text-xs text-warning mt-1">
                Keep your API keys secure and never share them publicly. Rotate keys regularly for better security.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationSettingsTab;