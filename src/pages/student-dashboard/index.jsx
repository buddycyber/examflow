import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Trophy, 
  Clock, 
  Calendar,
  LogOut,
  Bell,
  Play
} from 'lucide-react';
import WelcomeHeader from './components/WelcomeHeader';
import AvailableExams from './components/AvailableExams';
import RecentResults from './components/RecentResults';
import PerformanceSummary from './components/PerformanceSummary';
import ClassLinks from './components/ClassLinks';
import ProgressTimeline from './components/ProgressTimeline';
import PerformanceCharts from './components/PerformanceCharts';
import { examService } from '../../services/examService';
import { attemptService } from '../../services/attemptService';
import { classLinkService } from '../../services/classLinkService';
import { analyticsService } from '../../services/analyticsService';
import Icon from '../../components/AppIcon';


export default function StudentDashboard() {
  const { user, userProfile, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [availableExams, setAvailableExams] = useState([]);
  const [recentAttempts, setRecentAttempts] = useState([]);
  const [classLinks, setClassLinks] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  
  // Check authentication and role
  useEffect(() => {
    if (!authLoading) {
      if (!user || !userProfile) {
        navigate('/login');
      } else if (userProfile?.role !== 'student') {
        navigate('/admin');
      }
    }
  }, [user, userProfile, authLoading, navigate]);

  // Load dashboard data
  useEffect(() => {
    if (user && userProfile?.role === 'student') {
      loadDashboardData();
    }
  }, [user, userProfile]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [exams, attempts, links, studentAnalytics] = await Promise.all([
        examService?.getExams(),
        attemptService?.getStudentAttempts(),
        classLinkService?.getAvailableClassLinks(),
        analyticsService?.getStudentAnalytics(user?.id)
      ]);
      
      setAvailableExams(exams?.filter(e => e?.status === 'published') || []);
      setRecentAttempts(attempts || []);
      setClassLinks(links || []);
      setAnalytics(studentAnalytics);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (err) {
      setError('Failed to sign out');
    }
  };

  const startExam = async (examId) => {
    try {
      const attempt = await attemptService?.startExamAttempt(examId);
      navigate(`/exam/${examId}/level/${attempt?.current_level}`);
    } catch (err) {
      setError('Failed to start exam');
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BookOpen },
    { id: 'exams', label: 'Exams', icon: Trophy },
    { id: 'results', label: 'Results', icon: Clock },
    { id: 'classes', label: 'Class Links', icon: Calendar },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800">ExamFlow</h1>
          <p className="text-sm text-gray-600 mt-1">Welcome, {userProfile?.full_name}</p>
        </div>
        
        <nav className="mt-6">
          {tabs?.map((tab) => {
            const Icon = tab?.icon;
            return (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`w-full flex items-center px-6 py-3 text-left hover:bg-blue-50 transition-colors ${
                  activeTab === tab?.id ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : 'text-gray-600'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {tab?.label}
              </button>
            );
          })}
          
          <div className="mt-8 px-6">
            <button
              onClick={handleSignOut}
              className="flex items-center text-gray-600 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Sign Out
            </button>
          </div>
        </nav>
      </div>
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 capitalize">{activeTab}</h2>
              <p className="text-gray-600">Track your progress and take exams</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 relative">
                <Bell className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  2
                </span>
              </button>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {userProfile?.full_name?.charAt(0) || 'S'}
                </span>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {/* Tab Content */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              <WelcomeHeader 
                user={userProfile} 
                analytics={analytics}
                userName={userProfile?.full_name}
                currentLevel={analytics?.current_level || 1}
                nextExam={availableExams?.[0]}
                studyStreak={analytics?.study_streak || 0}
              />
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  <AvailableExams exams={availableExams} onStartExam={startExam} />
                  <PerformanceCharts 
                    analytics={analytics}
                    scoreData={analytics?.score_data || []}
                    timeData={analytics?.time_data || []}
                    subjectData={analytics?.subject_data || []}
                  />
                </div>
                
                <div className="space-y-8">
                  <PerformanceSummary 
                    analytics={analytics}
                    stats={analytics?.stats || {}}
                    achievements={analytics?.achievements || []}
                    upcomingDeadlines={analytics?.upcoming_deadlines || []}
                  />
                  <ProgressTimeline 
                    attempts={recentAttempts?.slice(0, 5)}
                    levels={analytics?.levels || []}
                    currentLevel={analytics?.current_level || 1}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'exams' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-xl font-semibold mb-6">Available Exams</h3>
                <div className="grid gap-6">
                  {availableExams?.map((exam) => (
                    <div key={exam?.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="text-lg font-medium text-gray-900">{exam?.title}</h4>
                          <p className="text-gray-600">{exam?.description}</p>
                        </div>
                        <button
                          onClick={() => startExam(exam?.id)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Start Exam
                        </button>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>Levels: {exam?.total_levels}</span>
                        <span>Duration: {exam?.duration_minutes} mins</span>
                        <span>Pass Score: {exam?.passing_score}%</span>
                        <span>
                          {exam?.scheduled_at ? 
                            `Scheduled: ${new Date(exam.scheduled_at)?.toLocaleDateString()}` :
                            'Available Now'
                          }
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'results' && (
            <div className="space-y-6">
              <RecentResults 
                attempts={recentAttempts}
                results={recentAttempts}
                onReviewAnswers={(attemptId) => navigate(`/exam/review/${attemptId}`)}
              />
              {analytics && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-xl font-semibold mb-6">Performance Analytics</h3>
                  <PerformanceCharts 
                    analytics={analytics}
                    scoreData={analytics?.score_data || []}
                    timeData={analytics?.time_data || []}
                    subjectData={analytics?.subject_data || []}
                  />
                </div>
              )}
            </div>
          )}

          {activeTab === 'classes' && (
            <ClassLinks links={classLinks} />
          )}
        </div>
      </div>
    </div>
  );
}