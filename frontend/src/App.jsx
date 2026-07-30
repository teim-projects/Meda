import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/reuse/Sidebar';
import Dashboard from './components/reuse/Dashboard';
import Login from './components/reuse/Login';
import Accounts from './components/accounts/Accounts';

// Strict Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Error parsing session user', e);
      }
    }
  }, []);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    localStorage.clear();
    setCurrentUser(null);
  };

  const isAuthenticated = () => {
    return !!localStorage.getItem('token');
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Root Route -> Opens /login by default if unauthenticated */}
        <Route 
          path="/" 
          element={<Navigate to={isAuthenticated() ? "/dashboard" : "/login"} replace />} 
        />

        {/* Public Login Route */}
        <Route 
          path="/login" 
          element={
            isAuthenticated() ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Login onLoginSuccess={handleLoginSuccess} />
            )
          } 
        />

        {/* Protected Dashboard Route */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Sidebar currentUser={currentUser} onLogout={handleLogout}>
                <Dashboard currentUser={currentUser} />
              </Sidebar>
            </ProtectedRoute>
          } 
        />

        {/* Protected Accounts Route (Staff & Category Management) */}
        <Route 
          path="/accounts" 
          element={
            <ProtectedRoute>
              <Sidebar currentUser={currentUser} onLogout={handleLogout}>
                <Accounts />
              </Sidebar>
            </ProtectedRoute>
          } 
        />

        {/* Protected Analytics Route */}
        <Route 
          path="/analytics" 
          element={
            <ProtectedRoute>
              <Sidebar currentUser={currentUser} onLogout={handleLogout}>
                <Dashboard currentUser={currentUser} />
              </Sidebar>
            </ProtectedRoute>
          } 
        />

        {/* Protected Settings Route */}
        <Route 
          path="/settings" 
          element={
            <ProtectedRoute>
              <Sidebar currentUser={currentUser} onLogout={handleLogout}>
                <Dashboard currentUser={currentUser} />
              </Sidebar>
            </ProtectedRoute>
          } 
        />

        {/* Security Catch-All Wildcard Route */}
        <Route 
          path="*" 
          element={<Navigate to={isAuthenticated() ? "/dashboard" : "/login"} replace />} 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
