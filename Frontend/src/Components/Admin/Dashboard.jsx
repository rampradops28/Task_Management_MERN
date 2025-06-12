import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBIcon,
  MDBTypography,
  MDBBadge,
  MDBBtn,
  MDBInput,
  MDBSpinner,
  MDBTable,
  MDBTableHead,
  MDBTableBody
} from 'mdb-react-ui-kit';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { saveAs } from 'file-saver';
import { utils, write } from 'xlsx';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { API_ENDPOINTS } from '../config/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTasks: 0,
    pendingTasks: 0,
    completedTasks: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('all');
  const [selectedUserData, setSelectedUserData] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [chartData, setChartData] = useState({
    statusData: {
      labels: [],
      datasets: []
    },
    priorityData: {
      labels: [],
      datasets: []
    }
  });

  // Fetch dashboard data
  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('AdminToken');
      const headers = { 'x-access-token': token };

      // Fetch users
      const usersResponse = await axios.get(API_ENDPOINTS.GET_USERS, { headers });
      const regularUsers = usersResponse.data.data.filter(user => 
        user.usertype !== 'admin' && user.role !== 'admin'
      );
      setUsers(regularUsers);

      // Fetch all tasks
      const tasksResponse = await axios.get(API_ENDPOINTS.GET_ALL_TASKS, { headers });
      const allTasks = tasksResponse.data.data;
      setTasks(allTasks);

      // Update overall stats
      const overallStats = {
        totalUsers: regularUsers.length,
        totalTasks: allTasks.length,
        pendingTasks: allTasks.filter(task => task.status === 'pending').length,
        completedTasks: allTasks.filter(task => task.status === 'completed').length
      };
      setStats(overallStats);

      // If a user is selected, update their stats
      if (selectedUser !== 'all') {
        const userTasks = allTasks.filter(task => task.assignedTo === selectedUser);
        updateUserStats(userTasks, selectedUser, regularUsers);
      }

      setError(null);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, [selectedUser]);

  // Function to update user-specific stats
  const updateUserStats = (userTasks, userId, usersList) => {
    const userData = usersList.find(user => user._id === userId);
    if (!userData) return;

    const totalTasks = userTasks.length;
    const completedTasks = userTasks.filter(task => task.status === 'completed');
    const pendingTasks = userTasks.filter(task => task.status === 'pending');
    
    const priorityCounts = {
      high: userTasks.filter(task => task.priority === 'high').length,
      medium: userTasks.filter(task => task.priority === 'medium').length,
      low: userTasks.filter(task => task.priority === 'low').length
    };

    setSelectedUserData({
      username: userData.username,
      totalTasks,
      completedTasks: completedTasks.length,
      pendingTasks: pendingTasks.length,
      priorities: priorityCounts,
      percentages: {
        high: totalTasks ? ((priorityCounts.high / totalTasks) * 100).toFixed(1) : 0,
        medium: totalTasks ? ((priorityCounts.medium / totalTasks) * 100).toFixed(1) : 0,
        low: totalTasks ? ((priorityCounts.low / totalTasks) * 100).toFixed(1) : 0
      }
    });

    // Update charts for the selected user
    setChartData({
      statusData: {
        labels: ['Completed', 'Pending'],
        datasets: [{
          data: [completedTasks.length, pendingTasks.length],
          backgroundColor: ['#00b74a', '#ffa900'],
          label: `${userData.username}'s Tasks`
        }]
      },
      priorityData: {
        labels: ['High', 'Medium', 'Low'],
        datasets: [{
          label: `${userData.username}'s Tasks by Priority`,
          data: [priorityCounts.high, priorityCounts.medium, priorityCounts.low],
          backgroundColor: ['#f93154', '#ffa900', '#39c0ed'],
          borderColor: ['#f93154', '#ffa900', '#39c0ed'],
          borderWidth: 1
        }]
      }
    });
  };

  // Handle user selection change
  const handleUserChange = (e) => {
    const userId = e.target.value;
    setSelectedUser(userId);
    
    if (userId === 'all') {
      setSelectedUserData(null);
      // Reset charts to show overall data
      const overallStatusData = {
        labels: ['Completed', 'Pending'],
        datasets: [{
          data: [stats.completedTasks, stats.pendingTasks],
          backgroundColor: ['#00b74a', '#ffa900'],
          label: 'All Tasks'
        }]
      };

      const allPriorityCounts = {
        high: tasks.filter(task => task.priority === 'high').length,
        medium: tasks.filter(task => task.priority === 'medium').length,
        low: tasks.filter(task => task.priority === 'low').length
      };

      setChartData({
        statusData: overallStatusData,
        priorityData: {
          labels: ['High', 'Medium', 'Low'],
          datasets: [{
            label: 'All Tasks by Priority',
            data: [allPriorityCounts.high, allPriorityCounts.medium, allPriorityCounts.low],
            backgroundColor: ['#f93154', '#ffa900', '#39c0ed'],
            borderColor: ['#f93154', '#ffa900', '#39c0ed'],
            borderWidth: 1
          }]
        }
      });
    } else {
      const userTasks = tasks.filter(task => task.assignedTo === userId);
      updateUserStats(userTasks, userId, users);
    }
  };

  // Update user stats when selected user changes
  useEffect(() => {
    if (selectedUser === 'all') {
      setUserStats(null);
      return;
    }

    const userTasks = tasks.filter(task => task.assignedTo === selectedUser);
      const completedTasks = userTasks.filter(task => task.status === 'completed');
      const pendingTasks = userTasks.filter(task => task.status === 'pending');
    
    const selectedUserData = users.find(user => user._id === selectedUser);

    // Calculate completion times for completed tasks
    const completionTimes = completedTasks.map(task => {
      const startDate = new Date(task.createdAt);
      const endDate = new Date(task.updatedAt);
      return endDate - startDate;
    });
      
    // Calculate average completion time
    const avgCompletionTime = completionTimes.length > 0
      ? completionTimes.reduce((acc, time) => acc + time, 0) / completionTimes.length
      : 0;

    // Calculate on-time completions
      const onTimeCompletions = completedTasks.filter(task => {
        const completionDate = new Date(task.updatedAt);
        const deadlineDate = new Date(task.deadline);
        return completionDate <= deadlineDate;
      });

    setUserStats({
      username: selectedUserData?.username || 'Unknown User',
      totalTasks: userTasks.length,
      completedTasks: completedTasks.length,
      pendingTasks: pendingTasks.length,
      highPriorityTasks: userTasks.filter(task => task.priority === 'high').length,
      mediumPriorityTasks: userTasks.filter(task => task.priority === 'medium').length,
      lowPriorityTasks: userTasks.filter(task => task.priority === 'low').length,
          completionRate: userTasks.length ? (completedTasks.length / userTasks.length) * 100 : 0,
          onTimeCompletionRate: completedTasks.length ? (onTimeCompletions.length / completedTasks.length) * 100 : 0,
      avgCompletionTime: avgCompletionTime
    });
  }, [selectedUser, tasks, users]);

  // Update chart data when user or tasks change
  useEffect(() => {
    const relevantTasks = selectedUser === 'all' 
      ? tasks 
      : tasks.filter(task => task.assignedTo === selectedUser);

    const selectedUserName = selectedUser === 'all' 
      ? 'All Users' 
      : users.find(user => user._id === selectedUser)?.username || 'Selected User';

    const statusCounts = {
      completed: relevantTasks.filter(task => task.status === 'completed').length,
      pending: relevantTasks.filter(task => task.status === 'pending').length
    };

    const priorityCounts = {
      high: relevantTasks.filter(task => task.priority === 'high').length,
      medium: relevantTasks.filter(task => task.priority === 'medium').length,
      low: relevantTasks.filter(task => task.priority === 'low').length
    };

    setChartData({
      statusData: {
        labels: ['Completed', 'Pending'],
        datasets: [{
          data: [statusCounts.completed, statusCounts.pending],
          backgroundColor: ['#00b74a', '#ffa900'],
          label: `${selectedUserName}'s Tasks`
        }]
      },
      priorityData: {
        labels: ['High', 'Medium', 'Low'],
        datasets: [{
          label: `${selectedUserName}'s Tasks by Priority`,
          data: [priorityCounts.high, priorityCounts.medium, priorityCounts.low],
          backgroundColor: ['#f93154', '#ffa900', '#39c0ed'],
          borderColor: ['#f93154', '#ffa900', '#39c0ed'],
          borderWidth: 1
        }]
      }
    });
  }, [selectedUser, tasks, users]);

  // Update data when user selection changes
  useEffect(() => {
    if (selectedUser === 'all') {
      setSelectedUserData(null);
      return;
    }

    const userTasks = tasks.filter(task => task.assignedTo === selectedUser);
    const userData = users.find(user => user._id === selectedUser);

    if (userData) {
      const totalTasks = userTasks.length;
      const priorityCounts = {
        high: userTasks.filter(task => task.priority === 'high').length,
        medium: userTasks.filter(task => task.priority === 'medium').length,
        low: userTasks.filter(task => task.priority === 'low').length
      };

      setSelectedUserData({
        username: userData.username,
        totalTasks,
        priorities: priorityCounts,
        percentages: {
          high: totalTasks ? ((priorityCounts.high / totalTasks) * 100).toFixed(1) : 0,
          medium: totalTasks ? ((priorityCounts.medium / totalTasks) * 100).toFixed(1) : 0,
          low: totalTasks ? ((priorityCounts.low / totalTasks) * 100).toFixed(1) : 0
        }
      });
    }
  }, [selectedUser, tasks, users]);

  // Initial data fetch
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (loading) {
    return (
    <MDBContainer className="py-5 text-center">
      <MDBSpinner role='status'>
          <span className='visually-hidden'>Loading...</span>
      </MDBSpinner>
    </MDBContainer>
  );
  }

  return (
    <MDBContainer fluid className="py-5">
      {/* Stats Cards - Show overall stats when no user selected, user stats when selected */}
      <MDBRow className="g-4 mb-4">
        <MDBCol xl="3" sm="6">
          <MDBCard className="h-100">
            <MDBCardBody>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <MDBTypography tag='h6' className="fs-6 text-muted mb-2">
                    {selectedUser === 'all' ? 'Total Users' : 'Total Tasks'}
                  </MDBTypography>
                  <MDBTypography tag='h3' className="mb-0">
                    {selectedUser === 'all' ? stats.totalUsers : userStats?.totalTasks || 0}
                  </MDBTypography>
                </div>
                <MDBIcon 
                  fas 
                  icon={selectedUser === 'all' ? 'users' : 'tasks'} 
                  size="2x" 
                  className="text-primary" 
                />
              </div>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>

        <MDBCol xl="3" sm="6">
          <MDBCard className="h-100">
            <MDBCardBody>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <MDBTypography tag='h6' className="fs-6 text-muted mb-2">Total Tasks</MDBTypography>
                  <MDBTypography tag='h3' className="mb-0">
                    {selectedUser === 'all' ? stats.totalTasks : userStats?.totalTasks || 0}
                  </MDBTypography>
                </div>
                <MDBIcon fas icon="tasks" size="2x" className="text-info" />
              </div>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>

        <MDBCol xl="3" sm="6">
          <MDBCard className="h-100">
            <MDBCardBody>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <MDBTypography tag='h6' className="fs-6 text-muted mb-2">Pending Tasks</MDBTypography>
                  <MDBTypography tag='h3' className="mb-0">
                    {selectedUser === 'all' ? stats.pendingTasks : userStats?.pendingTasks || 0}
                  </MDBTypography>
                </div>
                <MDBIcon fas icon="clock" size="2x" className="text-warning" />
              </div>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>

        <MDBCol xl="3" sm="6">
          <MDBCard className="h-100">
            <MDBCardBody>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <MDBTypography tag='h6' className="fs-6 text-muted mb-2">Completed Tasks</MDBTypography>
                  <MDBTypography tag='h3' className="mb-0">
                    {selectedUser === 'all' ? stats.completedTasks : userStats?.completedTasks || 0}
                  </MDBTypography>
                </div>
                <MDBIcon fas icon="check-circle" size="2x" className="text-success" />
              </div>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>

      {/* User Selection Dropdown */}
      <MDBRow className="mb-4">
        <MDBCol>
          <MDBCard>
            <MDBCardBody>
              <div className="d-flex align-items-center">
                <MDBIcon fas icon="user" className="me-2" />
                <h5 className="mb-0 me-3">Select User:</h5>
                <select 
                  className="form-select w-auto"
                  value={selectedUser}
                  onChange={handleUserChange}
                >
                  <option value="all">All Users</option>
                  {users.map(user => (
                    <option key={user._id} value={user._id}>
                      {user.username}
                    </option>
                  ))}
                </select>
              </div>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
 
      {/* Charts Section */}
      <MDBRow className="g-4 mb-4">
        <MDBCol md="6">
          <MDBCard>
            <MDBCardBody>
              <h5 className="mb-4 text-center">
                {selectedUserData ? `${selectedUserData.username}'s Task Status` : 'Overall Task Status'}
              </h5>
              <div style={{ height: '300px' }}>
                <Pie 
                  data={chartData.statusData} 
                  options={{ 
                    responsive: true, 
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom'
                      }
                    }
                  }} 
                />
              </div>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>

        <MDBCol md="6">
          <MDBCard>
            <MDBCardBody>
              <h5 className="mb-4 text-center">
                {selectedUserData ? `${selectedUserData.username}'s Task Priorities` : 'Overall Task Priorities'}
              </h5>
              <div style={{ height: '300px' }}>
              <Bar 
                data={chartData.priorityData}
                options={{
                  responsive: true,
                    maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                        ticks: {
                          stepSize: 1
                        }
                      }
                    },
                    plugins: {
                      legend: {
                        display: false
                    }
                  }
                }}
              />
              </div>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>

      {/* Task Priority Breakdown Table - Only shown when a user is selected */}
      {selectedUserData && (
        <MDBRow>
          <MDBCol>
            <MDBCard>
              <MDBCardBody>
                <h5 className="mb-4 text-center">Task Priority Breakdown for {selectedUserData.username}</h5>
                <MDBTable align='middle' hover>
                  <MDBTableHead>
                    <tr>
                      <th scope='col'>Priority Level</th>
                      <th scope='col' className="text-center">Number of Tasks</th>
                      <th scope='col' className="text-center">Percentage</th>
                    </tr>
                  </MDBTableHead>
                  <MDBTableBody>
                    <tr>
                      <td>
                        <div className="d-flex align-items-center">
                          <MDBBadge color='danger' className="me-2">High</MDBBadge>
                          High Priority
                        </div>
                      </td>
                      <td className="text-center">{selectedUserData.priorities.high}</td>
                      <td className="text-center">{selectedUserData.percentages.high}%</td>
                    </tr>
                    <tr>
                      <td>
                        <div className="d-flex align-items-center">
                          <MDBBadge color='warning' className="me-2">Medium</MDBBadge>
                          Medium Priority
                        </div>
                      </td>
                      <td className="text-center">{selectedUserData.priorities.medium}</td>
                      <td className="text-center">{selectedUserData.percentages.medium}%</td>
                    </tr>
                    <tr>
                      <td>
                        <div className="d-flex align-items-center">
                          <MDBBadge color='info' className="me-2">Low</MDBBadge>
                          Low Priority
                        </div>
                      </td>
                      <td className="text-center">{selectedUserData.priorities.low}</td>
                      <td className="text-center">{selectedUserData.percentages.low}%</td>
                    </tr>
                    <tr className="fw-bold bg-light">
                      <td>Total</td>
                      <td className="text-center">{selectedUserData.totalTasks}</td>
                      <td className="text-center">100%</td>
                    </tr>
                  </MDBTableBody>
                </MDBTable>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      )}
    </MDBContainer>
  );
};

export default AdminDashboard;