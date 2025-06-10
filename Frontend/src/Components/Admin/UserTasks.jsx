import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
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
  MDBTypography
} from 'mdb-react-ui-kit';

const UserTasks = () => {
  const { userId } = useParams();
  const location = useLocation();
  const username = location.state?.username || 'User';

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editModal, setEditModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    deadline: '',
    priority: 'medium',
    status: 'pending'
  });
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchUserTasks();
  }, [userId]);

  const fetchUserTasks = async () => {
    try {
      const token = localStorage.getItem('AdminToken');
      const response = await axios.get(`http://localhost:5000/api/v1/task/user/${userId}`, {
        headers: { 'x-access-token': token }
      });
      
      if (response.data.success) {
        setTasks(response.data.data);
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

  const handleEditClick = (task) => {
    setSelectedTask(task);
    setEditForm({
      title: task.title,
      description: task.description,
      deadline: task.deadline.split('T')[0],
      priority: task.priority,
      status: task.status
    });
    setEditModal(true);
  };

  const handleEditSubmit = async () => {
    try {
      const token = localStorage.getItem('AdminToken');
      const response = await axios.put(
        `http://localhost:5000/api/v1/task/${selectedTask._id}`,
        editForm,
        {
          headers: {
            'x-access-token': token,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setMessage({ text: 'Task updated successfully!', type: 'success' });
        fetchUserTasks();
        setEditModal(false);
      }
    } catch (error) {
      setMessage({ text: 'Error updating task', type: 'danger' });
      console.error('Error updating task:', error);
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      const token = localStorage.getItem('AdminToken');
      const response = await axios.put(
        `http://localhost:5000/api/v1/task/status/${taskId}`,
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
        fetchUserTasks();
      }
    } catch (error) {
      setMessage({ text: 'Error updating task status', type: 'danger' });
      console.error('Error updating task status:', error);
    }
  };

  const deleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      const token = localStorage.getItem('AdminToken');
      const response = await axios.delete(
        `http://localhost:5000/api/v1/task/delete/${taskId}`,
        {
          headers: { 'x-access-token': token }
        }
      );

      if (response.data.success) {
        setMessage({ text: 'Task deleted successfully!', type: 'success' });
        fetchUserTasks();
      }
    } catch (error) {
      setMessage({ text: 'Error deleting task', type: 'danger' });
      console.error('Error deleting task:', error);
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

  if (loading) return <div className="text-center mt-5">Loading tasks...</div>;
  if (error) return <div className="text-center mt-5 text-danger">{error}</div>;

  return (
    <MDBContainer className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Tasks Assigned to {username}</h2>
        <MDBBtn 
          color='primary'
          onClick={() => window.history.back()}
        >
          <MDBIcon fas icon="arrow-left" className="me-2" />
          Back to Users
        </MDBBtn>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type} mb-4`}>
          {message.text}
        </div>
      )}

      <MDBRow className="g-4">
        {tasks.map((task) => (
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
                  <small className="text-muted">
                    <MDBIcon fas icon="calendar-alt" className="me-2" />
                    Due: {new Date(task.deadline).toLocaleDateString()}
                  </small>
                </div>

                <div className="d-flex justify-content-between align-items-center">
                  <MDBBadge 
                    color={task.status === 'completed' ? 'success' : task.status === 'inProgress' ? 'warning' : 'danger'}
                  >
                    {task.status}
                  </MDBBadge>
                  
                  <div className="d-flex gap-2">
                    <MDBBtn 
                      color='link' 
                      size='sm'
                      onClick={() => handleEditClick(task)}
                    >
                      <MDBIcon fas icon="edit" />
                    </MDBBtn>
                    
                    {task.status !== 'completed' && (
                      <MDBBtn 
                        color='link' 
                        className="text-success"
                        size='sm'
                        onClick={() => updateTaskStatus(task._id, 'completed')}
                      >
                        <MDBIcon fas icon="check" />
                      </MDBBtn>
                    )}
                    
                    <MDBBtn 
                      color='link' 
                      className="text-danger"
                      size='sm'
                      onClick={() => deleteTask(task._id)}
                    >
                      <MDBIcon fas icon="trash" />
                    </MDBBtn>
                  </div>
                </div>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        ))}

        {tasks.length === 0 && (
          <MDBCol>
            <div className="text-center">
              <MDBIcon far icon="folder-open" size="3x" className="text-muted mb-3" />
              <h4>No Tasks Found</h4>
              <p className="text-muted">There are no tasks assigned to this user yet.</p>
            </div>
          </MDBCol>
        )}
      </MDBRow>

      {/* Edit Task Modal */}
      <MDBModal show={editModal} onHide={() => setEditModal(false)}>
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Edit Task</MDBModalTitle>
              <MDBBtn 
                className='btn-close' 
                color='none' 
                onClick={() => setEditModal(false)}
              />
            </MDBModalHeader>
            <MDBModalBody>
              <form>
                <div className="mb-4">
                  <MDBInput
                    label='Task Title'
                    value={editForm.title}
                    onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                  />
                </div>
                
                <div className="mb-4">
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Task Description"
                    value={editForm.description}
                    onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                  />
                </div>
                
                <div className="mb-4">
                  <MDBInput
                    type='date'
                    label='Deadline'
                    value={editForm.deadline}
                    onChange={(e) => setEditForm({...editForm, deadline: e.target.value})}
                  />
                </div>
                
                <div className="mb-4">
                  <select
                    className="form-select"
                    value={editForm.priority}
                    onChange={(e) => setEditForm({...editForm, priority: e.target.value})}
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                </div>

                <div className="mb-4">
                  <select
                    className="form-select"
                    value={editForm.status}
                    onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                  >
                    <option value="pending">Pending</option>
                    <option value="inProgress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </form>
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn color='secondary' onClick={() => setEditModal(false)}>
                Close
              </MDBBtn>
              <MDBBtn onClick={handleEditSubmit}>Save changes</MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </MDBContainer>
  );
};

export default UserTasks; 