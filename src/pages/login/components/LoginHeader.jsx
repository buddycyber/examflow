import React from 'react';
import Icon from '../../../components/AppIcon';

const LoginHeader = () => {
  return (
    <div className="text-center mb-8">
      {/* Logo */}
      <div className="flex items-center justify-center mb-6">
        <div className="flex items-center justify-center w-12 h-12 bg-primary rounded-xl shadow-lg">
          <Icon name="GraduationCap" size={28} color="white" />
        </div>
        <div className="ml-3">
          <h1 className="text-2xl font-bold text-foreground">ExamFlow</h1>
          <p className="text-sm text-muted-foreground">Educational Assessment Platform</p>
        </div>
      </div>

      {/* Welcome Message */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-foreground">Welcome Back</h2>
        <p className="text-muted-foreground">
          Sign in to access your dashboard and manage your educational assessments
        </p>
      </div>
    </div>
  );
};

export default LoginHeader;