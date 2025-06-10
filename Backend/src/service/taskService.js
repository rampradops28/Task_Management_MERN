import { taskRepository } from "../repository/taskRepository.js";
import { userRepository } from "../repository/userRepository.js";

export const createTaskService = async function (taskData) {
    try {
        // Validate the assigned user exists
        const user = await userRepository.getUserById(taskData.assignedTo);
        if (!user) {
            throw new Error("User to assign task not found.");
        };

        // Prevent assigning tasks to admins
        if (user.usertype === 'admin') {
           throw new Error("Cannot assign tasks to another admin.");
        };

        const task = await taskRepository.create(taskData);
        return task;
    } catch (error) {
        console.log("Create Task service error", error);
        throw error;
    }
};

export const updateTaskService = async function (taskId, updateData, userId) {
    try {
        console.log('updateTaskService called with:', { taskId, updateData, userId });

        const task = await taskRepository.getTaskById(taskId);
        if (!task) {
            console.log('Task not found in service');
            throw new Error("Task Not Found");
        }

        // Validate the status value
        const validStatuses = ["pending", "in-progress", "completed"];
        if (!validStatuses.includes(updateData.status)) {
            console.log('Invalid status value:', updateData.status);
            throw new Error("Invalid status value");
        }

        // Validate status transition
        const currentStatus = task.status;
        const newStatus = updateData.status;
        
        const validTransitions = {
            'pending': ['in-progress'],
            'in-progress': ['completed'],
            'completed': []
        };

        if (!validTransitions[currentStatus].includes(newStatus)) {
            console.log('Invalid status transition:', { from: currentStatus, to: newStatus });
            throw new Error(`Cannot change status from ${currentStatus} to ${newStatus}`);
        }

        try {
            const updatedTask = await taskRepository.update(
                taskId,
                { status: updateData.status },
                userId,
                updateData.version
            );
            console.log('Task updated successfully in service:', updatedTask);
            return updatedTask;
        } catch (error) {
            if (error.message === "CONCURRENT_UPDATE") {
                // Get the latest task state for the error message
                const latestTask = await taskRepository.getTaskById(taskId);
                throw {
                    code: "CONCURRENT_UPDATE",
                    message: "Task was updated by another user",
                    currentStatus: latestTask.status,
                    lastUpdatedBy: latestTask.lastUpdatedBy,
                    lastUpdateTimestamp: latestTask.lastUpdateTimestamp
                };
            }
            throw error;
        }
    } catch (error) {
        console.log("Update Task service error:", error);
        throw error;
    }
};

export const deleteTaskService = async function (taskId) {
   try {
        const isTaskValid = await taskRepository.getTaskById(taskId);

        if(!isTaskValid) {
            throw new Error("Task Not Found")
        };

        const taskToDelete = await taskRepository.delete(taskId);
        return taskToDelete;
   } catch (error) {
        console.log("delete Task service error", error);
        throw error;
   }  
};

export const getAllTaskService = async function () {
  try {
      const tasks = await taskRepository.getAllTaskWithDetails();
      return tasks;
  } catch (error) {
    console.log("get all Task service error", error);
    throw error;
  }  
};

export const getTaskByUserService = async function (userId) {
    try {
        const tasks = await taskRepository.getTaskWithUserId(userId);
        return tasks;
    } catch (error) {
        console.log("get all Task service error", error);
        throw error;
    }
};