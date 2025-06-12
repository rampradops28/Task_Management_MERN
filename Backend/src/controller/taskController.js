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
        // ...existing code...

        // Remove any version/concurrency check here
        // Example (remove this block if present):
        // if (req.body.version !== task.version) {
        //   return res.status(409).json({
        //     success: false,
        //     message: "Concurrent update error",
        //     error: "CONCURRENT_UPDATE"
        //   });
        // }

        // Proceed to update the task directly
        const updatedTask = await taskRepository.updateTask(taskId, statusToUpdate);
        return res.status(200).json({
            success: true,
            message: "Task updated successfully",
            data: updatedTask
        });
    } catch (error) {
        console.error("Error in updating Task controller:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
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

        // Allow admins to view any user's tasks
        if (req.user.usertype !== 'admin' && req.user.id !== userId) {
            return res.status(403).json({
                success: false,
                message: "Access denied. You can only view your own tasks."
            });
        }

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
        const taskId = req.params.taskId;
        const { title, description, deadline, priority, status, assignedTo } = req.body;
        console.log('Received update request for task:', taskId);
        console.log('Update data:', { title, description, deadline, priority, status, assignedTo });

        // Check if task exists
        const existingTask = await taskRepository.getTaskById(taskId);
        if (!existingTask) {
            console.log('Task not found:', taskId);
            return res.status(404).json({ 
                success: false, 
                message: 'Task not found' 
            });
        }
        console.log('Existing task:', existingTask);

        // Validate required fields
        if (!title || !description || !deadline || !priority || !status || !assignedTo) {
            console.log('Missing required fields');
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // Update task details
        const updatedTask = await taskRepository.update(taskId, {
            title,
            description,
            deadline: new Date(deadline),
            priority,
            status,
            assignedTo
        });
        console.log('Task updated:', updatedTask);

        if (!updatedTask) {
            console.log('Failed to update task');
            return res.status(400).json({
                success: false,
                message: 'Failed to update task'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Task updated successfully',
            data: updatedTask
        });
    } catch (error) {
        console.error("Error updating task:", error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
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
