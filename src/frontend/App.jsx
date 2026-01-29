import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './layout';
import Login from './login';
import Register from './register';
import AdminDashboard from './admin';
import StudentPage from './StudentPage';

// Protected Route Component for Admin
const AdminProtectedRoute = ({ children }) => {
  const isAuthenticated = sessionStorage.getItem('IsAuthenticated');
  const userRole = sessionStorage.getItem('Role');

  if (!isAuthenticated || userRole !== 'Admin') {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Protected Route Component for Student
const StudentProtectedRoute = ({ children }) => {
  const isAuthenticated = sessionStorage.getItem('IsAuthenticated');
  const userRole = sessionStorage.getItem('Role');

  if (!isAuthenticated || userRole !== 'Student') {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/admin/dashboard"
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/student/dashboard"
          element={
            <StudentProtectedRoute>
              <StudentPage />
            </StudentProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;     