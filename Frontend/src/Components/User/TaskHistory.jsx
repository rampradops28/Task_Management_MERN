import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBRow,
  MDBCol,
  MDBIcon,
  MDBBadge,
  MDBSpinner,
  MDBTypography,
  MDBBtn,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
} from 'mdb-react-ui-kit';
import '../styles/TaskHistory.css';
import { API_ENDPOINTS } from '../config/api'; // Add this import at the top


function TaskHistory() {
  const [completedTasks, setCompletedTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortField, setSortField] = useState('completedAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterPriority, setFilterPriority] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    highPriority: 0,
    mediumPriority: 0,
    lowPriority: 0,
    averageCompletionTime: 0
  });

  useEffect(() => {
    fetchCompletedTasks();
  }, []);

  const fetchCompletedTasks = async () => {
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
        const completedTasks = response.data.data.filter(task => task.status === 'completed');
        setCompletedTasks(completedTasks);
        calculateStats(completedTasks);
      } else {
        throw new Error(response.data.message || 'Failed to fetch tasks');
      }
    } catch (error) {
      setError(error.message);
      console.error('Error fetching completed tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (tasks) => {
    const stats = {
      total: tasks.length,
      highPriority: tasks.filter(task => task.priority === 'high').length,
      mediumPriority: tasks.filter(task => task.priority === 'medium').length,
      lowPriority: tasks.filter(task => task.priority === 'low').length,
      averageCompletionTime: 0
    };

    // Calculate average completion time
    const completionTimes = tasks.map(task => {
      const start = new Date(task.createdAt);
      const end = new Date(task.lastUpdateTimestamp);
      return end - start;
    });

    if (completionTimes.length > 0) {
      const avgTime = completionTimes.reduce((a, b) => a + b, 0) / completionTimes.length;
      stats.averageCompletionTime = avgTime;
    }

    setStats(stats);
  };

  const formatDuration = (ms) => {
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
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

  const getSortedAndFilteredTasks = () => {
    let filteredTasks = [...completedTasks];
    
    // Apply priority filter
    if (filterPriority !== 'all') {
      filteredTasks = filteredTasks.filter(task => task.priority === filterPriority);
    }

    // Apply sorting
    filteredTasks.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === 'completedAt') {
        aValue = new Date(a.lastUpdateTimestamp);
        bValue = new Date(b.lastUpdateTimestamp);
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filteredTasks;
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
      <MDBRow className="mb-4">
        <MDBCol>
          <h2 className="h2 mb-4">Task History</h2>
          
          {/* Stats Cards */}
          <MDBRow className="g-4 mb-4">
            <MDBCol lg="3" md="6">
              <MDBCard className="stat-card h-100">
                <MDBCardBody className="text-center">
                  <MDBIcon fas icon="tasks" size="2x" className="mb-3 text-primary" />
                  <h3 className="h4 mb-2">{stats.total}</h3>
                  <p className="text-muted mb-0">Total Tasks Completed</p>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
            <MDBCol lg="3" md="6">
              <MDBCard className="stat-card h-100">
                <MDBCardBody className="text-center">
                  <MDBIcon fas icon="exclamation-circle" size="2x" className="mb-3 text-danger" />
                  <h3 className="h4 mb-2">{stats.highPriority}</h3>
                  <p className="text-muted mb-0">High Priority Completed</p>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
            <MDBCol lg="3" md="6">
              <MDBCard className="stat-card h-100">
                <MDBCardBody className="text-center">
                  <MDBIcon fas icon="clock" size="2x" className="mb-3 text-warning" />
                  <h3 className="h4 mb-2">{formatDuration(stats.averageCompletionTime)}</h3>
                  <p className="text-muted mb-0">Average Completion Time</p>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
            <MDBCol lg="3" md="6">
              <MDBCard className="stat-card h-100">
                <MDBCardBody className="text-center">
                  <MDBIcon fas icon="chart-line" size="2x" className="mb-3 text-success" />
                  <h3 className="h4 mb-2">{((stats.highPriority + stats.mediumPriority) / stats.total * 100).toFixed(0)}%</h3>
                  <p className="text-muted mb-0">High/Medium Priority Ratio</p>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          </MDBRow>

          {/* Filters and Controls */}
          <MDBRow className="mb-4 align-items-center">
            <MDBCol md="6" className="mb-3 mb-md-0">
              <MDBDropdown>
                <MDBDropdownToggle color='light'>
                  Priority: {filterPriority.charAt(0).toUpperCase() + filterPriority.slice(1)}
                </MDBDropdownToggle>
                <MDBDropdownMenu>
                  <MDBDropdownItem link onClick={() => setFilterPriority('all')}>All</MDBDropdownItem>
                  <MDBDropdownItem link onClick={() => setFilterPriority('high')}>High</MDBDropdownItem>
                  <MDBDropdownItem link onClick={() => setFilterPriority('medium')}>Medium</MDBDropdownItem>
                  <MDBDropdownItem link onClick={() => setFilterPriority('low')}>Low</MDBDropdownItem>
                </MDBDropdownMenu>
              </MDBDropdown>
            </MDBCol>
            <MDBCol md="6" className="text-md-end">
              <MDBBtn 
                color='light' 
                onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                className="me-2"
              >
                <MDBIcon fas icon={sortOrder === 'asc' ? 'sort-amount-down' : 'sort-amount-up'} className="me-2" />
                {sortOrder === 'asc' ? 'Oldest First' : 'Newest First'}
              </MDBBtn>
            </MDBCol>
          </MDBRow>

          {/* Task History Table */}
          <div className="table-responsive">
            <MDBTable hover className="task-history-table">
              <MDBTableHead light>
                <tr>
                  <th>Task</th>
                  <th>Priority</th>
                  <th className="d-none d-md-table-cell">Assigned By</th>
                  <th className="d-none d-lg-table-cell">Completion Time</th>
                  <th>Completed Date</th>
                </tr>
              </MDBTableHead>
              <MDBTableBody>
                {getSortedAndFilteredTasks().map((task) => (
                  <tr key={task._id} className="task-row">
                    <td>
                      <div className="d-flex flex-column">
                        <span className="fw-bold">{task.title}</span>
                        <small className="text-muted">{task.description}</small>
                      </div>
                    </td>
                    <td>
                      <MDBBadge color={getPriorityColor(task.priority)} pill>
                        {task.priority}
                      </MDBBadge>
                    </td>
                    <td className="d-none d-md-table-cell">
                      {task.assignedBy?.username || 'Admin'}
                    </td>
                    <td className="d-none d-lg-table-cell">
                      {formatDuration(new Date(task.lastUpdateTimestamp) - new Date(task.createdAt))}
                    </td>
                    <td>
                      {new Date(task.lastUpdateTimestamp).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </MDBTableBody>
            </MDBTable>
          </div>

          {completedTasks.length === 0 && (
            <MDBCard className="text-center mt-4">
              <MDBCardBody>
                <MDBIcon far icon="clock" size="3x" className="text-muted mb-3" />
                <MDBTypography tag="h5">No completed tasks yet</MDBTypography>
                <p className="text-muted mb-0">Complete some tasks to see your history here.</p>
              </MDBCardBody>
            </MDBCard>
          )}
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default TaskHistory; 