import React, { useState, useEffect } from "react";
import axios from "axios";

const ProfilePage = () => {
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updatedData, setUpdatedData] = useState({ username: "", email: "" });

    // Check if adminToken is available; otherwise, use userToken
    const token = localStorage.getItem("adminToken") || localStorage.getItem("userToken");
    const isAdmin = localStorage.getItem("adminToken") ? true : false;

    console.log("Token:", token);
    console.log("Is Admin:", isAdmin);

    // Fetch user/admin profile
    useEffect(() => {
        if (!token) {
            setError("No token found. Please log in.");
            setLoading(false);
            return;
        }

        const fetchProfile = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/v1/users/profile", {
                    headers: { "x-access-token": token },
                });
                setUser(response.data.data);
                setUpdatedData({ username: response.data.data.username, email: response.data.data.email });
            } catch (error) {
                setError(error.response?.data?.message || "Error fetching profile");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [token]);

    // Update profile
    const handleUpdateProfile = async () => {
        try {
            const response = await axios.put("http://localhost:5000/api/v1/users/update", updatedData, {
                headers: { "x-access-token": token },
            });
            alert(response.data.message);
        } catch (error) {
            alert(error.response?.data?.message || "Failed to update profile");
        }
    };

    // Update password
    const handleUpdatePassword = async (oldPassword, newPassword) => {
        try {
            const response = await axios.put("http://localhost:5000/api/v1/users/updatePassword", {
                oldPassword,
                newPassword,
            }, {
                headers: { "x-access-token": token },
            });
            alert(response.data.message);
        } catch (error) {
            alert(error.response?.data?.message || "Failed to update password");
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h2>{isAdmin ? "Admin Profile" : "User Profile"}</h2>
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>User Type:</strong> {user.usertype}</p>

            <h3>Update Profile</h3>
            <input type="text" value={updatedData.username} onChange={(e) => setUpdatedData({ ...updatedData, username: e.target.value })} />
            <input type="email" value={updatedData.email} onChange={(e) => setUpdatedData({ ...updatedData, email: e.target.value })} />
            <button onClick={handleUpdateProfile}>Update Profile</button>

            <h3>Change Password</h3>
            <input type="password" placeholder="Old Password" id="oldPass" />
            <input type="password" placeholder="New Password" id="newPass" />
            <button onClick={() => handleUpdatePassword(document.getElementById("oldPass").value, document.getElementById("newPass").value)}>Change Password</button>
        </div>
    );
};

export default ProfilePage;
