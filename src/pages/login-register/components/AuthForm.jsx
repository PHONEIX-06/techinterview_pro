import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';

import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const AuthForm = () => {
  const [activeTab, setActiveTab] = useState('signin');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    role: 'candidate',
    rememberMe: false,
    acceptTerms: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const navigate = useNavigate();
  
  const { signIn, signUp, resetPassword, authError, clearError } = useAuth();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Clear auth errors when user starts typing
    if (authError) {
      clearError();
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (activeTab === 'signup') {
      if (!formData.fullName) {
        newErrors.fullName = 'Full name is required';
      }
      if (!formData.acceptTerms) {
        newErrors.acceptTerms = 'You must accept the terms and conditions';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    clearError();

    try {
      let result;
      
      if (activeTab === 'signin') {
        result = await signIn(formData.email, formData.password);
      } else {
        result = await signUp(formData.email, formData.password, {
          fullName: formData.fullName,
          role: formData.role
        });
      }

      if (result?.success) {
        if (activeTab === 'signup') {
          setErrors({ 
            success: 'Account created successfully! Please check your email for verification.' 
          });
        } else {
          navigate('/dashboard');
        }
      }
    } catch (error) {
      console.log('Auth error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    clearError();
    
    try {
      // Import auth service for Google auth
      const authService = await import('../../../utils/authService');
      let result = await authService.default.signInWithGoogle();
      
      if (!result?.success) {
        setErrors({ general: result?.error || 'Google authentication failed' });
      }
      // Google auth will redirect automatically, so no navigation needed here
    } catch (error) {
      setErrors({ general: 'Google authentication failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!resetEmail) {
      setErrors({ resetEmail: 'Please enter your email address' });
      return;
    }

    setIsLoading(true);
    clearError();
    
    try {
      let result = await resetPassword(resetEmail);
      
      if (result?.success) {
        setShowForgotPassword(false);
        setResetEmail('');
        setErrors({ success: 'Password reset link sent to your email' });
      } else {
        setErrors({ resetEmail: result?.error || 'Failed to send reset email' });
      }
    } catch (error) {
      setErrors({ resetEmail: 'Failed to send reset email. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  if (showForgotPassword) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-card rounded-lg shadow-elevation-2 p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-text-primary mb-2">Reset Password</h2>
            <p className="text-text-secondary">Enter your email to receive a password reset link</p>
          </div>

          <form onSubmit={handleForgotPassword} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="Enter your email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              error={errors.resetEmail}
              required
            />

            <div className="flex space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowForgotPassword(false)}
                className="flex-1"
                disabled={isLoading}
              >
                Back to Sign In
              </Button>
              <Button
                type="submit"
                className="flex-1"
                loading={isLoading}
                disabled={isLoading}
              >
                Send Reset Link
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-card rounded-lg shadow-elevation-2 p-8">
        {/* Tab Navigation */}
        <div className="flex mb-6 bg-muted rounded-lg p-1">
          <button
            type="button"
            onClick={() => setActiveTab('signin')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
              activeTab === 'signin' ?'bg-surface text-text-primary shadow-elevation-1' :'text-text-secondary hover:text-text-primary'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('signup')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
              activeTab === 'signup' ?'bg-surface text-text-primary shadow-elevation-1' :'text-text-secondary hover:text-text-primary'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Form Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold text-text-primary mb-2">
            {activeTab === 'signin' ? 'Welcome Back' : 'Create Your Account'}
          </h2>
          <p className="text-text-secondary">
            {activeTab === 'signin' ?'Sign in to access your interview dashboard' :'Join TechInterview Pro to get started'
            }
          </p>
        </div>

        {/* Error/Success Messages */}
        {(authError || errors.general) && (
          <div className="mb-4 p-3 bg-error bg-opacity-10 border border-error border-opacity-20 rounded-lg">
            <p className="text-sm text-error">{authError || errors.general}</p>
          </div>
        )}
        {errors.success && (
          <div className="mb-4 p-3 bg-success bg-opacity-10 border border-success border-opacity-20 rounded-lg">
            <p className="text-sm text-success">{errors.success}</p>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {activeTab === 'signup' && (
            <Input
              label="Full Name"
              type="text"
              name="fullName"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleInputChange}
              error={errors.fullName}
              required
            />
          )}

          <Input
            label="Email Address"
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleInputChange}
            error={errors.email}
            required
          />

          <Input
            label="Password"
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleInputChange}
            error={errors.password}
            required
          />

          {activeTab === 'signup' && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Role</label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="role"
                      value="candidate"
                      checked={formData.role === 'candidate'}
                      onChange={handleInputChange}
                      className="mr-2 text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-text-secondary">Candidate</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="role"
                      value="interviewer"
                      checked={formData.role === 'interviewer'}
                      onChange={handleInputChange}
                      className="mr-2 text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-text-secondary">Interviewer</span>
                  </label>
                </div>
              </div>

              <Checkbox
                label="I agree to the Terms of Service and Privacy Policy"
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleInputChange}
                error={errors.acceptTerms}
                required
              />
            </div>
          )}

          {activeTab === 'signin' && (
            <div className="flex items-center justify-between">
              <Checkbox
                label="Remember me"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleInputChange}
              />
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-primary hover:text-primary-foreground transition-colors duration-200"
              >
                Forgot Password?
              </button>
            </div>
          )}

          <Button
            type="submit"
            fullWidth
            loading={isLoading}
            disabled={isLoading}
            className="mt-6"
          >
            {activeTab === 'signin' ? 'Sign In' : 'Create Account'}
          </Button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-border"></div>
          <span className="px-3 text-sm text-text-secondary">or</span>
          <div className="flex-1 border-t border-border"></div>
        </div>

        {/* Google OAuth */}
        <Button
          type="button"
          variant="outline"
          fullWidth
          onClick={handleGoogleAuth}
          disabled={isLoading}
          iconName="Chrome"
          iconPosition="left"
          className="border-2"
        >
          Continue with Google
        </Button>

        {/* Mock Credentials Info */}
        <div className="mt-6 p-3 bg-muted rounded-lg">
          <p className="text-xs text-text-secondary mb-2 font-medium">Demo Credentials:</p>
          <div className="space-y-1 text-xs text-text-secondary">
            <p>Interviewer: interviewer@techinterview.com / interviewer123</p>
            <p>Candidate: candidate@techinterview.com / candidate123</p>
            <p>Admin: admin@techinterview.com / admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;