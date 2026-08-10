import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/reuse/Sidebar';
import Dashboard from './components/reuse/Dashboard';
import Login from './components/reuse/Login';
import Accounts from './components/accounts/Accounts';
import Templates from './components/templates/Templates';
import ShowData from './components/templates/ShowData';

// MEDA Integration Page Imports
import MedaLogin from './components/meda/MedaLogin';
import MedaFetch from './components/meda/MedaFetch';
import MedaSyncHistory from './components/meda/MedaSyncHistory';
import MedaRawData from './components/meda/MedaRawData';
import MedaApiLogs from './components/meda/MedaApiLogs';
import { medaApi } from './services/medaApi';

// Strict Protected Route Wrapper for Superuser Auth
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Meda Access Guard: Only accessible when MEDA login/connection is active
const MedaProtectedRoute = ({ children, isMedaConnected }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  if (!isMedaConnected) {
    return <Navigate to="/meda/login" replace />;
  }
  return children;
};

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isMedaConnected, setIsMedaConnected] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Error parsing session user', e);
      }
    }

    // Check MEDA connection status
    medaApi.getStatus()
      .then((res) => setIsMedaConnected(res.is_connected))
      .catch(() => setIsMedaConnected(false));
  }, []);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    localStorage.clear();
    setCurrentUser(null);
    setIsMedaConnected(false);
  };

  const handleMedaConnectionChange = (connected) => {
    setIsMedaConnected(connected);
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
              <Sidebar currentUser={currentUser} onLogout={handleLogout} isMedaConnected={isMedaConnected}>
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
              <Sidebar currentUser={currentUser} onLogout={handleLogout} isMedaConnected={isMedaConnected}>
                <Accounts />
              </Sidebar>
            </ProtectedRoute>
          } 
        />

        {/* Protected Energy Templates Route */}
        <Route 
          path="/energy-templates" 
          element={
            <ProtectedRoute>
              <Sidebar currentUser={currentUser} onLogout={handleLogout} isMedaConnected={isMedaConnected}>
                <Templates />
              </Sidebar>
            </ProtectedRoute>
          } 
        />

        {/* Protected Energy Show Data Route */}
        <Route 
          path="/show-data" 
          element={
            <ProtectedRoute>
              <Sidebar currentUser={currentUser} onLogout={handleLogout} isMedaConnected={isMedaConnected}>
                <ShowData />
              </Sidebar>
            </ProtectedRoute>
          } 
        />

        {/* Protected Analytics Route */}
        <Route 
          path="/analytics" 
          element={
            <ProtectedRoute>
              <Sidebar currentUser={currentUser} onLogout={handleLogout} isMedaConnected={isMedaConnected}>
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
              <Sidebar currentUser={currentUser} onLogout={handleLogout} isMedaConnected={isMedaConnected}>
                <Dashboard currentUser={currentUser} />
              </Sidebar>
            </ProtectedRoute>
          } 
        />

        {/* ========================================================= */}
        {/* MEDA INTEGRATION MODULE ROUTES                            */}
        {/* ========================================================= */}

        {/* 1. MEDA Login Page */}
        <Route 
          path="/meda/login" 
          element={
            <ProtectedRoute>
              <Sidebar currentUser={currentUser} onLogout={handleLogout} isMedaConnected={isMedaConnected}>
                <MedaLogin onConnectionChange={handleMedaConnectionChange} />
              </Sidebar>
            </ProtectedRoute>
          } 
        />

        {/* 2. Fetch Data Page */}
        <Route 
          path="/meda/fetch" 
          element={
            <MedaProtectedRoute isMedaConnected={isMedaConnected}>
              <Sidebar currentUser={currentUser} onLogout={handleLogout} isMedaConnected={isMedaConnected}>
                <MedaFetch />
              </Sidebar>
            </MedaProtectedRoute>
          } 
        />

        {/* 3. Sync History Page */}
        <Route 
          path="/meda/sync-history" 
          element={
            <MedaProtectedRoute isMedaConnected={isMedaConnected}>
              <Sidebar currentUser={currentUser} onLogout={handleLogout} isMedaConnected={isMedaConnected}>
                <MedaSyncHistory />
              </Sidebar>
            </MedaProtectedRoute>
          } 
        />

        {/* 4. Raw Data Page */}
        <Route 
          path="/meda/raw-data" 
          element={
            <MedaProtectedRoute isMedaConnected={isMedaConnected}>
              <Sidebar currentUser={currentUser} onLogout={handleLogout} isMedaConnected={isMedaConnected}>
                <MedaRawData />
              </Sidebar>
            </MedaProtectedRoute>
          } 
        />

        {/* 5. API Logs Page */}
        <Route 
          path="/meda/api-logs" 
          element={
            <MedaProtectedRoute isMedaConnected={isMedaConnected}>
              <Sidebar currentUser={currentUser} onLogout={handleLogout} isMedaConnected={isMedaConnected}>
                <MedaApiLogs />
              </Sidebar>
            </MedaProtectedRoute>
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
