import "bootstrap/dist/css/bootstrap.min.css";
import "mdb-react-ui-kit/dist/css/mdb.min.css";

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
  MDBCheckbox,
} from "mdb-react-ui-kit";

const AdminSignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    usertype: "admin", // Default user type
  });

  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.email || !formData.password) {
      setMessage({ type: "error", text: "All fields are required!" });
      return;
    }

    setLoading(true); // Start loading

    try {
      // Register Admin
      await axios.post("http://localhost:5000/api/v1/users/signup/admin", formData);

      setMessage({ type: "success", text: "Registration Successful! Redirecting to login..." });

      // Redirect to Login Page after successful registration
      setTimeout(() => navigate("/login-admin"), 1500);
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Registration failed. Try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <MDBContainer fluid>
      <MDBCard className="text-black m-5" style={{ borderRadius: "25px" }}>
        <MDBCardBody>
          <MDBRow>
            <MDBCol md="10" lg="6" className="order-2 order-lg-1 d-flex flex-column align-items-center">
              <h1 className="text-center fw-bold mb-5 mt-4">Admin Sign Up</h1>

              {message.text && (
                <p className={message.type === "error" ? "text-danger" : "text-success"}>{message.text}</p>
              )}

              <div className="d-flex flex-row align-items-center mb-4">
                <MDBIcon fas icon="user me-3" size="lg" />
                <MDBInput label="Admin Username" id="form1" type="text" name="username" value={formData.username} onChange={handleChange} className="w-100" />
              </div>

              <div className="d-flex flex-row align-items-center mb-4">
                <MDBIcon fas icon="envelope me-3" size="lg" />
                <MDBInput label="Admin Email" id="form2" type="email" name="email" value={formData.email} onChange={handleChange} />
              </div>

              <div className="d-flex flex-row align-items-center mb-4">
                <MDBIcon fas icon="lock me-3" size="lg" />
                <MDBInput label="Password" id="form3" type="password" name="password" value={formData.password} onChange={handleChange} />
              </div>

              
              <MDBBtn className="mb-4" size="lg" onClick={handleSubmit} disabled={loading}>
                {loading ? "Registering..." : "Register"}
              </MDBBtn>

              <p className="login-link">
                Already have an account? <Link to="/login-admin">Click here to login</Link>
              </p>
            </MDBCol>

            <MDBCol md="10" lg="6" className="order-1 order-lg-2 d-flex align-items-center">
              <MDBCardImage
                src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/draw1.webp"
                fluid
              />
            </MDBCol>
          </MDBRow>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
};

export default AdminSignUp;
