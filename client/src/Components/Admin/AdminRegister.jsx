import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

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
    <div className="admin-signup-container">
      <h2>Admin Sign Up</h2>
      {message.text && <p className={message.type === "error" ? "error-msg" : "success-msg"}>{message.text}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Admin Username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Admin Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      <p className="login-link">
        Already have an account? <Link to="/login-admin">Click here to login</Link>
      </p>
    </div>
  );
};

export default AdminSignUp;
