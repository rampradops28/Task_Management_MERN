import { useState } from "react";
import axios from "axios";
import { useNavigate , Link} from "react-router-dom";

const SignUp = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        usertype: "user",
        profile: ""
    });

    const [preview, setPreview] = useState(null);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
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
        setError(null);
        setSuccess(null);

        if (formData.username.length < 5 || formData.password.length < 5) {
            setError("Username and Password must be at least 5 characters.");
            return;
        }

        try {
            await axios.post("http://localhost:5000/api/v1/users/signup", formData);
            setSuccess("User registered successfully! Redirecting to login...");
            setTimeout(() => navigate("/login-user"), 1500); // Redirect to login
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong!");
        }
    };

    return (
        <div className="signup-container">
            <h2>Sign Up</h2>
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}

            <form onSubmit={handleSubmit}>
                <label>Username:</label>
                <input type="text" name="username" value={formData.username} onChange={handleChange} required />

                <label>Email:</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required />

                <label>Password:</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} required />

                <label>Profile Image:</label>
                <input type="file" accept="image/*" onChange={handleFileChange} />
                {preview && <img src={preview} alt="Profile Preview" className="preview-image" />}

                <button type="submit">Register</button>
            </form>

            <p className="login-link">
                Already have an account? <Link to="/login-user">Click here to login</Link>
            </p>

        </div>
    );
};

export default SignUp;
