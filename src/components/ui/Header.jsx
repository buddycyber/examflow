import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = ({ userRole = 'student', userName = 'John Doe', onLogout }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navigationItems = [
    {
      label: 'Dashboard',
      path: userRole === 'admin' ? '/admin-dashboard' : '/student-dashboard',
      icon: 'LayoutDashboard',
      roles: ['admin', 'student']
    },
    {
      label: userRole === 'admin' ? 'Exam Management' : 'My Exams',
      path: userRole === 'admin' ? '/exam-creation-management' : '/exam-interface',
      icon: 'FileText',
      roles: ['admin', 'student']
    },
    {
      label: 'Results & Analytics',
      path: '/results-analytics',
      icon: 'BarChart3',
      roles: ['admin', 'student']
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
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
    <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
            <Icon name="GraduationCap" size={20} color="white" />
          </div>
          <span className="text-xl font-semibold text-foreground">ExamFlow</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navigationItems?.map((item) => (
            <Button
              key={item?.path}
              variant={isActivePath(item?.path) ? "default" : "ghost"}
              onClick={() => handleNavigation(item?.path)}
              iconName={item?.icon}
              iconPosition="left"
              iconSize={16}
              className="px-4 py-2"
            >
              {item?.label}
            </Button>
          ))}
        </nav>

        {/* User Profile & Mobile Menu */}
        <div className="flex items-center space-x-3">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden"
          >
            <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={20} />
          </Button>

          {/* User Profile Dropdown */}
          <div className="relative">
            <Button
              variant="ghost"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-2 px-3 py-2"
            >
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Icon name="User" size={16} color="white" />
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-sm font-medium text-foreground">{userName}</div>
                <div className="text-xs text-muted-foreground capitalize">{userRole}</div>
              </div>
              <Icon name="ChevronDown" size={16} className="text-muted-foreground" />
            </Button>

            {/* Profile Dropdown Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-popover border border-border rounded-lg shadow-moderate z-50">
                <div className="p-3 border-b border-border">
                  <div className="text-sm font-medium text-popover-foreground">{userName}</div>
                  <div className="text-xs text-muted-foreground capitalize">{userRole}</div>
                </div>
                <div className="p-1">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setIsProfileOpen(false);
                      // Handle profile navigation
                    }}
                    iconName="Settings"
                    iconPosition="left"
                    iconSize={16}
                    className="w-full justify-start px-3 py-2"
                  >
                    Settings
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setIsProfileOpen(false);
                      // Handle help navigation
                    }}
                    iconName="HelpCircle"
                    iconPosition="left"
                    iconSize={16}
                    className="w-full justify-start px-3 py-2"
                  >
                    Help & Support
                  </Button>
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
      </div>
      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-card border-t border-border">
          <nav className="p-4 space-y-2">
            {navigationItems?.map((item) => (
              <Button
                key={item?.path}
                variant={isActivePath(item?.path) ? "default" : "ghost"}
                onClick={() => handleNavigation(item?.path)}
                iconName={item?.icon}
                iconPosition="left"
                iconSize={16}
                className="w-full justify-start px-4 py-3"
              >
                {item?.label}
              </Button>
            ))}
          </nav>
        </div>
      )}
      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      {/* Overlay for profile dropdown */}
      {isProfileOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsProfileOpen(false)}
        />
      )}
    </header>
  );
};

export default Header;