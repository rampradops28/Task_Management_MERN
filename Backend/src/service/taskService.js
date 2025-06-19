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

export const updateTaskService = async function (taskId, updateData, userId, userType) {
    try {
        console.log('updateTaskService called with:', { taskId, updateData, userId, userType });

        const task = await taskRepository.getTaskById(taskId);
        if (!task) {
            console.log('Task not found in service');
            throw new Error("Task Not Found");
        }

        // New valid statuses
        const validStatuses = ["pending", "in-progress", "review-requested", "completed", "rejected"];
        if (!validStatuses.includes(updateData.status)) {
            console.log('Invalid status value:', updateData.status);
            throw new Error("Invalid status value");
        }

        const currentStatus = task.status;
        const newStatus = updateData.status;

        // User can start a task or request review
        if (userType === 'user') {
            if (currentStatus === 'pending' && newStatus === 'in-progress') {
                return await taskRepository.update(
                    taskId,
                    { status: 'in-progress' },
                    userId
                );
            }
            if (currentStatus === 'in-progress' && newStatus === 'review-requested') {
                return await taskRepository.update(
                    taskId,
                    { status: 'review-requested' },
                    userId
                );
            }
            throw new Error("Invalid status transition");
        }

        // Admin can approve or reject
        if (userType === 'admin') {
            if (currentStatus === 'review-requested' && newStatus === 'completed') {
                // Approve
                    return await taskRepository.update(
                        taskId,
                        { status: 'completed', rejectionReason: null },
                        userId
                    );
            } else if (currentStatus === 'review-requested' && newStatus === 'rejected') {
                // Reject, must provide rejectionReason
                if (!updateData.rejectionReason) {
                    throw new Error("Rejection reason required");
                }
                return await taskRepository.update(
                    taskId,
                    { status: 'rejected', rejectionReason: updateData.rejectionReason },
                    userId
                );
            } else {
                throw new Error("Admins can only approve or reject tasks in 'review-requested' status");
            }
        }

        // Default: allow other transitions for admin (optional, or restrict as above)
        throw new Error("Invalid status transition");
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