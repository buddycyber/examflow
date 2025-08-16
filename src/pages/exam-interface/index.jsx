import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ExamHeader from './components/ExamHeader';
import QuestionDisplay from './components/QuestionDisplay';
import QuestionNavigation from './components/QuestionNavigation';
import ExamControls from './components/ExamControls';
import AutoSaveIndicator from './components/AutoSaveIndicator';
import SubmitConfirmationModal from './components/SubmitConfirmationModal';
import { examService } from '../../services/examService';
import { attemptService } from '../../services/attemptService';

export default function ExamInterface() {
  const { examId, level } = useParams();
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  
  const [exam, setExam] = useState(null);
  const [attempt, setAttempt] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [autoSaving, setAutoSaving] = useState(false);
  const [examStartTime] = useState(new Date());

  // Load exam data
  useEffect(() => {
    if (user && examId && level) {
      loadExamData();
    }
  }, [user, examId, level]);

  // Timer effect
  useEffect(() => {
    if (exam && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [exam, timeRemaining]);

  // Auto-save effect
  useEffect(() => {
    if (attempt && Object.keys(answers)?.length > 0) {
      const autoSaveTimer = setTimeout(() => {
        autoSaveAnswers();
      }, 3000);

      return () => clearTimeout(autoSaveTimer);
    }
  }, [answers, attempt]);

  const loadExamData = async () => {
    try {
      setLoading(true);
      setError('');

      // Get exam details
      const examData = await examService?.getExamById(examId);
      setExam(examData);

      // Get or create attempt
      let attemptData = await attemptService?.startExamAttempt(examId);
      setAttempt(attemptData);

      // Load existing answers if any
      if (attemptData?.answers && Object.keys(attemptData?.answers)?.length > 0) {
        setAnswers(attemptData?.answers);
      }

      // Get questions for current level
      const questionsData = await examService?.getExamQuestions(examId, parseInt(level));
      setQuestions(questionsData);

      // Set timer
      const totalMinutes = examData?.duration_minutes;
      const elapsedSeconds = attemptData?.time_spent_seconds || 0;
      const remainingSeconds = (totalMinutes * 60) - elapsedSeconds;
      setTimeRemaining(Math.max(0, remainingSeconds));

    } catch (err) {
      console.error('Error loading exam:', err);
      setError('Failed to load exam');
    } finally {
      setLoading(false);
    }
  };

  const autoSaveAnswers = async () => {
    if (!attempt) return;

    try {
      setAutoSaving(true);
      
      const timeSpent = Math.floor((new Date() - examStartTime) / 1000);
      
      await attemptService?.updateAttempt(attempt?.id, {
        answers: answers,
        time_spent_seconds: timeSpent
      });
    } catch (err) {
      console.error('Auto-save failed:', err);
    } finally {
      setAutoSaving(false);
    }
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions?.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleQuestionNavigation = (index) => {
    setCurrentQuestionIndex(index);
  };

  const calculateResults = () => {
    let correctAnswers = 0;
    let totalPoints = 0;
    let earnedPoints = 0;

    questions?.forEach(question => {
      totalPoints += question?.points;
      const userAnswer = answers?.[question?.id];
      
      if (userAnswer && userAnswer?.toLowerCase()?.trim() === question?.correct_answer?.toLowerCase()?.trim()) {
        correctAnswers++;
        earnedPoints += question?.points;
      }
    });

    const score = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0;
    const passed = score >= exam?.passing_score;

    return {
      correctAnswers,
      totalQuestions: questions?.length,
      score: Math.round(score * 100) / 100,
      passed,
      totalPoints,
      earnedPoints
    };
  };

  const handleSubmitLevel = async () => {
    try {
      setLoading(true);
      
      const results = calculateResults();
      const timeSpent = Math.floor((new Date() - examStartTime) / 1000);
      const isLastLevel = parseInt(level) >= exam?.total_levels;
      
      const levelResults = {
        score: results?.score,
        totalQuestions: results?.totalQuestions,
        correctAnswers: results?.correctAnswers,
        passed: results?.passed,
        timeSpent,
        isLastLevel,
        totalScore: results?.score, // For now, using level score as total
        overallPassed: results?.passed
      };

      const { levelResult, updatedAttempt } = await attemptService?.submitLevel(
        attempt?.id,
        parseInt(level),
        levelResults
      );

      // Navigate to results
      navigate(`/results/${attempt?.id}`);
      
    } catch (err) {
      console.error('Error submitting level:', err);
      setError('Failed to submit level');
    } finally {
      setLoading(false);
      setShowSubmitModal(false);
    }
  };

  const handleAutoSubmit = useCallback(async () => {
    if (!attempt) return;
    
    try {
      await handleSubmitLevel();
    } catch (err) {
      console.error('Auto-submit failed:', err);
    }
  }, [attempt]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/student')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions?.[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gray-50">
      <ExamHeader
        exam={exam}
        level={level}
        timeRemaining={timeRemaining}
        onExit={() => navigate('/student')}
        examTitle={exam?.title}
        totalQuestions={questions?.length}
        answeredQuestions={Object.keys(answers)?.length}
        onSubmitExam={() => setShowSubmitModal(true)}
      />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Question Display */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {currentQuestion && (
                <QuestionDisplay
                  question={currentQuestion}
                  answer={answers?.[currentQuestion?.id] || ''}
                  onAnswerChange={(answer) => handleAnswerChange(currentQuestion?.id, answer)}
                  questionNumber={currentQuestionIndex + 1}
                  totalQuestions={questions?.length}
                  questionIndex={currentQuestionIndex}
                  onFlagToggle={() => {}}
                  autoSaveStatus={autoSaving ? 'saving' : 'saved'}
                />
              )}

              <ExamControls
                onPrevious={handlePreviousQuestion}
                onNext={handleNextQuestion}
                onSubmit={() => setShowSubmitModal(true)}
                canGoNext={currentQuestionIndex < questions?.length - 1}
                canGoPrevious={currentQuestionIndex > 0}
                isLastQuestion={currentQuestionIndex === questions?.length - 1}
                hasAnswered={currentQuestion ? !!answers?.[currentQuestion?.id] : false}
                totalQuestions={questions?.length}
                onSubmitExam={() => setShowSubmitModal(true)}
              />
            </div>
          </div>

          {/* Navigation Panel */}
          <div className="space-y-6">
            <QuestionNavigation
              questions={questions}
              currentQuestionIndex={currentQuestionIndex}
              answers={answers}
              onNavigate={handleQuestionNavigation}
              onQuestionSelect={handleQuestionNavigation}
              isCollapsed={false}
              onToggleCollapse={() => {}}
            />

            <AutoSaveIndicator 
              isSaving={autoSaving} 
              status={autoSaving ? 'saving' : 'saved'}
              lastSaved={new Date()}
            />

            {/* Progress Summary */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Progress</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Answered:</span>
                  <span>{Object.keys(answers)?.length}/{questions?.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Level:</span>
                  <span>{level}/{exam?.total_levels}</span>
                </div>
                <div className="flex justify-between">
                  <span>Time Left:</span>
                  <span className={timeRemaining < 300 ? 'text-red-600 font-medium' : ''}>
                    {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60)?.toString()?.padStart(2, '0')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Submit Confirmation Modal */}
      <SubmitConfirmationModal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        onConfirm={handleSubmitLevel}
        answeredCount={Object.keys(answers)?.length}
        totalQuestions={questions?.length}
        examTitle={exam?.title}
        answeredQuestions={Object.keys(answers)?.length}
        flaggedQuestions={0}
        timeRemaining={timeRemaining}
      />
    </div>
  );
}