import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';


const AccountSecurityTab = () => {
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  const [connectedAccounts] = useState([
    {
      id: "google",
      name: "Google",
      email: "john.doe@gmail.com",
      connected: true,
      connectedAt: "2025-01-15T10:30:00Z"
    },
    {
      id: "github",
      name: "GitHub",
      username: "johndoe",
      connected: false,
      connectedAt: null
    }
  ]);

  const [activeSessions] = useState([
    {
      id: "current",
      device: "Chrome on Windows",
      location: "New York, NY",
      ipAddress: "192.168.1.100",
      lastActive: "2025-01-26T20:09:18Z",
      current: true
    },
    {
      id: "mobile",
      device: "Safari on iPhone",
      location: "New York, NY",
      ipAddress: "192.168.1.101",
      lastActive: "2025-01-26T15:30:00Z",
      current: false
    },
    {
      id: "tablet",
      device: "Chrome on iPad",
      location: "New York, NY",
      ipAddress: "192.168.1.102",
      lastActive: "2025-01-25T09:15:00Z",
      current: false
    }
  ]);

  const [passwordErrors, setPasswordErrors] = useState({});

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear errors when user starts typing
    if (passwordErrors[field]) {
      setPasswordErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const validatePassword = () => {
    const errors = {};
    
    if (!passwordData.currentPassword) {
      errors.currentPassword = "Current password is required";
    }
    
    if (!passwordData.newPassword) {
      errors.newPassword = "New password is required";
    } else if (passwordData.newPassword.length < 8) {
      errors.newPassword = "Password must be at least 8 characters";
    }
    
    if (!passwordData.confirmPassword) {
      errors.confirmPassword = "Please confirm your new password";
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    
    return errors;
  };

  const handlePasswordSubmit = () => {
    const errors = validatePassword();
    setPasswordErrors(errors);
    
    if (Object.keys(errors).length === 0) {
      console.log('Changing password...');
      // Reset form on success
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    }
  };

  const handleEnable2FA = () => {
    if (!twoFactorEnabled) {
      setShowQRCode(true);
    } else {
      setTwoFactorEnabled(false);
      setShowQRCode(false);
      setVerificationCode("");
    }
  };

  const handleVerify2FA = () => {
    if (verificationCode.length === 6) {
      setTwoFactorEnabled(true);
      setShowQRCode(false);
      setVerificationCode("");
      console.log('2FA enabled successfully');
    }
  };

  const handleDisconnectAccount = (accountId) => {
    console.log('Disconnecting account:', accountId);
  };

  const handleConnectAccount = (accountId) => {
    console.log('Connecting account:', accountId);
  };

  const handleTerminateSession = (sessionId) => {
    console.log('Terminating session:', sessionId);
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

  return (
    <div className="space-y-8">
      {/* Change Password */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
          <Icon name="Lock" size={20} className="mr-2" />
          Change Password
        </h3>
        
        <div className="space-y-4 max-w-md">
          <Input
            label="Current Password"
            type="password"
            value={passwordData.currentPassword}
            onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
            error={passwordErrors.currentPassword}
            required
          />
          
          <Input
            label="New Password"
            type="password"
            value={passwordData.newPassword}
            onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
            error={passwordErrors.newPassword}
            description="Must be at least 8 characters long"
            required
          />
          
          <Input
            label="Confirm New Password"
            type="password"
            value={passwordData.confirmPassword}
            onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
            error={passwordErrors.confirmPassword}
            required
          />
          
          <Button
            variant="default"
            onClick={handlePasswordSubmit}
            iconName="Save"
            iconPosition="left"
          >
            Update Password
          </Button>
        </div>
      </div>

      {/* Two-Factor Authentication */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
          <Icon name="Shield" size={20} className="mr-2" />
          Two-Factor Authentication
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <p className="font-medium text-text-primary">
                {twoFactorEnabled ? 'Two-factor authentication is enabled' : 'Two-factor authentication is disabled'}
              </p>
              <p className="text-sm text-text-secondary">
                {twoFactorEnabled 
                  ? 'Your account is protected with 2FA' :'Add an extra layer of security to your account'
                }
              </p>
            </div>
            
            <Button
              variant={twoFactorEnabled ? "destructive" : "default"}
              onClick={handleEnable2FA}
              iconName={twoFactorEnabled ? "ShieldOff" : "Shield"}
              iconPosition="left"
            >
              {twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
            </Button>
          </div>
          
          {showQRCode && (
            <div className="p-4 border border-border rounded-lg">
              <h4 className="font-medium text-text-primary mb-3">Set up Two-Factor Authentication</h4>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6">
                  <div className="w-32 h-32 bg-muted border border-border rounded-lg flex items-center justify-center">
                    <Icon name="QrCode" size={48} className="text-text-secondary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-text-secondary mb-2">
                      1. Install an authenticator app like Google Authenticator or Authy
                    </p>
                    <p className="text-sm text-text-secondary mb-2">
                      2. Scan this QR code with your authenticator app
                    </p>
                    <p className="text-sm text-text-secondary mb-4">
                      3. Enter the 6-digit code from your app below
                    </p>
                    
                    <div className="flex items-center space-x-3">
                      <Input
                        type="text"
                        placeholder="000000"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        className="w-24 text-center font-mono"
                      />
                      <Button
                        variant="default"
                        onClick={handleVerify2FA}
                        disabled={verificationCode.length !== 6}
                      >
                        Verify
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Connected Accounts */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
          <Icon name="Link" size={20} className="mr-2" />
          Connected Accounts
        </h3>
        
        <div className="space-y-4">
          {connectedAccounts.map((account) => (
            <div key={account.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                  <Icon 
                    name={account.id === 'google' ? 'Chrome' : 'Github'} 
                    size={20} 
                    className="text-text-secondary" 
                  />
                </div>
                <div>
                  <p className="font-medium text-text-primary">{account.name}</p>
                  <p className="text-sm text-text-secondary">
                    {account.connected 
                      ? `Connected as ${account.email || account.username}` 
                      : 'Not connected'
                    }
                  </p>
                  {account.connected && account.connectedAt && (
                    <p className="text-xs text-text-secondary">
                      Connected on {formatDate(account.connectedAt)}
                    </p>
                  )}
                </div>
              </div>
              
              <Button
                variant={account.connected ? "destructive" : "outline"}
                size="sm"
                onClick={() => account.connected 
                  ? handleDisconnectAccount(account.id) 
                  : handleConnectAccount(account.id)
                }
              >
                {account.connected ? 'Disconnect' : 'Connect'}
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Active Sessions */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
          <Icon name="Monitor" size={20} className="mr-2" />
          Active Sessions
        </h3>
        
        <div className="space-y-4">
          {activeSessions.map((session) => (
            <div key={session.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                  <Icon name="Monitor" size={20} className="text-text-secondary" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <p className="font-medium text-text-primary">{session.device}</p>
                    {session.current && (
                      <span className="px-2 py-1 bg-success bg-opacity-10 text-success text-xs rounded-full">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-text-secondary">
                    {session.location} • {session.ipAddress}
                  </p>
                  <p className="text-xs text-text-secondary">
                    Last active: {formatDate(session.lastActive)}
                  </p>
                </div>
              </div>
              
              {!session.current && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleTerminateSession(session.id)}
                  iconName="X"
                  iconPosition="left"
                >
                  Terminate
                </Button>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-4 p-4 bg-warning bg-opacity-10 border border-warning rounded-lg">
          <div className="flex items-start space-x-2">
            <Icon name="AlertTriangle" size={16} className="text-warning mt-0.5" />
            <div>
              <p className="text-sm text-warning font-medium">Security Notice</p>
              <p className="text-xs text-warning mt-1">
                If you see any sessions you don't recognize, terminate them immediately and change your password.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSecurityTab;