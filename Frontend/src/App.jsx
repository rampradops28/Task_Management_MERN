import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { AuthContext } from './Components/context/AuthContext'; 
import { AuthProvider } from './Components/context/AuthContext';

// Layouts
import Navbar from './Components/Navbar';

// Public Pages
import Home from './Components/LandingPage';
import Login from './Components/Admin/Login';
import UserLogin from './Components/User/UserLogin';
import Register from './Components/User/UserRegister';
import Admin from './Components/Admin/AdminRegister';

// Protected Admin Pages
import AdminDashboard from './Components/Admin/Dashboard';
import ManageUsers from './Components/Admin/ManageUsers'; 
import AssignTask from './Components/Admin/AssignTask';
import AssignedTasks from './Components/Admin/AssignedTasks';
import UserTasks from './Components/Admin/UserTasks';

// Protected User Pages
import UserDashboard from './Components/User/UserDashboard';
import MyTasks from './Components/User/MyTasks';
import TaskHistory from './Components/User/TaskHistory';

// Shared Components 
import ProtectedRoute from './Components/context/ProtectedRoute';
import AdminProfile from './Components/Admin/AdminProfile';
import UserProfile from './Components/User/UserProfile';

// Layout component for authenticated pages (includes Navbar)
const AuthenticatedLayout = ({ children }) => {
  return (
    <div className="authenticated-layout">
      <Navbar />
      <main className="authenticated-content">
        {children}
      </main>
    </div>
  );
};

// Layout for public pages (no Navbar)
const PublicLayout = ({ children }) => {
  return (
    <div className="app-container">
      <div className="main-content">
        {children}
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider> 
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route 
              path="/" 
              element={
                <PublicLayout>
                  <Home />
                </PublicLayout>
              } 
            />
            <Route 
              path="/login-admin" 
              element={
                <PublicLayout>
                  <Login />
                </PublicLayout>
              } 
            />
            <Route 
              path="/login-user" 
              element={
                <PublicLayout>
                  <UserLogin />
                </PublicLayout>
              } 
            />
            <Route 
              path="/register-user" 
              element={
                <PublicLayout>
                  <Register />
                </PublicLayout>
              } 
            />
            <Route 
              path="/register-admin" 
              element={
                <PublicLayout>
                  <Admin />
                </PublicLayout>
              } 
            />

            {/* Protected Admin Routes */}
            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AuthenticatedLayout>
                    <AdminDashboard />
                  </AuthenticatedLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/assign-task"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AuthenticatedLayout>
                    <AssignTask />
                  </AuthenticatedLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/manage-tasks"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AuthenticatedLayout>
                    <ManageUsers />
                  </AuthenticatedLayout>
                </ProtectedRoute>
              }
            /> 

            <Route
              path="/assigned-tasks"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AuthenticatedLayout>
                    <AssignedTasks />
                  </AuthenticatedLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/user-tasks/:userId"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AuthenticatedLayout>
                    <UserTasks />
                  </AuthenticatedLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-profile"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AuthenticatedLayout>
                    <AdminProfile />
                  </AuthenticatedLayout>
                </ProtectedRoute>
              }
            />

            {/* Protected User Routes */}
            <Route
              path="/user-dashboard"
              element={
                <ProtectedRoute allowedRoles={['user']}>
                  <AuthenticatedLayout>
                    <UserDashboard />
                  </AuthenticatedLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-tasks"
              element={
                <ProtectedRoute allowedRoles={['user']}>
                  <AuthenticatedLayout>
                    <MyTasks />
                  </AuthenticatedLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/task-history"
              element={
                <ProtectedRoute allowedRoles={['user']}>
                  <AuthenticatedLayout>
                    <TaskHistory />
                  </AuthenticatedLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/user-profile"
              element={
                <ProtectedRoute allowedRoles={['user']}>
                  <AuthenticatedLayout>
                    <UserProfile />
                  </AuthenticatedLayout>
                </ProtectedRoute>
              }
            />

            {/* Catch all route - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter> 
    </AuthProvider>
  );
}

export default App;
