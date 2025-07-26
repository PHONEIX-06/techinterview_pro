import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../AppIcon';

const UserAvatarDropdown = ({ user = { name: 'John Doe', email: 'john.doe@company.com' } }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const menuItems = [
    { label: 'Profile Settings', path: '/user-profile-settings', icon: 'User' },
    { label: 'Help & Support', path: '/help', icon: 'HelpCircle' },
    { label: 'Logout', action: 'logout', icon: 'LogOut' },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    console.log('Logout clicked');
    setIsOpen(false);
  };

  const handleItemClick = () => {
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 text-text-secondary hover:text-text-primary hover:bg-muted rounded-lg transition-all duration-200"
      >
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
          <Icon name="User" size={16} color="white" />
        </div>
        <Icon 
          name="ChevronDown" 
          size={16} 
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-popover border border-border rounded-lg shadow-elevation-3 py-2 animate-fade-in z-10">
          <div className="px-4 py-2 border-b border-border">
            <p className="text-sm font-medium text-text-primary">{user.name}</p>
            <p className="text-xs text-text-secondary">{user.email}</p>
          </div>
          
          {menuItems.map((item) => (
            item.action === 'logout' ? (
              <button
                key={item.action}
                onClick={handleLogout}
                className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-muted transition-colors duration-200"
              >
                <Icon name={item.icon} size={16} />
                <span>{item.label}</span>
              </button>
            ) : (
              <Link
                key={item.path}
                to={item.path}
                onClick={handleItemClick}
                className="flex items-center space-x-3 px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-muted transition-colors duration-200"
              >
                <Icon name={item.icon} size={16} />
                <span>{item.label}</span>
              </Link>
            )
          ))}
        </div>
      )}
    </div>
  );
};

export default UserAvatarDropdown;