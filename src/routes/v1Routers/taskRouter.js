import express from "express";
import { createTaskController, deleteTaskController, getAdminTasks, getAllTaskController, getTaskByUserController, modifyTaskController, updateTaskController } from "../../controller/taskController.js";
import { isAdmin, isAuthenticated } from "../../middleware/authValidation.js";

// Router object
const taskRouter = express.Router();

taskRouter.post('/create/:userId', isAuthenticated, isAdmin, createTaskController);

taskRouter.put('/status/:taskId', isAuthenticated, isAdmin, updateTaskController);

taskRouter.delete('/delete/:taskId', isAuthenticated, isAdmin, deleteTaskController);

taskRouter.get('/', isAuthenticated, isAdmin, getAllTaskController);

taskRouter.get('/:userId', isAuthenticated, getTaskByUserController);

taskRouter.get("/admin-tasks", (req, res) => {
    console.log(" Route /admin/tasks hit");
    res.json({ success: true, message: "Route is working" });
});


taskRouter.put('/:taskId', isAuthenticated, isAdmin, modifyTaskController);

// taskRouter.get('/admin-tasks', isAuthenticated, isAdmin, getAdminTasks);

// taskRouter.get('/admin-tasks', (req, res, next) => {
//     console.log("Route /admin-tasks is being hit");
//     next();  // Pass to middleware
// }, isAuthenticated, isAdmin, getAdminTasks);


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