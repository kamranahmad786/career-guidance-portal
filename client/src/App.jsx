import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import Login from './pages/auth/Login';
import Dashboard from './pages/student/Dashboard';
import Quiz from './pages/student/Quiz';
import Recommendations from './pages/student/Recommendations';
import Chatbot from './components/common/Chatbot';

import Landing from './pages/Landing';
import Register from './pages/auth/Register';
import Library from './pages/Library';
import StakeholderDetail from './pages/StakeholderDetail';
import ActivityGames from './pages/student/ActivityGames';
import QuizResults from './pages/student/QuizResults';
import Profile from './pages/student/Profile';
import Settings from './pages/student/Settings';
import ParentLayout from './layouts/ParentLayout';
import ParentOverview from './pages/parent/Overview';
import ParentProfile from './pages/parent/Profile';
import ParentResults from './pages/parent/Results';
import ParentCareers from './pages/parent/Careers';
import ParentProgress from './pages/parent/Progress';
import ParentActivities from './pages/parent/Activities';
import ParentNotifications from './pages/parent/Notifications';
import QuizReportDetail from './pages/parent/QuizReportDetail';

// Define other missing pages as stubs if they don't exist yet to prevent errors
const NotFound = () => <div className="p-8 text-red-500"><h2 className="text-xl">404 - Page Not Found</h2></div>;
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="font-sans relative bg-[#f4f7f9] min-h-screen">
          
          {/* Routes */}
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/library" element={<Library />} />
            <Route path="/stakeholder/:type" element={<StakeholderDetail />} />
            
            {/* Student Routes */}
            <Route path="/student/dashboard" element={<Dashboard />} />
            <Route path="/student/quiz" element={<Quiz />} />
            <Route path="/student/recommendations" element={<Recommendations />} />
            <Route path="/student/results" element={<QuizResults />} />
            <Route path="/student/activities" element={<ActivityGames />} />
            <Route path="/student/profile" element={<Profile />} />
            <Route path="/student/settings" element={<Settings />} />

            {/* Parent Routes - 100% Stable Routed Architecture */}
            <Route path="/parent" element={<ParentLayout />}>
              <Route index element={<ParentOverview />} />
              <Route path="dashboard" element={<ParentOverview />} />
              <Route path="profile" element={<ParentProfile />} />
              <Route path="results" element={<ParentResults />} />
              <Route path="careers" element={<ParentCareers />} />
              <Route path="progress" element={<ParentProgress />} />
              <Route path="activities" element={<ParentActivities />} />
              <Route path="notifications" element={<ParentNotifications />} />
              <Route path="result/:id" element={<QuizReportDetail />} />
            </Route>

            {/* Teacher & Admin Placeholders */}
            <Route path="/teacher/dashboard" element={<div className="p-20 text-center"><h1 className="text-3xl font-bold">Teacher Dashboard Coming Soon</h1><p className="mt-4 text-slate-600 font-medium">Welcome, Educator! We are building your specialized tools.</p></div>} />
            <Route path="/admin/dashboard" element={<div className="p-20 text-center"><h1 className="text-3xl font-bold">Admin Portal</h1><p className="mt-4 text-slate-600 font-medium">System Management Interface</p></div>} />

            <Route path="*" element={<NotFound />} />
          </Routes>

          {/* Global Chatbot */}
          <Chatbot />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
