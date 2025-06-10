import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBIcon,
  MDBBtn,
  MDBSpinner,
  MDBTypography
} from 'mdb-react-ui-kit';
import { AuthContext } from '../context/AuthContext';
import '../styles/Dashboard.css';
import { API_ENDPOINTS } from '../config/api';

function UserDashboard() {
  const [taskStats, setTaskStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    inProgress: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchTaskStats();
  }, []);

  const fetchTaskStats = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const userId = localStorage.getItem('userId');

      if (!token || !userId) {
        throw new Error('Authentication information missing');
      }

      const response = await axios.get(API_ENDPOINTS.GET_USER_TASKS(userId), {
        headers: { 
          'x-access-token': token,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.success) {
        const tasks = response.data.data || [];
        
        const stats = tasks.reduce((acc, task) => {
          acc.total++;
          const status = task.status.toLowerCase().replace(/\s+/g, '');
          if (acc[status] !== undefined) {
            acc[status]++;
          }
          return acc;
        }, { total: 0, completed: 0, pending: 0, inProgress: 0 });
        
        setTaskStats(stats);
      } else {
        throw new Error(response.data.message || 'Failed to fetch tasks');
      }
    } catch (error) {
      console.error('Error fetching task stats:', error);
      setError(error.response?.data?.message || error.message || 'Failed to fetch task statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <MDBSpinner role='status'>
          <span className='visually-hidden'>Loading...</span>
        </MDBSpinner>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <MDBIcon fas icon="exclamation-circle" className="error-icon" />
        <h3>Error Loading Dashboard</h3>
        <p className="error-message">{error}</p>
        <MDBBtn color="primary" onClick={() => window.location.reload()}>
          Try Again
        </MDBBtn>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Welcome Section */}
      <div className="welcome-section animate-fadeInUp">
        <MDBTypography tag='h1' className="welcome-title">
          Welcome back, {user?.username || 'User'}!
        </MDBTypography>
        <p className="mb-0">Here's an overview of your tasks and activities</p>
      </div>
      
      {/* Task Statistics */}
      <MDBRow className="g-4 mb-4">
        <MDBCol xl="3" md="6">
          <div className="stats-card animate-fadeInUp">
            <div className="stats-icon total">
              <MDBIcon fas icon="tasks" />
            </div>
            <div className="stats-value">{taskStats.total}</div>
            <div className="stats-label">Total Tasks</div>
          </div>
        </MDBCol>

        <MDBCol xl="3" md="6">
          <div className="stats-card animate-fadeInUp" style={{animationDelay: '0.1s'}}>
            <div className="stats-icon completed">
              <MDBIcon fas icon="check-circle" />
            </div>
            <div className="stats-value">{taskStats.completed}</div>
            <div className="stats-label">Completed Tasks</div>
          </div>
        </MDBCol>

        <MDBCol xl="3" md="6">
          <div className="stats-card animate-fadeInUp" style={{animationDelay: '0.2s'}}>
            <div className="stats-icon in-progress">
              <MDBIcon fas icon="clock" />
            </div>
            <div className="stats-value">{taskStats.inProgress}</div>
            <div className="stats-label">In Progress</div>
          </div>
        </MDBCol>

        <MDBCol xl="3" md="6">
          <div className="stats-card animate-fadeInUp" style={{animationDelay: '0.3s'}}>
            <div className="stats-icon pending">
              <MDBIcon fas icon="hourglass-start" />
            </div>
            <div className="stats-value">{taskStats.pending}</div>
            <div className="stats-label">Pending Tasks</div>
          </div>
        </MDBCol>
      </MDBRow>

      {/* Quick Actions */}
      <section className="quick-actions">
        <MDBTypography tag='h2' className="mb-4">Quick Actions</MDBTypography>
        <MDBRow className="g-4">
          <MDBCol md="6" lg="4">
            <Link to="/my-tasks" className="text-decoration-none">
              <div className="action-card animate-fadeInUp" style={{animationDelay: '0.4s'}}>
                <MDBIcon fas icon="clipboard-list" className="action-icon text-primary" />
                <h3 className="action-title">View My Tasks</h3>
                <p className="action-description">Check your assigned tasks and their status</p>
              </div>
            </Link>
          </MDBCol>

          <MDBCol md="6" lg="4">
            <Link to="/task-history" className="text-decoration-none">
              <div className="action-card animate-fadeInUp" style={{animationDelay: '0.5s'}}>
                <MDBIcon fas icon="history" className="action-icon text-info" />
                <h3 className="action-title">Task History</h3>
                <p className="action-description">View your completed tasks and performance</p>
              </div>
            </Link>
          </MDBCol>

          <MDBCol md="6" lg="4">
            <Link to="/user-profile" className="text-decoration-none">
              <div className="action-card animate-fadeInUp" style={{animationDelay: '0.6s'}}>
                <MDBIcon fas icon="user-circle" className="action-icon text-success" />
                <h3 className="action-title">Profile Settings</h3>
                <p className="action-description">Update your profile information</p>
              </div>
            </Link>
          </MDBCol>
        </MDBRow>
      </section>
    </div>
  );
}

export default UserDashboard;
