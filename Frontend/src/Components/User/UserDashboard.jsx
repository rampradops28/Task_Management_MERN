import { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const UserDashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]); // For search & filters
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("All"); // Default filter

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem("userToken");
            if (!token) throw new Error("No token found. Please log in.");

            const userResponse = await axios.get("http://localhost:5000/api/v1/users", {
                headers: { "x-access-token": token },
            });

            const loggedInEmail = localStorage.getItem("userEmail");
            const userData = userResponse.data.data.find(user => user.email === loggedInEmail);

            if (!userData) throw new Error("User not found");

            setUserId(userData._id);
            fetchTasks(userData._id, token);
        } catch (error) {
            setError("Failed to fetch user details");
            setLoading(false);
        }
    };

    const fetchTasks = async (userId, token) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/v1/task/${userId}`, {
                headers: { "x-access-token": token },
            });

            setTasks(response.data.data);
            setFilteredTasks(response.data.data);
        } catch (error) {
            setError("Failed to fetch tasks");
        } finally {
            setLoading(false);
        }
    };

    const refreshTasks = () => {
        setLoading(true);
        fetchTasks(userId, localStorage.getItem("userToken"));
    };

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        filterTasks(query, statusFilter);
    };

    const handleFilterChange = (e) => {
        const filter = e.target.value;
        setStatusFilter(filter);
        filterTasks(searchQuery, filter); // Apply filtering immediately
    };
    
    
    
    const filterTasks = (query, filter) => {
        let updatedTasks = [...tasks]; // Make sure to use the original list
    
        // ✅ Apply status filtering
        if (filter !== "All") {
            updatedTasks = updatedTasks.filter(task => task.status === filter);
        }
    
        // ✅ Apply search filtering
        if (query) {
            updatedTasks = updatedTasks.filter(task =>
                task.title.toLowerCase().includes(query)
            );
        }
    
        setFilteredTasks(updatedTasks);
    };
    
    
 

    return (
        <div className="container-fluid min-vh-100 bg-light p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="text-primary">📋 Assigned Tasks</h2>
                <button className="btn btn-success" onClick={refreshTasks}>
                    🔄 Refresh
                </button>
            </div>

            {/* Search & Filter */}
            <div className="row mb-3">
                <div className="col-md-6">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="🔍 Search tasks by title..."
                        value={searchQuery}
                        onChange={handleSearch}
                    />
                </div>
                {/* <div className="col-md-4">
                    <select className="form-select" value={statusFilter} onChange={handleFilterChange}>
                        <option value="All">All Status</option>
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div> */}
            </div>

            {loading ? (
                <p className="text-center text-warning">⏳ Loading tasks...</p>
            ) : error ? (
                <p className="text-center text-danger">{error}</p>
            ) : filteredTasks.length > 0 ? (
                <div className="row">
                    {filteredTasks.map((task) => (
                        <div key={task._id} className="col-lg-4 col-md-6 mb-4">
                            <div className="card shadow-sm border-0">
                                <div className="card-body">
                                    <h5 className="card-title text-dark">{task.title}</h5>
                                    <p className="card-text text-muted">{task.description}</p>
                                    <p className="text-secondary">
                                        <strong>📅 Deadline:</strong> {new Date(task.deadline).toLocaleDateString()}
                                    </p>
                                    <p className="text-secondary">
                                        <strong>👤 Assigned By:</strong> {task.assignedBy?.username}
                                    </p>
                                    <span className={`badge ${task.status === "Completed" ? "bg-success" : "bg-warning"} text-dark`}>
                                        <strong>📌 Status:</strong> {task.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-muted">🚫 No tasks assigned yet.</p>
            )}
        </div>
    );
};

export default UserDashboard;
