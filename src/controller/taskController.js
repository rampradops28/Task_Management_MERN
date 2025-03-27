
import { createTaskService, deleteTaskService, getAllTaskService, getTaskByUserService, updateTaskService} from "../service/taskService.js";
import {taskRepository} from '../repository/taskRepository.js';
export const createTaskController = async function (req, res) {
    try {
        const data = { 
            assignedBy: req.user._id, 
            assignedTo: req.params.userId,
            deadline:  new Date(),
            ...req.body
        };

        const response = await createTaskService(data);
        res.status(201).send({
            success: true,
            message: "Task created and assigned",
            data: response
          });
    } catch (error) {
        console.error("Error in creating Task controller :", error);
        res.status(500).send({
        success: false,
        message: "Internal Server Error",
        error: error.message
      });
    }
};

export const updateTaskController = async function (req, res) {
    try {
        const taskId = req.params.taskId;
        const statusToUpdate = req.body;

        const response = await updateTaskService(taskId, statusToUpdate);
        res.status(201).send({
            success: true,
            message: "Task Updated",
            data: response
          });
    } catch (error) {
        console.error("Error in updating Task controller", error);
        res.status(500).send({
        success: false,
        message: "Internal Server Error",
        error: error.message
      });
    }
};

export const deleteTaskController = async function (req, res) {
    try {
        const taskId = req.params.taskId;

        const response = await deleteTaskService(taskId);
        res.status(201).send({
            success: true,
            message: "Task Deleted",
            data: response
        });
    } catch (error) {
        console.error("Error in deleting Task controller", error);
        res.status(500).send({
        success: false,
        message: "Internal Server Error",
        error: error.message
      });
    }
};

export const getAllTaskController = async function (req, res) {
    try {
        const response = await getAllTaskService();
        res.status(201).send({
            success: true,
            message: "All Task Fetched",
            data: response
        });
    } catch (error) {
        console.error("Error in get all Task controller", error);
        res.status(500).send({
        success: false,
        message: "Internal Server Error",
        error: error.message
      });
    }
};

export const getTaskByUserController = async function (req, res) {
    try {
        const userId = req.params.userId;

        // console.log(userId);

        if (req.user.id !== userId) {
            return res.status(403).json({
                success: false,
                message: "Access denied. You can only view your own task."
            });
        };

        const response = await getTaskByUserService(userId);
        res.status(201).send({
            success: true,
            message: "Task Fetched for a user",
            data: response
        });
    } catch (error) {
        console.error("Error in get Task By User controller", error);
        res.status(500).send({
        success: false,
        message: "Internal Server Error",
        error: error.message
      });
    }  
};


export const modifyTaskController = async (req, res) => {
    try {
        const taskId = req.params.taskId; // Get task ID from URL
        const { title, description, deadline, priority, status, assignedTo } = req.body; // Destructure request body
        console.log(taskId);
        // Check if task exists
        const existingTask = await taskRepository.getTaskById(taskId);
        if (!existingTask) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }

        // Update task details
        const updatedTask = await taskRepository.update(taskId, {
            title,
            description,
            deadline,
            priority,
            status,
            assignedTo, // Update assignedTo if necessary
        });

        return res.status(200).json({
            success: true,
            message: 'Task updated successfully',
            data: updatedTask,
        });
    } catch (error) {
        console.error("Error updating task:", error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
};
export const getAdminTasks = async (req, res) => {

    console.log("✅ Inside getAdmintasks function");

    
    console.log("✅ Decoded Admin ID from Token (req.user.id):", req.user.id);
    console.log("✅ Admin ID from Query (req.query.adminId):", req.query.adminId);

    // Ensure both are strings for comparison
    const decodedAdminId = req.user.id.toString();
    const queryAdminId = req.query.adminId.toString();

    console.log("🔍 After Conversion → Token ID:", decodedAdminId, " | Query ID:", queryAdminId);

    if (decodedAdminId !== queryAdminId) {
        console.log("❌ Admin ID mismatch. Access Denied.");
        return res.status(403).json({
            success: false,
            message: "Access denied. You can only view your own tasks."
        });
    }

    try {
        const tasks = await Task.find({ assignedBy: req.user.id });
        console.log("✅ Found Tasks:", tasks);
        
        res.status(200).json({
            success: true,
            tasks
        });
    } catch (error) {
        console.log("❌ Error Fetching Tasks:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};
