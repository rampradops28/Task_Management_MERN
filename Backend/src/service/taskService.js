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

export const updateTaskService = async function (taskId, statusToUpdate) {
    try {
        const isTaskValid = await taskRepository.getTaskById(taskId);
        if(!isTaskValid) {
            throw new Error("Task Not Found")
        };
        const updatedTask = await taskRepository.update(taskId, statusToUpdate);
        return updatedTask;
    } catch (error) {
        console.log("Create Task service error", error);
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