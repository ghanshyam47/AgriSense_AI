import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import i18n from './i18n';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import AboutUs from './pages/AboutUs';
import Solutions from './pages/Solutions';
import Innovation from './pages/Innovation';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';

// Simple auth context — replace with real auth later
function ProtectedRoute({ children }) {
  const isLoggedIn = sessionStorage.getItem('agri_authed') === 'true';
  return isLoggedIn ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);

  return (
    <div className="min-h-screen">
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/solutions" element={<Solutions />} />
        <Route path="/innovation" element={<Innovation />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard language={language} setLanguage={setLanguage} />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
