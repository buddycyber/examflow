import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Trophy, 
  Clock, 
  CheckCircle, 
  XCircle, 
  BarChart3,
  ArrowLeft,
  Download
} from 'lucide-react';

import IndividualResults from './components/IndividualResults';
import ComparativeAnalytics from './components/ComparativeAnalytics';
import PerformanceTrends from './components/PerformanceTrends';
import TabNavigation from './components/TabNavigation';
import { attemptService } from '../../services/attemptService';
import { examService } from '../../services/examService';
import { analyticsService } from '../../services/analyticsService';

export default function ResultsAnalytics() {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  
  const [attempt, setAttempt] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [levelResults, setLevelResults] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [activeTab, setActiveTab] = useState('results');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user && attemptId) {
      loadResultsData();
    }
  }, [user, attemptId]);

  const loadResultsData = async () => {
    try {
      setLoading(true);
      setError('');

      // Load attempt details
      const attemptData = await attemptService?.getAttemptById(attemptId);
      setAttempt(attemptData);

      // Load level results
      const levelResultsData = await attemptService?.getLevelResults(attemptId);
      setLevelResults(levelResultsData);

      // Load questions for this exam
      const questionsData = await examService?.getExamQuestions(attemptData?.exam_id);
      setQuestions(questionsData);

      // Load student analytics if this is the student's own attempt
      if (userProfile?.role === 'student' || attemptData?.student_id === user?.id) {
        const analyticsData = await analyticsService?.getStudentAnalytics(attemptData?.student_id);
        setAnalytics(analyticsData);
      }

    } catch (err) {
      console.error('Error loading results:', err);
      setError('Failed to load results');
    } finally {
      setLoading(false);
    }
  };

  const calculateDetailedResults = () => {
    if (!attempt || !questions?.length) return null;

    const answers = attempt?.answers || {};
    const questionResults = [];
    
    questions?.forEach(question => {
      const userAnswer = answers?.[question?.id] || '';
      const isCorrect = userAnswer?.toLowerCase()?.trim() === question?.correct_answer?.toLowerCase()?.trim();
      
      questionResults?.push({
        question,
        userAnswer,
        isCorrect,
        points: isCorrect ? question?.points : 0
      });
    });

    const totalPoints = questions?.reduce((sum, q) => sum + q?.points, 0);
    const earnedPoints = questionResults?.reduce((sum, r) => sum + r?.points, 0);
    const correctCount = questionResults?.filter(r => r?.isCorrect)?.length;

    return {
      questionResults,
      totalQuestions: questions?.length,
      correctAnswers: correctCount,
      totalPoints,
      earnedPoints,
      percentage: totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0
    };
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${remainingSeconds}s`;
    }
    return `${minutes}m ${remainingSeconds}s`;
  };

  const handleBackToDashboard = () => {
    if (userProfile?.role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/student');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !attempt) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Results not found'}</p>
          <button
            onClick={handleBackToDashboard}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const detailedResults = calculateDetailedResults();
  const tabs = [
    { id: 'results', label: 'Individual Results', icon: Trophy },
    { id: 'analytics', label: 'Performance Analytics', icon: BarChart3 },
    { id: 'trends', label: 'Progress Trends', icon: Clock }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={handleBackToDashboard}
                className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Exam Results</h1>
                <p className="text-gray-600">{attempt?.exam?.title}</p>
              </div>
            </div>
            
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Download className="w-4 h-4 mr-2" />
              Export Results
            </button>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Results Overview */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Score */}
            <div className="text-center">
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-3 ${
                attempt?.passed ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {attempt?.passed ? 
                  <CheckCircle className="w-8 h-8 text-green-600" /> :
                  <XCircle className="w-8 h-8 text-red-600" />
                }
              </div>
              <h3 className="text-2xl font-bold text-gray-800">{attempt?.total_score}%</h3>
              <p className="text-gray-600">Final Score</p>
            </div>

            {/* Status */}
            <div className="text-center">
              <div className={`text-3xl font-bold mb-2 ${
                attempt?.passed ? 'text-green-600' : 'text-red-600'
              }`}>
                {attempt?.passed ? 'PASS' : 'FAIL'}
              </div>
              <p className="text-gray-600">
                Required: {attempt?.exam?.passing_score}%
              </p>
            </div>

            {/* Questions */}
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-800">
                {detailedResults?.correctAnswers}/{detailedResults?.totalQuestions}
              </h3>
              <p className="text-gray-600">Correct Answers</p>
            </div>

            {/* Time */}
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-800">
                {formatTime(attempt?.time_spent_seconds || 0)}
              </h3>
              <p className="text-gray-600">Time Spent</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <TabNavigation
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          userRole={userProfile?.role}
        />

        {/* Tab Content */}
        <div className="mt-8">
          {activeTab === 'results' && detailedResults && (
            <IndividualResults
              attempt={attempt}
              detailedResults={detailedResults}
              levelResults={levelResults}
              userRole={userProfile?.role}
              selectedStudent={attempt?.student_id}
              examResults={detailedResults}
            />
          )}

          {activeTab === 'analytics' && analytics && (
            <ComparativeAnalytics
              attempt={attempt}
              analytics={analytics}
              questions={questions}
              userRole={userProfile?.role}
              comparativeData={analytics}
            />
          )}

          {activeTab === 'trends' && analytics && (
            <PerformanceTrends
              analytics={analytics}
              currentAttempt={attempt}
              userRole={userProfile?.role}
              trendData={analytics}
            />
          )}
        </div>
      </div>
    </div>
  );
}