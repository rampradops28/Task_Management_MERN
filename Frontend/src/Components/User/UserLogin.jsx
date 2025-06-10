import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
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

const UserLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { dispatch } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setMessage({ type: "error", text: "Email and Password are required!" });
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(API_ENDPOINTS.USER_LOGIN, formData);
      const { token, user } = response.data.data;
      
      localStorage.setItem("userToken", token);
      localStorage.setItem("userId", user._id);
      localStorage.setItem("userEmail", user.email);
      localStorage.setItem("userName", user.username);
      localStorage.setItem("userType", user.usertype || 'user');
      
      dispatch({ 
        type: 'LOGIN', 
        payload: { 
          id: user._id,
          email: user.email,
          username: user.username,
          role: 'user',
          usertype: user.usertype || 'user',
          token: token
        }
      });

      setMessage({ type: "success", text: "Login Successful. Redirecting..." });
      navigate("/user-dashboard");
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.message || "Login failed" });
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
              <h1 className="auth-title">User Login</h1>
              
              {message.text && (
                <div className={`auth-message ${message.type}`}>
                  {message.text}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="auth-input-group">
                  <MDBIcon fas icon="envelope" className="input-icon position-absolute" style={{ left: '1rem', top: '1.1rem' }} />
                  <MDBInput
                    label="User Email"
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

                <MDBBtn 
                  type="submit"
                  disabled={loading}
                  className="auth-submit-btn"
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Logging in...
                    </>
                  ) : (
                    'Login'
                  )}
                </MDBBtn>

                <p className="auth-link">
                  Don't have an account? <Link to="/register-user">Sign Up Here</Link>
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

export default UserLogin;
