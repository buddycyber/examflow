import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Sidebar = ({ 
  userRole = 'student', 
  userName = 'John Doe', 
  isCollapsed = false, 
  onToggleCollapse,
  onLogout 
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navigationItems = [
    {
      label: 'Dashboard',
      path: userRole === 'admin' ? '/admin-dashboard' : '/student-dashboard',
      icon: 'LayoutDashboard',
      roles: ['admin', 'student'],
      description: 'Overview and quick actions'
    },
    {
      label: userRole === 'admin' ? 'Exam Management' : 'My Exams',
      path: userRole === 'admin' ? '/exam-creation-management' : '/exam-interface',
      icon: 'FileText',
      roles: ['admin', 'student'],
      description: userRole === 'admin' ? 'Create and manage exams' : 'Take your exams'
    },
    {
      label: 'Results & Analytics',
      path: '/results-analytics',
      icon: 'BarChart3',
      roles: ['admin', 'student'],
      description: 'View performance data'
    }
  ];

  const secondaryItems = [
    {
      label: 'Settings',
      icon: 'Settings',
      onClick: () => {
        // Handle settings navigation
        console.log('Navigate to settings');
      }
    },
    {
      label: 'Help & Support',
      icon: 'HelpCircle',
      onClick: () => {
        // Handle help navigation
        console.log('Navigate to help');
      }
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    navigate('/login');
    setIsProfileOpen(false);
  };

  const isActivePath = (path) => {
    return location?.pathname === path;
  };

  return (
    <>
      <aside className={`fixed left-0 top-0 z-40 h-screen bg-card border-r border-border transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-60'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
                <Icon name="GraduationCap" size={20} color="white" />
              </div>
              {!isCollapsed && (
                <span className="text-xl font-semibold text-foreground">ExamFlow</span>
              )}
            </div>
            {onToggleCollapse && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggleCollapse}
                className="w-8 h-8"
              >
                <Icon name={isCollapsed ? "ChevronRight" : "ChevronLeft"} size={16} />
              </Button>
            )}
          </div>

          {/* User Profile Section */}
          <div className="p-4 border-b border-border">
            <div className="relative">
              <Button
                variant="ghost"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className={`w-full ${isCollapsed ? 'justify-center p-2' : 'justify-start p-3'}`}
              >
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon name="User" size={16} color="white" />
                </div>
                {!isCollapsed && (
                  <>
                    <div className="ml-3 text-left flex-1 min-w-0">
                      <div className="text-sm font-medium text-foreground truncate">{userName}</div>
                      <div className="text-xs text-muted-foreground capitalize">{userRole}</div>
                    </div>
                    <Icon name="ChevronDown" size={16} className="text-muted-foreground flex-shrink-0" />
                  </>
                )}
              </Button>

              {/* Profile Dropdown */}
              {isProfileOpen && !isCollapsed && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-lg shadow-moderate z-50">
                  <div className="p-1">
                    {secondaryItems?.map((item) => (
                      <Button
                        key={item?.label}
                        variant="ghost"
                        onClick={item?.onClick}
                        iconName={item?.icon}
                        iconPosition="left"
                        iconSize={16}
                        className="w-full justify-start px-3 py-2"
                      >
                        {item?.label}
                      </Button>
                    ))}
                    <div className="border-t border-border my-1"></div>
                    <Button
                      variant="ghost"
                      onClick={handleLogout}
                      iconName="LogOut"
                      iconPosition="left"
                      iconSize={16}
                      className="w-full justify-start px-3 py-2 text-error hover:text-error hover:bg-error/10"
                    >
                      Sign Out
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 p-4 space-y-2">
            {navigationItems?.map((item) => {
              const isActive = isActivePath(item?.path);
              return (
                <div key={item?.path} className="relative group">
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    onClick={() => handleNavigation(item?.path)}
                    className={`w-full ${isCollapsed ? 'justify-center p-3' : 'justify-start p-3'} transition-all duration-150`}
                  >
                    <Icon name={item?.icon} size={20} className="flex-shrink-0" />
                    {!isCollapsed && (
                      <span className="ml-3 text-sm font-medium truncate">{item?.label}</span>
                    )}
                  </Button>
                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-2 bg-popover border border-border rounded-lg shadow-moderate opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none z-50 whitespace-nowrap">
                      <div className="text-sm font-medium text-popover-foreground">{item?.label}</div>
                      <div className="text-xs text-muted-foreground">{item?.description}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Secondary Actions (collapsed state) */}
          {isCollapsed && (
            <div className="p-4 border-t border-border space-y-2">
              {secondaryItems?.map((item) => (
                <div key={item?.label} className="relative group">
                  <Button
                    variant="ghost"
                    onClick={item?.onClick}
                    className="w-full justify-center p-3"
                  >
                    <Icon name={item?.icon} size={20} />
                  </Button>
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-2 bg-popover border border-border rounded-lg shadow-moderate opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none z-50 whitespace-nowrap">
                    <div className="text-sm font-medium text-popover-foreground">{item?.label}</div>
                  </div>
                </div>
              ))}
              <div className="relative group">
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="w-full justify-center p-3 text-error hover:text-error hover:bg-error/10"
                >
                  <Icon name="LogOut" size={20} />
                </Button>
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-2 bg-popover border border-border rounded-lg shadow-moderate opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none z-50 whitespace-nowrap">
                  <div className="text-sm font-medium text-popover-foreground">Sign Out</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
      {/* Overlay for profile dropdown */}
      {isProfileOpen && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setIsProfileOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;