import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import StudyPlanner from './pages/StudyPlanner';
import AITutor from './pages/AITutor';
import Notes from './pages/Notes';
import Quiz from './pages/Quiz';
import Roadmap from './pages/Roadmap';
import MainLayout from './layouts/MainLayout';

import LearnNew from './pages/LearnNew';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="h-screen w-screen flex items-center justify-center bg-brand-bg text-white">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/dashboard/*" element={
            <ProtectedRoute>
              <MainLayout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/planner" element={<StudyPlanner />} />
                  <Route path="/tutor" element={<AITutor />} />
                  <Route path="/notes" element={<Notes />} />
                  <Route path="/quiz" element={<Quiz />} />
                  <Route path="/roadmap" element={<Roadmap />} />
                  <Route path="/learn" element={<LearnNew />} />
                </Routes>
              </MainLayout>
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
