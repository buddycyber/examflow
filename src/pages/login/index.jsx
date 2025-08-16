import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginHeader from './components/LoginHeader';
import LoginForm from './components/LoginForm';
import LoginFooter from './components/LoginFooter';
import { useAuth } from '../../contexts/AuthContext';

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn, signUp, user, userProfile } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user && userProfile) {
      if (userProfile?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/student');
      }
    }
  }, [user, userProfile, navigate]);

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError('');

    try {
      if (isSignUp) {
        const { data, error: authError } = await signUp(formData?.email, formData?.password, {
          full_name: formData?.fullName,
          role: formData?.role
        });
        
        if (authError) {
          setError(authError);
        } else {
          setError('Registration successful! Please check your email for verification.');
          setIsSignUp(false);
        }
      } else {
        const { data, error: authError } = await signIn(formData?.email, formData?.password);
        
        if (authError) {
          setError(authError);
        } else {
          // Navigation will be handled by useEffect
        }
      }
    } catch (err) {
      setError(err?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-800 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <LoginHeader isSignUp={isSignUp} />
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <LoginForm 
            isSignUp={isSignUp}
            onSubmit={handleSubmit}
            loading={loading}
          />
          
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
              }}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </button>
          </div>

          <LoginFooter />
          
          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Demo Credentials:</h3>
            <div className="space-y-1 text-xs text-gray-600">
              <div><strong>Admin:</strong> admin@examflow.com / admin123</div>
              <div><strong>Student:</strong> student1@examflow.com / student123</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}