import express from "express";
import { createTaskController, deleteTaskController, getAdminTasks, getAllTaskController, getTaskByUserController, modifyTaskController, updateTaskController } from "../../controller/taskController.js";
import { isAdmin, isAuthenticated } from "../../middleware/authValidation.js";

// Router object
const taskRouter = express.Router();

// Create task
taskRouter.post('/create/:userId', isAuthenticated, isAdmin, createTaskController);

// Update task status (Admin)
taskRouter.put('/status/:taskId', isAuthenticated, isAdmin, updateTaskController);

// Update task status (User)
taskRouter.put('/user-status/:taskId', isAuthenticated, updateTaskController);

// Delete task
taskRouter.delete('/delete/:taskId', isAuthenticated, isAdmin, deleteTaskController);

// Get all tasks
taskRouter.get('/', isAuthenticated, isAdmin, getAllTaskController);

// Get tasks by user
taskRouter.get('/:userId', isAuthenticated, getTaskByUserController);

// Update task (full update)
taskRouter.put('/:taskId', isAuthenticated, isAdmin, modifyTaskController);

taskRouter.get("/admin-tasks", (req, res) => {
    console.log(" Route /admin/tasks hit");
    res.json({ success: true, message: "Route is working" });
});

taskRouter.get('/users', isAuthenticated, isAdmin, async (req, res) => {
    try {
        console.log("Fetching all users...");
        const users = await userRepository.getAllUsers(); // Ensure it returns an array

        if (!users || users.length === 0) {
            return res.status(404).json({ success: false, message: "No users found" });
        }

        res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            data: users  // Ensure it returns an array, not a single object
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

export default taskRouter;