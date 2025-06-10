import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBCardHeader,
  MDBInput,
  MDBTextArea,
  MDBBtn,
  MDBIcon,
  MDBSpinner
} from 'mdb-react-ui-kit';
import { API_ENDPOINTS } from '../config/api';

const AssignTask = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    deadline: "",
    priority: "medium",
    assignedTo: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("AdminToken");
      const response = await axios.get(API_ENDPOINTS.GET_USERS, {
        headers: { "x-access-token": token },
      });

      if (response.data.success) {
        // Filter out admin users
        const regularUsers = response.data.data.filter(user => 
          user.usertype !== 'admin' && user.role !== 'admin'
        );
        setUsers(regularUsers);
      } else {
        setMessage({ text: "Failed to fetch users", type: "danger" });
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setMessage({ text: "Error fetching users", type: "danger" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.assignedTo || !formData.title || !formData.description || !formData.deadline) {
      setMessage({ text: "All fields are required!", type: "warning" });
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("AdminToken");
      await axios.post(
        API_ENDPOINTS.CREATE_TASK(formData.assignedTo),
        formData,
        {
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
          },
        }
      );

      setMessage({ text: "Task assigned successfully!", type: "success" });
      setFormData({
        title: "",
        description: "",
        deadline: "",
        priority: "medium",
        assignedTo: "",
      });
    } catch (error) {
      console.error("Error assigning task:", error);
      setMessage({ text: "Failed to assign task", type: "danger" });
    } finally {
      setLoading(false);
    }
  };

  // Function to dismiss alert
  const dismissAlert = () => {
    setMessage({ text: '', type: '' });
  };

  return (
    <MDBContainer className="py-5 mt-5">
      <MDBRow className="justify-content-center">
        <MDBCol md="8" lg="7" xl="6">
          <MDBCard className="shadow-lg">
            <MDBCardHeader className="bg-primary text-white p-4">
              <div className="d-flex align-items-center">
                <div className="text-center bg-white rounded-circle p-3 me-3">
                  <MDBIcon fas icon="tasks" size="2x" className="text-primary" />
                </div>
                <div>
                  <h3 className="mb-0">Assign New Task</h3>
                  <p className="mb-0 opacity-75">Create and assign task to user</p>
                </div>
              </div>
            </MDBCardHeader>

            <MDBCardBody className="p-4">
              {message.text && (
                <div className={`alert alert-${message.type} alert-dismissible fade show mb-4`} role="alert">
                  {message.text}
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={dismissAlert}
                    aria-label="Close"
                  ></button>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <MDBInput
                    label='Task Title'
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                  />
                </div>

                <div className="mb-4">
                  <MDBTextArea
                    label='Task Description'
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    required
                  />
                </div>

                <div className="mb-4">
                  <MDBInput
                    type='datetime-local'
                    label='Deadline'
                    value={formData.deadline}
                    onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label">Priority Level</label>
                  <select
                    className="form-select"
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                    required
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="form-label">Assign To</label>
                  <select
                    className="form-select"
                    value={formData.assignedTo}
                    onChange={(e) => setFormData({...formData, assignedTo: e.target.value})}
                    required
                  >
                    <option value="">Select User</option>
                    {users.map(user => (
                      <option key={user._id} value={user._id}>
                        {user.username}
                      </option>
                    ))}
                  </select>
                </div>

                <MDBBtn
                  type='submit'
                  color='primary'
                  className='w-100'
                  disabled={loading}
                >
                  {loading ? (
                    <MDBSpinner size='sm' role='status' tag='span' className='me-2' />
                  ) : (
                    <MDBIcon fas icon="plus-circle" className="me-2" />
                  )}
                  Assign Task
                </MDBBtn>
              </form>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default AssignTask; 