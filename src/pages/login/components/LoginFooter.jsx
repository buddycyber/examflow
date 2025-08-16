import React from 'react';
import Icon from '../../../components/AppIcon';

const LoginFooter = () => {
  const currentYear = new Date()?.getFullYear();

  return (
    <div className="mt-8 space-y-6">
      {/* Help Section */}
      <div className="text-center">
        <div className="p-4 bg-muted/50 rounded-lg border border-border">
          <div className="flex items-center justify-center mb-2">
            <Icon name="HelpCircle" size={20} className="text-primary" />
          </div>
          <h3 className="text-sm font-medium text-foreground mb-1">Need Help?</h3>
          <p className="text-xs text-muted-foreground mb-3">
            Contact your administrator for account access or technical support
          </p>
          <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Icon name="Mail" size={12} />
              <span>admin@examflow.edu</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Phone" size={12} />
              <span>+1 (555) 123-4567</span>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Credentials */}
      <div className="text-center">
        <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
          <div className="flex items-center justify-center mb-2">
            <Icon name="Key" size={16} className="text-accent" />
          </div>
          <h3 className="text-sm font-medium text-foreground mb-2">Demo Credentials</h3>
          <div className="space-y-2 text-xs">
            <div className="bg-card p-2 rounded border">
              <div className="font-medium text-foreground">Administrator</div>
              <div className="text-muted-foreground">admin@examflow.edu / admin123</div>
            </div>
            <div className="bg-card p-2 rounded border">
              <div className="font-medium text-foreground">Student</div>
              <div className="text-muted-foreground">student@examflow.edu / student123</div>
            </div>
          </div>
        </div>
      </div>

      {/* Security Badges */}
      <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
        <div className="flex items-center space-x-1">
          <Icon name="Shield" size={12} className="text-success" />
          <span>SSL Secured</span>
        </div>
        <div className="flex items-center space-x-1">
          <Icon name="Lock" size={12} className="text-success" />
          <span>256-bit Encryption</span>
        </div>
        <div className="flex items-center space-x-1">
          <Icon name="CheckCircle" size={12} className="text-success" />
          <span>FERPA Compliant</span>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground">
          © {currentYear} ExamFlow. All rights reserved. Educational Assessment Platform.
        </p>
      </div>
    </div>
  );
};

export default LoginFooter;