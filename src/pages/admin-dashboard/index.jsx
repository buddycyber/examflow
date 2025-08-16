import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Users, GraduationCap, FileText, BarChart3, Calendar, LogOut, Bell } from 'lucide-react';
import MetricCard from './components/MetricCard';
import UpcomingExamCard from './components/UpcomingExamCard';
import QuickActionPanel from './components/QuickActionPanel';
import SystemStatus from './components/SystemStatus';
import PerformanceChart from './components/PerformanceChart';
import ActivityFeedItem from './components/ActivityFeedItem';
import { analyticsService } from '../../services/analyticsService';
import { examService } from '../../services/examService';
import { userService } from '../../services/userService';
import Icon from '../../components/AppIcon';


export default function AdminDashboard() {
  const { user, userProfile, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dashboardStats, setDashboardStats] = useState(null);
  const [exams, setExams] = useState([]);
  const [students, setStudents] = useState([]);

  // Check authentication and role
  useEffect(() => {
    if (!authLoading) {
      if (!user || !userProfile) {
        navigate('/login');
      } else if (userProfile?.role !== 'admin') {
        navigate('/student');
      }
    }
  }, [user, userProfile, authLoading, navigate]);

  // Load dashboard data
  useEffect(() => {
    if (user && userProfile?.role === 'admin') {
      loadDashboardData();
    }
  }, [user, userProfile]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [stats, examsData, studentsData] = await Promise.all([
        analyticsService?.getDashboardStats(),
        examService?.getExams(),
        userService?.getStudents()
      ]);
      
      setDashboardStats(stats);
      setExams(examsData || []);
      setStudents(studentsData || []);
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

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'exams', label: 'Exams', icon: FileText },
    { id: 'class-links', label: 'Class Links', icon: Calendar },
    { id: 'analytics', label: 'Analytics', icon: GraduationCap },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800">ExamFlow Admin</h1>
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
              <p className="text-gray-600">Manage your exam system</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 relative">
                <Bell className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  3
                </span>
              </button>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {userProfile?.full_name?.charAt(0) || 'A'}
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
              {/* Metrics Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                  title="Total Students"
                  value={dashboardStats?.totalStudents || 0}
                  icon={Users}
                  change="+12%"
                  changeType="positive"
                />
                <MetricCard
                  title="Active Exams"
                  value={dashboardStats?.totalExams || 0}
                  icon={FileText}
                  change="+5%"
                  changeType="positive"
                />
                <MetricCard
                  title="Total Attempts"
                  value={dashboardStats?.totalAttempts || 0}
                  icon={GraduationCap}
                  change="+8%"
                  changeType="positive"
                />
                <MetricCard
                  title="Questions Bank"
                  value={dashboardStats?.totalQuestions || 0}
                  icon={BarChart3}
                  change="0%"
                  changeType="neutral"
                />
              </div>

              {/* Charts and Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  <PerformanceChart 
                    data={dashboardStats?.performanceData || []}
                    title="Performance Overview"
                  />
                  
                  {/* Recent Activity */}
                  <div className="bg-white p-6 rounded-xl shadow-sm">
                    <h3 className="text-lg font-semibold mb-6">Recent Activity</h3>
                    <div className="space-y-4">
                      {dashboardStats?.recentActivity?.slice(0, 5)?.map((activity, index) => (
                        <ActivityFeedItem
                          key={index}
                          activity={{
                            type: 'exam_attempt',
                            student: activity?.student?.full_name,
                            exam: activity?.exam?.title,
                            status: activity?.status,
                            timestamp: activity?.created_at
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <QuickActionPanel 
                    onCreateExam={() => setActiveTab('exams')}
                    onAddStudent={() => setActiveTab('students')}
                    onGenerateReport={() => setActiveTab('analytics')}
                    onViewAnalytics={() => setActiveTab('analytics')}
                  />
                  
                  {/* Upcoming Exams */}
                  <div className="bg-white p-6 rounded-xl shadow-sm">
                    <h3 className="text-lg font-semibold mb-4">Upcoming Exams</h3>
                    <div className="space-y-4">
                      {dashboardStats?.upcomingExams?.slice(0, 3)?.map((exam) => (
                        <UpcomingExamCard 
                          key={exam?.id} 
                          exam={exam}
                          onViewDetails={(examId) => console.log('View exam details:', examId)}
                          onEditExam={(examId) => console.log('Edit exam:', examId)}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <SystemStatus lastUpdated={new Date().toISOString()} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'students' && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Student Management</h3>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Add New Student
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-4 font-medium text-gray-700">Name</th>
                      <th className="text-left p-4 font-medium text-gray-700">Email</th>
                      <th className="text-left p-4 font-medium text-gray-700">Status</th>
                      <th className="text-left p-4 font-medium text-gray-700">Joined</th>
                      <th className="text-left p-4 font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {students?.map((student) => (
                      <tr key={student?.id} className="hover:bg-gray-50">
                        <td className="p-4">
                          <div className="font-medium text-gray-900">{student?.full_name}</div>
                        </td>
                        <td className="p-4 text-gray-600">{student?.email}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            student?.is_active 
                              ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {student?.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="p-4 text-gray-600">
                          {new Date(student.created_at)?.toLocaleDateString()}
                        </td>
                        <td className="p-4">
                          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                            Manage
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'exams' && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Exam Management</h3>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Create New Exam
                </button>
              </div>
              
              <div className="grid gap-6">
                {exams?.map((exam) => (
                  <div key={exam?.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-medium text-gray-900">{exam?.title}</h4>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        exam?.status === 'published' ? 'bg-green-100 text-green-800' :
                        exam?.status === 'draft'? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {exam?.status}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4">{exam?.description}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>Levels: {exam?.total_levels}</span>
                      <span>Duration: {exam?.duration_minutes} mins</span>
                      <span>Questions: {exam?.questions?.length || 0}</span>
                      <span>Attempts: {exam?.exam_attempts?.length || 0}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Other tabs placeholder */}
          {(activeTab === 'class-links' || activeTab === 'analytics') && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-xl font-semibold mb-4 capitalize">{activeTab?.replace('-', ' ')}</h3>
              <p className="text-gray-600">Content for {activeTab} coming soon...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}