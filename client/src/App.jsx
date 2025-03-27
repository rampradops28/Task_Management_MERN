import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'
import Home from './Components/LandingPage';
import Login from './Components/Admin/Login';
import Register from './Components/User/UserRegister';
import Admin from './Components/Admin/AdminRegister';
import AdminDashboard from './Components/Admin/Dashboard';
import UserDashboard from './Components/User/UserDashboard';
import UserLogin from './Components/User/UserLogin';
import Profile from './Components/Profile';


function App() {
  
  return (
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/user" element={<Register />} />
          <Route path="/login-admin" element={<Login />} /> 
          <Route path="/login-user" element={<UserLogin />} />
          <Route path="/Admin" element={<Admin />} />  
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Router>
  )
}

export default App
