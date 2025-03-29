import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBBtn,
  MDBIcon,
  MDBCardImage,
} from "mdb-react-ui-kit";

import "bootstrap/dist/css/bootstrap.min.css";
import "mdb-react-ui-kit/dist/css/mdb.min.css";

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    usertype: "user",
    profile: "",
  });

  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profile: reader.result });
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      setMessage({ type: "error", text: "All fields are required!" });
      return;
    }
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/v1/users/signup", formData);
      setMessage({ type: "success", text: "User registered successfully! Redirecting..." });
      setTimeout(() => navigate("/login-user"), 1500);
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Something went wrong!" });
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
              <h1 className="text-center fw-bold mb-5 mt-4">Sign Up</h1>
              {message.text && (
                <p className={message.type === "error" ? "text-danger" : "text-success"}>{message.text}</p>
              )}
              <div className="d-flex flex-row align-items-center mb-4">
                <MDBIcon fas icon="user me-3" size="lg" />
                <MDBInput label="Username" type="text" name="username" value={formData.username} onChange={handleChange} className="w-100" />
              </div>
              <div className="d-flex flex-row align-items-center mb-4">
                <MDBIcon fas icon="envelope me-3" size="lg" />
                <MDBInput label="Email" type="email" name="email" value={formData.email} onChange={handleChange} />
              </div>
              <div className="d-flex flex-row align-items-center mb-4">
                <MDBIcon fas icon="lock me-3" size="lg" />
                <MDBInput label="Password" type="password" name="password" value={formData.password} onChange={handleChange} />
              </div>
              <MDBBtn className="mb-4" size="lg" onClick={handleSubmit} disabled={loading}>
                {loading ? "Registering..." : "Register"}
              </MDBBtn>
              <p className="login-link">
                Already have an account? <Link to="/login-user">Click here to login</Link>
              </p>
            </MDBCol>
            <MDBCol md="10" lg="6" className="order-1 order-lg-2 d-flex align-items-center">
              <MDBCardImage src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp" fluid />
            </MDBCol>
          </MDBRow>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
};

export default SignUp;
