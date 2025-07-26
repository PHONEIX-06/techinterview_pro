import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const Breadcrumb = ({ items = [] }) => {
  const location = useLocation();

  const routeMap = {
    '/dashboard': 'Dashboard',
    '/interview-scheduling': 'Interview Scheduling',
    '/live-interview-room': 'Live Interview Room',
    '/interview-history-analytics': 'Interview History & Analytics',
    '/user-profile-settings': 'Profile Settings',
    '/login-register': 'Authentication',
  };

  const generateBreadcrumbs = () => {
    if (items.length > 0) {
      return items;
    }

    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs = [{ label: 'Home', path: '/dashboard' }];

    if (location.pathname !== '/dashboard') {
      const currentPageLabel = routeMap[location.pathname] || 'Page';
      breadcrumbs.push({
        label: currentPageLabel,
        path: location.pathname,
        current: true
      });
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  if (breadcrumbs.length <= 1 && location.pathname === '/dashboard') {
    return null;
  }

  return (
    <nav className="flex items-center space-x-2 text-sm text-text-secondary mb-6" aria-label="Breadcrumb">
      {breadcrumbs.map((item, index) => (
        <React.Fragment key={item.path || index}>
          {index > 0 && (
            <Icon name="ChevronRight" size={14} className="text-text-secondary" />
          )}
          
          {item.current || index === breadcrumbs.length - 1 ? (
            <span className="text-text-primary font-medium" aria-current="page">
              {item.label}
            </span>
          ) : (
            <Link
              to={item.path}
              className="hover:text-text-primary transition-colors duration-200"
            >
              {item.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;