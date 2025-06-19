import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBRow,
  MDBCol,
  MDBIcon,
  MDBBtn,
  MDBBadge,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
  MDBInput,
  MDBTextArea
} from 'mdb-react-ui-kit';
import { API_ENDPOINTS } from '../config/api';

const AssignedTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [formData, setFormData] = useState({
    assignedTo: '',
    title: '',
    description: '',
    deadline: '',
    priority: 'medium',
    status: 'pending'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('AdminToken');
      const response = await axios.get(API_ENDPOINTS.GET_USERS, {
        headers: { 'x-access-token': token }
      });

      if (response.data.success) {
        // Filter out admin users
        const regularUsers = response.data.data.filter(user => 
          user.usertype !== 'admin' && user.role !== 'admin'
        );
        setUsers(regularUsers);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setMessage({ text: 'Error fetching users', type: 'danger' });
    }
  };

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('AdminToken');
      const response = await axios.get(API_ENDPOINTS.GET_ALL_TASKS, {
        headers: { 'x-access-token': token }
      });

      if (response.data.success) {
        setTasks(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setMessage({ text: 'Error fetching tasks', type: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (task) => {
    console.log('Edit clicked for task:', task);
    setSelectedTask(task);
    const newFormData = {
      assignedTo: task.assignedTo?._id || '',
      title: task.title || '',
      description: task.description || '',
      deadline: task.deadline ? task.deadline.split('T')[0] : '',
      priority: task.priority || 'medium',
      status: task.status || 'pending'
    };
    console.log('Setting form data to:', newFormData);
    setFormData(newFormData);
    setMessage({ text: '', type: '' });
    setShowEditPopup(true);
  };

  const handleClosePopup = () => {
    setShowEditPopup(false);
    resetForm();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`Updating ${name} to:`, value);
    setFormData(prev => {
      const updated = {
        ...prev,
        [name]: value
      };
      console.log('Updated form data:', updated);
      return updated;
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);
    
    if (!validateForm()) {
      console.log('Form validation failed');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('AdminToken');
      console.log('Token:', token);
      
      // Format the data properly
      const formattedData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        deadline: new Date(formData.deadline).toISOString(),
        priority: formData.priority,
        status: formData.status,
        assignedTo: formData.assignedTo
      };
      console.log('Formatted data:', formattedData);

      console.log('Making API call to:', API_ENDPOINTS.UPDATE_TASK(selectedTask._id));
      const response = await axios.put(
        API_ENDPOINTS.UPDATE_TASK(selectedTask._id),
        formattedData,
        {
          headers: {
            'x-access-token': token,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log('API response:', response);

      if (response.data.success) {
        console.log('Task updated successfully');
        setMessage({ text: 'Task updated successfully!', type: 'success' });
        await fetchTasks();
        setShowEditPopup(false);
        resetForm();
      } else {
        console.log('Task update failed:', response.data);
        throw new Error(response.data.message || 'Failed to update task');
      }
    } catch (error) {
      console.error('Error updating task:', error);
      setMessage({ 
        text: error.response?.data?.message || error.message || 'Failed to update task', 
        type: 'danger' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      assignedTo: '',
      title: '',
      description: '',
      deadline: '',
      priority: 'medium',
      status: 'pending'
    });
    setSelectedTask(null);
  };

  const validateForm = () => {
    if (!formData.assignedTo) {
      setMessage({ text: 'Please select a user to assign the task', type: 'danger' });
      return false;
    }
    if (!formData.title.trim()) {
      setMessage({ text: 'Task title is required', type: 'danger' });
      return false;
    }
    if (!formData.description.trim()) {
      setMessage({ text: 'Task description is required', type: 'danger' });
      return false;
    }
    if (!formData.deadline) {
      setMessage({ text: 'Please set a deadline for the task', type: 'danger' });
      return false;
    }
    
    // Validate deadline is not in the past
    const deadlineDate = new Date(formData.deadline);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (deadlineDate < today) {
      setMessage({ text: 'Deadline cannot be in the past', type: 'danger' });
      return false;
    }
    
    return true;
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      const token = localStorage.getItem('AdminToken');
      const response = await axios.put(
        API_ENDPOINTS.UPDATE_TASK_STATUS(taskId),
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
        fetchTasks();
      }
    } catch (error) {
      console.error('Error updating task status:', error);
      setMessage({ text: 'Error updating task status', type: 'danger' });
    }
  };

  const deleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      const token = localStorage.getItem('AdminToken');
      const response = await axios.delete(
        API_ENDPOINTS.DELETE_TASK(taskId),
        {
          headers: { 'x-access-token': token }
        }
      );

      if (response.data.success) {
        setMessage({ text: 'Task deleted successfully!', type: 'success' });
        fetchTasks();
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      setMessage({ text: 'Error deleting task', type: 'danger' });
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'info';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in-progress': return 'warning';
      default: return 'danger';
    }
  };

  const popupStyles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      zIndex: 1000,
      display: showEditPopup ? 'flex' : 'none',
      justifyContent: 'center',
      alignItems: 'center'
    },
    popup: {
      backgroundColor: 'white',
      borderRadius: '8px',
      width: '90%',
      maxWidth: '800px',
      maxHeight: '90vh',
      overflow: 'auto',
      position: 'relative',
      padding: '20px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
      padding: '10px 20px',
      backgroundColor: '#1266f1',
      color: 'white',
      margin: '-20px -20px 20px -20px',
      borderTopLeftRadius: '8px',
      borderTopRightRadius: '8px'
    },
    closeButton: {
      position: 'absolute',
      top: '10px',
      right: '10px',
      background: 'none',
      border: 'none',
      color: 'white',
      fontSize: '24px',
      cursor: 'pointer'
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '15px'
    }
  };

  // Approve a review-requested task
  const approveTask = async (taskId) => {
    try {
      const token = localStorage.getItem('AdminToken');
      const response = await axios.put(
        API_ENDPOINTS.APPROVE_TASK(taskId),
        {},
        {
          headers: {
            'x-access-token': token,
            'Content-Type': 'application/json'
          }
        }
      );
      if (response.data.success) {
        setMessage({ text: 'Task approved and marked as completed!', type: 'success' });
        fetchTasks();
      }
    } catch (error) {
      setMessage({ text: error.response?.data?.message || 'Error approving task', type: 'danger' });
    }
  };

  // Reject a review-requested task
  const rejectTask = async (taskId) => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;
    try {
      const token = localStorage.getItem('AdminToken');
      const response = await axios.put(
        API_ENDPOINTS.REJECT_TASK(taskId),
        { rejectionReason: reason },
        {
          headers: {
            'x-access-token': token,
            'Content-Type': 'application/json'
          }
        }
      );
      if (response.data.success) {
        setMessage({ text: 'Task review rejected.', type: 'success' });
        fetchTasks();
      }
    } catch (error) {
      setMessage({ text: error.response?.data?.message || 'Error rejecting task', type: 'danger' });
    }
  };

  if (loading) return (
    <MDBContainer className="py-5 text-center">
      <MDBIcon fas icon="spinner" spin size="3x" />
      <p className="mt-3">Loading tasks...</p>
    </MDBContainer>
  );

  return (
    <MDBContainer className="py-5">
      <h2 className="text-center mb-4">Assigned Tasks</h2>

      {message.text && (
        <div className={`alert alert-${message.type} mb-4`}>
          {message.text}
        </div>
      )}

      <MDBRow className="g-4">
        {tasks.length > 0 ? tasks.map((task) => (
          <MDBCol key={task._id} md="6" lg="4">
            <MDBCard className="h-100">
              <MDBCardBody>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0">{task.title}</h5>
                  <MDBBadge color={getPriorityColor(task.priority)} pill>
                    {task.priority}
                  </MDBBadge>
                </div>

                <p className="text-muted mb-3">{task.description}</p>

                <div className="mb-3">
                  <small className="text-muted d-block mb-2">
                    <MDBIcon fas icon="user" className="me-2" />
                    Assigned to: {task.assignedTo?.username || 'Unassigned'}
                  </small>
                  <small className="text-muted d-block">
                    <MDBIcon fas icon="calendar-alt" className="me-2" />
                    Due: {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No deadline'}
                  </small>
                </div>

                <div className="d-flex justify-content-between align-items-center mb-3">
                  <MDBBadge color={getStatusColor(task.status)}>
                    {task.status}
                  </MDBBadge>
                </div>

                <div className="d-flex justify-content-between">
                  <MDBBtn color='primary' size='sm' onClick={() => handleEditClick(task)}>
                    <MDBIcon fas icon="edit" className="me-2" /> Edit
                  </MDBBtn>
                  {task.status === 'review-requested' ? (
                    <>
                      <MDBBtn color='success' size='sm' onClick={() => approveTask(task._id)}>
                        <MDBIcon fas icon="check" className="me-2" /> Approve
                      </MDBBtn>
                      <MDBBtn color='danger' size='sm' onClick={() => rejectTask(task._id)}>
                        <MDBIcon fas icon="times" className="me-2" /> Reject
                      </MDBBtn>
                    </>
                  ) : (
                    <MDBBtn 
                      color='success' 
                      size='sm'
                      onClick={() => updateTaskStatus(task._id, 'completed')}
                      disabled={task.status === 'completed'}
                    >
                      <MDBIcon fas icon="check" className="me-2" /> Complete
                    </MDBBtn>
                  )}
                  <MDBBtn color='danger' size='sm' onClick={() => deleteTask(task._id)}>
                    <MDBIcon fas icon="trash" />
                  </MDBBtn>
                </div>
                {task.status === 'rejected' && task.rejectionReason && (
                  <div className="mt-2 text-danger">
                    <MDBIcon fas icon="exclamation-circle" className="me-2" />
                    Rejection Reason: {task.rejectionReason}
                  </div>
                )}
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        )) : (
          <MDBCol>
            <div className="text-center py-5">
              <MDBIcon far icon="folder-open" size="3x" className="text-muted mb-3" />
              <h4>No Tasks Found</h4>
              <p className="text-muted">There are no tasks assigned yet.</p>
            </div>
          </MDBCol>
        )}
      </MDBRow>

      <div style={popupStyles.overlay}>
        <div style={popupStyles.popup}>
          <div style={popupStyles.header}>
            <h4 className="mb-0">
              <MDBIcon fas icon="edit" className="me-2" />
              Edit Task
            </h4>
            <button 
              style={popupStyles.closeButton}
              onClick={handleClosePopup}
              disabled={isSubmitting}
            >
              ×
            </button>
          </div>

          <form onSubmit={handleEditSubmit} style={popupStyles.form}>
            {message.text && message.type && (
              <div className={`alert alert-${message.type}`}>
                <MDBIcon 
                  fas 
                  icon={message.type === 'success' ? 'check-circle' : 'exclamation-circle'} 
                  className="me-2"
                />
                {message.text}
              </div>
            )}

            <MDBRow>
              <MDBCol md="6">
                <div className="form-group mb-3">
                  <label className="fw-bold mb-2">
                    <MDBIcon fas icon="user" className="me-2" />
                    Assign To*
                  </label>
                  <select
                    className="form-select"
                    name="assignedTo"
                    value={formData.assignedTo}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                  >
                    <option value="">Select User</option>
                    {users.map((user) => (
                      <option key={user._id} value={user._id}>
                        {user.username} ({user.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group mb-3">
                  <label className="fw-bold mb-2">
                    <MDBIcon fas icon="tasks" className="me-2" />
                    Task Title*
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="form-group mb-3">
                  <label className="fw-bold mb-2">
                    <MDBIcon fas icon="calendar" className="me-2" />
                    Deadline*
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </MDBCol>

              <MDBCol md="6">
                <div className="form-group mb-3">
                  <label className="fw-bold mb-2">
                    <MDBIcon fas icon="flag" className="me-2" />
                    Priority*
                  </label>
                  <select
                    className="form-select"
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                </div>

                <div className="form-group mb-3">
                  <label className="fw-bold mb-2">
                    <MDBIcon fas icon="chart-line" className="me-2" />
                    Status*
                  </label>
                  <select
                    className="form-select"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </MDBCol>
            </MDBRow>

            <div className="form-group mb-3">
              <label className="fw-bold mb-2">
                <MDBIcon fas icon="align-left" className="me-2" />
                Task Description*
              </label>
              <textarea
                className="form-control"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="text-muted mb-3">
              <MDBIcon fas icon="info-circle" className="me-2" />
              Fields marked with * are required
            </div>

            <div className="d-flex justify-content-end gap-2 mt-3 pt-3 border-top">
              <MDBBtn
                color="secondary"
                onClick={handleClosePopup}
                disabled={isSubmitting}
              >
                <MDBIcon fas icon="times" className="me-2" />
                Cancel
              </MDBBtn>
              <MDBBtn
                type="submit"
                color="primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <MDBIcon fas icon="spinner" spin className="me-2" />
                    Updating...
                  </>
                ) : (
                  <>
                    <MDBIcon fas icon="save" className="me-2" />
                    Update Task
                  </>
                )}
              </MDBBtn>
            </div>
          </form>
        </div>
      </div>
    </MDBContainer>
  );
};

export default AssignedTasks; 