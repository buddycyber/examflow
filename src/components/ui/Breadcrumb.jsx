import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Breadcrumb = ({ customItems = null, userRole = 'student' }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const routeMap = {
    '/login': { label: 'Login', parent: null },
    '/admin-dashboard': { label: 'Dashboard', parent: null },
    '/student-dashboard': { label: 'Dashboard', parent: null },
    '/exam-creation-management': { label: 'Exam Management', parent: '/admin-dashboard' },
    '/exam-interface': { label: 'My Exams', parent: '/student-dashboard' },
    '/results-analytics': { 
      label: 'Results & Analytics', 
      parent: userRole === 'admin' ? '/admin-dashboard' : '/student-dashboard' 
    }
  };

  const generateBreadcrumbs = () => {
    if (customItems) {
      return customItems;
    }

    const currentPath = location?.pathname;
    const breadcrumbs = [];
    
    // Build breadcrumb chain
    let path = currentPath;
    while (path && routeMap?.[path]) {
      const route = routeMap?.[path];
      breadcrumbs?.unshift({
        label: route?.label,
        path: path,
        isActive: path === currentPath
      });
      path = route?.parent;
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  const handleNavigation = (path) => {
    if (path && path !== location?.pathname) {
      navigate(path);
    }
  };

  const handleBack = () => {
    if (breadcrumbs?.length > 1) {
      const parentBreadcrumb = breadcrumbs?.[breadcrumbs?.length - 2];
      if (parentBreadcrumb?.path) {
        navigate(parentBreadcrumb?.path);
      }
    } else {
      navigate(-1);
    }
  };

  // Don't render breadcrumbs on login page or if only one item
  if (location?.pathname === '/login' || breadcrumbs?.length <= 1) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-2 py-4" aria-label="Breadcrumb">
      {/* Mobile Back Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleBack}
        iconName="ArrowLeft"
        iconPosition="left"
        iconSize={16}
        className="md:hidden"
      >
        Back
      </Button>
      {/* Desktop Breadcrumb */}
      <ol className="hidden md:flex items-center space-x-2">
        {breadcrumbs?.map((item, index) => (
          <li key={item?.path || index} className="flex items-center">
            {index > 0 && (
              <Icon 
                name="ChevronRight" 
                size={16} 
                className="text-muted-foreground mx-2" 
              />
            )}
            
            {item?.isActive ? (
              <span className="text-sm font-medium text-foreground">
                {item?.label}
              </span>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleNavigation(item?.path)}
                className="text-sm text-muted-foreground hover:text-foreground p-1 h-auto"
              >
                {item?.label}
              </Button>
            )}
          </li>
        ))}
      </ol>
      {/* Mobile Current Page */}
      <div className="md:hidden flex-1">
        <span className="text-sm font-medium text-foreground">
          {breadcrumbs?.[breadcrumbs?.length - 1]?.label}
        </span>
      </div>
    </nav>
  );
};

export default Breadcrumb;