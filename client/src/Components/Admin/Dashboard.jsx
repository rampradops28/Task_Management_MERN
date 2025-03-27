import { useState, useEffect } from "react";
import axios from "axios";
import {useNavigate} from 'react-router-dom';

const AdminTaskAssign = () => {
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState({
    assignedTo: "",
    title: "",
    description: "",
    deadline: "",
    priority: "medium",
    status: "pending",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
    fetchTasks();
    // fetchAdminTasks();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.get("http://localhost:5000/api/v1/users", {
        headers: { "x-access-token": token },
      });

      // console.log(response);

      if (response.data.success) {
        setUsers(response.data.data);
      } else {
        setMessage("Failed to fetch users");
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setMessage("Error fetching users");
    }
  };

//   const fetchAdminTasks = async () => {

//     const token = localStorage.getItem("adminToken");
//     const adminId = localStorage.getItem("adminId");
    
//     // console.log(token);
//     // console.log(adminId);

//     if (!adminId) {
//         console.log("No admin logged in");
//         return;
//     }

//     try {
//       // console.log(`Requesting: http://localhost:5000/api/v1/task/admin-tasks?adminId=${adminId}`);

//       const response = await fetch(`http://localhost:5000/api/v1/task/admin-tasks?adminId=${adminId}`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           "x-access-token": localStorage.getItem("adminToken"), // Send authentication token
//         },
//       });
//         const data = await response.json();

//         console.log(data);
        
//         if (data.success) {
//             console.log("Tasks:", data.tasks);
//         } else {
//             console.error("Error fetching tasks:", data.message);
//         }
//     } catch (error) {
//         console.error("Error:", error);
//     }
// };


  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      // console.log(token);
      const response = await axios.get("http://localhost:5000/api/v1/task", {
        headers: { "x-access-token": token },
      });

      if (response.data.success) {
        setTasks(response.data.data);
      } else {
        setMessage("Failed to fetch tasks");
      }
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setMessage("Error fetching tasks");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.assignedTo || !formData.title || !formData.description || !formData.deadline) {
      setMessage("All fields are required!");
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");
      const response = isEditing
        ? await axios.put(
            `http://localhost:5000/api/v1/task/${editingTaskId}`,
            formData,
            {
              headers: {
                "x-access-token": token,
                "Content-Type": "application/json",
              },
            }
          )
        : await axios.post(
            `http://localhost:5000/api/v1/task/create/${formData.assignedTo}`,
            {
              title: formData.title,
              description: formData.description,
              deadline: formData.deadline,
              priority: formData.priority,
              status: formData.status,
            },
            {
              headers: {
                "x-access-token": token,
                "Content-Type": "application/json",
              },
            }
          );

          // console.log(response);

      if (response.data.success) {
        setMessage(isEditing ? "Task updated successfully!" : "Task assigned successfully!");
        fetchTasks();
        resetForm();
      } else {
        setMessage("Failed to save task");
      }
    } catch (error) {
      console.error("Error saving task:", error);
      setMessage("Failed to save task");
    }
  };

  const handleEditClick = (task) => {
    setFormData({
      assignedTo: task.assignedTo._id,
      title: task.title,
      description: task.description,
      deadline: task.deadline.split("T")[0], // Format date for input
      priority: task.priority,
      status: task.status,
    });
    setIsEditing(true);
    setEditingTaskId(task._id);
  };

  const handleLogout = async () => {
    try {
        const response = await fetch('http://localhost:5000/api/v1/users/logout', {
            method: 'POST',
            headers: {
                'x-access-token': localStorage.getItem('adminToken'),
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            localStorage.removeItem('adminToken'); // Remove token from storage
            navigate('/'); // Redirect to login page
        } else {
            console.error("Logout failed");
        }
    } catch (error) {
        console.error("Error logging out:", error);
    }
};


  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.put(
        `http://localhost:5000/api/v1/task/status/${taskId}`,
        { status: newStatus },
        {
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setMessage("Task status updated successfully!");
        fetchTasks();
      } else {
        setMessage("Failed to update task status");
      }
    } catch (error) {
      console.error("Error updating task status:", error);
      setMessage("Error updating task status");
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.delete(
        `http://localhost:5000/api/v1/task/delete/${taskId}`,
        {
          headers: {
            "x-access-token": token,
          },
        }
      );

      if (response.data.success) {
        setMessage("Task deleted successfully!");
        fetchTasks();
      } else {
        setMessage("Failed to delete task");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      setMessage("Error deleting task");
    }
  };

  const resetForm = () => {
    setFormData({
      assignedTo: "",
      title: "",
      description: "",
      deadline: "",
      priority: "medium",
      status: "pending",
    });
    setIsEditing(false);
    setEditingTaskId(null);
  };

  return (
    <div>
      <h2>{isEditing ? "Edit Task" : "Assign Task"}</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <select name="assignedTo" value={formData.assignedTo} onChange={handleChange} required>
          <option value="">Select User</option>
          {users.length > 0 ? (
            users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.username} ({user.email})
              </option>
            ))
          ) : (
            <option disabled>Loading users...</option>
          )}
        </select>

        <input
          type="text"
          name="title"
          placeholder="Task Title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Task Description"
          value={formData.description}
          onChange={handleChange}
          required
        />

        <input
          type="date"
          name="deadline"
          value={formData.deadline}
          onChange={handleChange}
          required
        />

        <select name="priority" value={formData.priority} onChange={handleChange} required>
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>

        <button type="submit">{isEditing ? "Update Task" : "Assign Task"}</button>
        {isEditing && <button type="button" onClick={resetForm}>Cancel</button>}
      </form>

      {/* Display the assigned tasks */}
      {tasks.length > 0 && (
        <div>
          <h3>Assigned Tasks</h3>
          <div className="assigned-tasks-container">
            {tasks.map((task) => (
              <div key={task._id} className="task-card">
                <h4>{task.title}</h4>
                <p><strong>Assigned To:</strong> {task.assignedTo.username}</p>
                <p><strong>Deadline:</strong> {new Date(task.deadline).toLocaleDateString()}</p>
                <p><strong>Priority:</strong> {task.priority}</p>
                <p><strong>Status:</strong> {task.status}</p>
                <div>
                  <button onClick={() => handleEditClick(task)}>Edit</button>
                  <button onClick={() => updateTaskStatus(task._id, "completed")}>Mark as Completed</button>
                  <button onClick={() => deleteTask(task._id)}>Delete Task</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
       <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default AdminTaskAssign;
