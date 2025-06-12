import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBBtn,
  MDBIcon,
  MDBBadge,
  MDBRow,
  MDBCol,
  MDBSpinner,
  MDBTypography
} from 'mdb-react-ui-kit';
import '../styles/MyTasks.css';
import { API_ENDPOINTS } from '../config/api';

function MyTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [updatingTaskId, setUpdatingTaskId] = useState(null);
  const [completedTaskCount, setCompletedTaskCount] = useState(0);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const userId = localStorage.getItem('userId');

      if (!token || !userId) {
        throw new Error('Authentication required');
      }

      const response = await axios.get(API_ENDPOINTS.GET_USER_TASKS(userId), {
        headers: { 'x-access-token': token }
      });

      if (response.data.success) {
        const allTasks = response.data.data;
        const activeTasks = allTasks.filter(task => task.status !== 'completed');
        const completedCount = allTasks.length - activeTasks.length;
        
        setTasks(activeTasks);
        setCompletedTaskCount(completedCount);
      } else {
        throw new Error(response.data.message || 'Failed to fetch tasks');
      }
    } catch (error) {
      setError(error.message);
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  // Only allow marking as completed, no version/concurrency logic
  const updateTaskStatus = async (taskId, newStatus) => {
    setUpdatingTaskId(taskId);
    try {
      const token = localStorage.getItem('userToken');
      const userId = localStorage.getItem('userId');

      if (!token || !userId) {
        throw new Error('Authentication required');
      }

      const task = tasks.find(t => t._id === taskId);
      if (!task) {
        throw new Error('Task not found');
      }

      const response = await axios.put(
        API_ENDPOINTS.UPDATE_USER_TASK_STATUS(taskId),
        { status: newStatus },
        {
          headers: {
            'x-access-token': token,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setMessage({ text: 'Task status updated successfully!', type: 'success' });
        
        if (newStatus === 'completed') {
          setTasks(prevTasks => prevTasks.filter(t => t._id !== taskId));
          setCompletedTaskCount(prev => prev + 1);
          setMessage({ 
            text: '🎉 Congratulations! Task completed successfully!', 
            type: 'success' 
          });
        } else {
          setTasks(prevTasks => prevTasks.map(t => 
            t._id === taskId ? response.data.data : t
          ));
        }
      }
    } catch (error) {
      console.error('Error updating task:', error);
      setMessage({ 
        text: error.response?.data?.message || 'Error updating task status',
        type: 'danger'
      });
    } finally {
      setUpdatingTaskId(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'success';
      case 'in-progress':
        return 'warning';
      default:
        return 'primary';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'danger';
      case 'medium':
        return 'warning';
      default:
        return 'info';
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <MDBSpinner role="status">
          <span className="visually-hidden">Loading...</span>
        </MDBSpinner>
      </div>
    );
  }

  return (
    <MDBContainer className="py-5">
      <MDBRow className="header-section mb-4">
        <MDBCol>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="h2 mb-0">My Tasks</h2>
            {completedTaskCount > 0 && (
              <MDBBadge color="success" className="ms-2 p-2">
                {completedTaskCount} task{completedTaskCount !== 1 ? 's' : ''} completed
              </MDBBadge>
            )}
          </div>
          {message.text && (
            <div 
              className={`alert alert-${message.type} alert-dismissible fade show mb-4`}
              role="alert"
            >
              <MDBIcon 
                fas 
                icon={message.type === 'success' ? 'check-circle' : 'exclamation-circle'} 
                className="me-2"
              />
              {message.text}
              <button
                type="button"
                className="btn-close"
                onClick={() => setMessage({ text: '', type: '' })}
                aria-label="Close"
              />
            </div>
          )}
        </MDBCol>
      </MDBRow>

      {tasks.length === 0 ? (
        <MDBCard className="mb-4">
          <MDBCardBody className="text-center">
            <MDBIcon 
              far 
              icon="check-circle" 
              size="3x" 
              className="text-success mb-3"
            />
            <MDBTypography tag="h4" className="mb-3">All caught up!</MDBTypography>
            <p className="text-muted mb-0">
              {completedTaskCount > 0 
                ? `You've completed ${completedTaskCount} task${completedTaskCount !== 1 ? 's' : ''}. Great job!` 
                : 'No tasks assigned yet.'}
            </p>
          </MDBCardBody>
        </MDBCard>
      ) : (
        <MDBRow>
          {tasks.map((task) => (
            <MDBCol key={task._id} size="12" className="mb-4">
              <MDBCard className="task-card h-100">
                <MDBCardBody>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="card-title mb-0">{task.title}</h5>
                    <div>
                      <MDBBadge 
                        color={getPriorityColor(task.priority)} 
                        className="priority-badge me-2"
                      >
                        {task.priority}
                      </MDBBadge>
                      <MDBBadge 
                        color={getStatusColor(task.status)} 
                        className="status-badge"
                      >
                        {task.status}
                      </MDBBadge>
                    </div>
                  </div>

                  <p className="task-description mb-4">{task.description}</p>

                  <div className="d-flex justify-content-between align-items-center">
                    <div className="task-metadata">
                      <p className="mb-0 text-muted">
                        <small>
                          Deadline: {new Date(task.deadline).toLocaleDateString()}
                        </small>
                      </p>
                      <p className="mb-0 text-muted">
                        <small>
                          Assigned by: {task.assignedBy?.username || 'Admin'}
                        </small>
                      </p>
                      {task.lastUpdatedBy && (
                        <p className="mb-0 text-muted">
                          <small>
                            Last updated: {new Date(task.lastUpdateTimestamp).toLocaleString()} by {task.lastUpdatedBy.username}
                          </small>
                        </p>
                      )}
                    </div>
                  </div>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          ))}
        </MDBRow>
      )}
    </MDBContainer>
  );
}

export default MyTasks;