import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import AdminDashboard from './pages/admin-dashboard';
import ExamCreationManagement from './pages/exam-creation-management';
import Login from './pages/login';
import ExamInterface from './pages/exam-interface';
import StudentDashboard from './pages/student-dashboard';
import ResultsAnalytics from './pages/results-analytics';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/exam/:examId/level/:level" element={<ExamInterface />} />
        <Route path="/results/:attemptId" element={<ResultsAnalytics />} />
        <Route path="*" element={<NotFound />} />
        
        {/* Legacy routes for development preview */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/exam-creation-management" element={<ExamCreationManagement />} />
        <Route path="/exam-interface" element={<ExamInterface />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/results-analytics" element={<ResultsAnalytics />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;