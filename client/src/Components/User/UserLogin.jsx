import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState({ type: "", text: "" });
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

    try {
      const response = await axios.post("http://localhost:5000/api/v1/users/login", formData);
      
      localStorage.setItem("userToken", response.data.data.token);

      localStorage.setItem("userEmail", formData.email);

      setMessage({ type: "success", text: "Login Successful. Redirecting..." });

      setTimeout(() => {
        navigate("/user-dashboard"); // Redirect to user dashboard
      }, 1000);
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Login failed",
      });
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>User Login</h2>
      {message.text && (
        <p style={{ color: message.type === "error" ? "red" : "green" }}>{message.text}</p>
      )}
      <form onSubmit={handleSubmit} style={{ display: "inline-block", textAlign: "left" }}>
        <input
          type="email"
          name="email"
          placeholder="User Email"
          value={formData.email}
          onChange={handleChange}
          required
          style={{ display: "block", margin: "10px 0", padding: "10px", width: "100%" }}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          style={{ display: "block", margin: "10px 0", padding: "10px", width: "100%" }}
        />
        <button type="submit" style={{ padding: "10px 20px", cursor: "pointer" }}>
          Login
        </button>
      </form>
    </div>
  );
};

export default UserLogin;
