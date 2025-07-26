import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
// Add your imports here
import LoginRegister from "pages/login-register";
import InterviewScheduling from "pages/interview-scheduling";
import Dashboard from "pages/dashboard";
import InterviewHistoryAnalytics from "pages/interview-history-analytics";
import LiveInterviewRoom from "pages/live-interview-room";
import UserProfileSettings from "pages/user-profile-settings";
import NotFound from "pages/NotFound";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your routes here */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/login-register" element={<LoginRegister />} />
        <Route path="/interview-scheduling" element={<InterviewScheduling />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/interview-history-analytics" element={<InterviewHistoryAnalytics />} />
        <Route path="/live-interview-room" element={<LiveInterviewRoom />} />
        <Route path="/user-profile-settings" element={<UserProfileSettings />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;