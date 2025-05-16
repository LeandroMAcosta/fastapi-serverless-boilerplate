import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Amplify } from 'aws-amplify';
import config from './config/amplify';
import { useAuth } from './hooks/useAuth';
import { MainLayout } from './components/layout/MainLayout';
import LoginForm from './pages/Auth/LoginForm';
import SignupForm from './pages/Auth/SignupForm';
import ConfirmSignupForm from './pages/Auth/ConfirmSignupForm';
import Home from './pages/Home';

// Initialize Amplify
Amplify.configure(config);

function App() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <MainLayout>
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/home" /> : <LoginForm />} />
        <Route
          path="/signup"
          element={isAuthenticated ? <Navigate to="/home" /> : <SignupForm />}
        />
        <Route
          path="/confirm-signup"
          element={isAuthenticated ? <Navigate to="/home" /> : <ConfirmSignupForm />}
        />
        <Route path="/home" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
        <Route path="/" element={<Navigate to={isAuthenticated ? '/home' : '/login'} />} />
      </Routes>
    </MainLayout>
  );
}

export default App;
