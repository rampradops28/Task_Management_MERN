import { useEffect, useState } from "react";
import axios from "axios";

const UserDashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem("userToken");
                if (!token) throw new Error("No token found. Please log in.");

                // Fetch user details using token
                const userResponse = await axios.get("http://localhost:5000/api/v1/users", {
                  headers: {
                    "x-access-token": token, // Pass token for authentication
                  },
                });

                console.log("User Response:", userResponse.data);

                // Assuming the user response contains an array of users, find the logged-in user
                const loggedInEmail = localStorage.getItem("userEmail"); // Store email in localStorage when logging in
                const userData = userResponse.data.data.find(user => user.email === loggedInEmail);

                if (!userData) throw new Error("User not found");

                setUserId(userData._id);
                console.log("User ID:", userData._id);

                // Fetch tasks after getting user ID
                fetchTasks(userData._id, token);
            } catch (error) {
                setError("Failed to fetch user details");
                console.error("Error fetching user details:", error);
                setLoading(false);
            }
        };

        const fetchTasks = async (userId, token) => {
            try {
                const response = await axios.get(`http://localhost:5000/api/v1/task/${userId}`, {
                  headers: {
                    "x-access-token": token, // Pass token for authentication
                  },
                });

                console.log("Fetched Tasks:", response.data.data);
                setTasks(response.data.data);
            } catch (error) {
                setError("Failed to fetch tasks");
                console.error("Error fetching tasks:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    return (
        <div className="dashboard-container">
            <h2 className="dashboard-title">Assigned Tasks</h2>
            {loading ? (
                <p className="loading-text">Loading tasks...</p>
            ) : error ? (
                <p className="error-text">{error}</p>
            ) : tasks.length > 0 ? (
                <div className="task-cards-container">
                    {tasks.map((task) => (
                        <div key={task._id} className="task-card">
                            <h3 className="task-title">{task.title}</h3>
                            <p className="task-description">{task.description}</p>
                            <p className="task-deadline"><strong>Deadline:</strong> {task.deadline}</p>
                            <p className="task-details">
                                <strong>Assigned By:</strong> {task.assignedBy?.username}
                            </p>
                            <p className="task-status">
                                <strong>Status:</strong> {task.status}
                            </p>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No tasks assigned yet.</p>
            )}
        </div>
    );
};

export default UserDashboard;
