import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBInput,
  MDBIcon,
} from "mdb-react-ui-kit";

import "bootstrap/dist/css/bootstrap.min.css";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "../styles/Auth.css";
import { API_ENDPOINTS } from '../config/api';

const UserRegister = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    usertype: "user",
  });

  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setMessage({ type: "error", text: "All fields are required!" });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match!" });
      return;
    }

    if (formData.password.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters long!" });
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...submitData } = formData;
      const response = await axios.post(API_ENDPOINTS.USER_SIGNUP, submitData);
      setMessage({ type: "success", text: "Registration Successful! Redirecting to login..." });
      setTimeout(() => navigate("/login-user"), 1500);
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Registration failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <MDBContainer fluid className="auth-container">
      <MDBCard className="auth-card">
        <MDBCardBody>
          <MDBRow>
            <MDBCol md="10" lg="6" className="order-2 order-lg-1 auth-form-section">
              <h1 className="auth-title">Create Account</h1>
              
              {message.text && (
                <div className={`auth-message ${message.type}`}>
                  {message.text}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="auth-input-group">
                  <MDBIcon fas icon="user" className="input-icon position-absolute" style={{ left: '1rem', top: '1.1rem' }} />
                  <MDBInput
                    label="Username"
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="auth-input"
                    required
                  />
                </div>

                <div className="auth-input-group">
                  <MDBIcon fas icon="envelope" className="input-icon position-absolute" style={{ left: '1rem', top: '1.1rem' }} />
                  <MDBInput
                    label="Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="auth-input"
                    required
                  />
                </div>

                <div className="auth-input-group">
                  <MDBIcon fas icon="lock" className="input-icon position-absolute" style={{ left: '1rem', top: '1.1rem' }} />
                  <MDBInput
                    label="Password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="auth-input"
                    required
                  />
                </div>

                <div className="auth-input-group">
                  <MDBIcon fas icon="key" className="input-icon position-absolute" style={{ left: '1rem', top: '1.1rem' }} />
                  <MDBInput
                    label="Confirm Password"
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="auth-input"
                    required
                  />
                </div>

                <MDBBtn 
                  type="submit"
                  disabled={loading}
                  className="auth-submit-btn"
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Creating Account...
                    </>
                  ) : (
                    'Sign Up'
                  )}
                </MDBBtn>

                <p className="auth-link">
                  Already have an account? <Link to="/login-user">Sign In</Link>
                </p>
              </form>
            </MDBCol>

            <MDBCol md="10" lg="6" className="order-1 order-lg-2 auth-image-section">
              <MDBCardImage 
                src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
                fluid
                className="auth-image"
                alt="User Login"
              />
            </MDBCol>
          </MDBRow>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
};

export default UserRegister;
