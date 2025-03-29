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


const UserLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
      const response = await axios.post("http://localhost:5000/api/v1/users/login", formData);
      localStorage.setItem("AdminId", response.data.data.user._id);
      localStorage.setItem("AdminToken", response.data.data.token);
      setMessage({ type: "success", text: "Login Successful. Redirecting..." });
      setTimeout(() => navigate("/admin-dashboard"), 1000);
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.message || "Login failed" });
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
              <h1 className="text-center fw-bold mb-5 mt-4">Admin Login</h1>
              {message.text && (
                <p className={message.type === "error" ? "text-danger" : "text-success"}>{message.text}</p>
              )}
              <div className="d-flex flex-row align-items-center mb-4">
                <MDBIcon fas icon="envelope me-3" size="lg" />
                <MDBInput label="User Email" id="form2" type="email" name="email" value={formData.email} onChange={handleChange} />
              </div>
              <div className="d-flex flex-row align-items-center mb-4">
                <MDBIcon fas icon="lock me-3" size="lg" />
                <MDBInput label="Password" id="form3" type="password" name="password" value={formData.password} onChange={handleChange} />
              </div>
              <MDBBtn className="mb-4" size="lg" onClick={handleSubmit} disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </MDBBtn>
              <p className="login-link">
                Don't have an account? <Link to="/admin">Sign Up Here</Link>
              </p>
            </MDBCol>
            <MDBCol md="10" lg="6" className="order-1 order-lg-2 d-flex align-items-center">
              <MDBCardImage src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/draw1.webp" fluid />
            </MDBCol>
          </MDBRow>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
};

export default UserLogin;