import crudRepository from "./crudRepository.js";
import Task from "../models/tasksModel.js";

export const taskRepository = {
   ...crudRepository(Task),
   
   getTaskById: async function (id) {
      try {
         const task = await Task.findById(id)
            .populate('assignedBy', 'username email')
            .populate('assignedTo', 'username email')
            .populate('lastUpdatedBy', 'username email');
         return task;
      } catch (error) {
         console.log(error);
         throw error;
      }
   },

   getAllTaskWithDetails: async function () {
      try {
         const findAllTask = await Task.find()
            .populate('assignedBy', 'username email')
            .populate('assignedTo', 'username email')
            .populate('lastUpdatedBy', 'username email');
     
         return findAllTask;
      } catch (error) {
         console.log(error);
         throw error;
      }
   },

   getTaskWithUserId: async function (userId) {
      try {
         const tasks = await Task.find({ assignedTo: userId })
            .populate('assignedBy', 'username email')
            .populate('assignedTo', 'username email')
            .populate('lastUpdatedBy', 'username email');

         return tasks;
      } catch (error) {
         console.log(error);
         throw error;
      }
   },

   update: async function (taskId, updateData, userId, expectedVersion) {
      try {
         // Find the task and check its version
         const task = await Task.findById(taskId);
         if (!task) {
            throw new Error("Task not found");
         }

         // Check if the version matches
         if (task.version !== expectedVersion) {
            throw new Error("CONCURRENT_UPDATE");
         }

         // Update the task with version increment and update metadata
         const updatedTask = await Task.findOneAndUpdate(
            { 
               _id: taskId,
               version: expectedVersion
            },
            {
               ...updateData,
               version: expectedVersion + 1,
               lastUpdatedBy: userId,
               lastUpdateTimestamp: new Date()
            },
            { 
               new: true,
               runValidators: true
            }
         ).populate('assignedBy', 'username email')
          .populate('assignedTo', 'username email')
          .populate('lastUpdatedBy', 'username email');

         if (!updatedTask) {
            throw new Error("CONCURRENT_UPDATE");
         }

         return updatedTask;
      } catch (error) {
         console.log("Error updating task in repository:", error);
         throw error;
      }
   },

   getTaskCreatedByAdmin: async function (adminId) {
      try {
         const tasks = await Task.find({ assignedBy: adminId })
            .populate('assignedBy', 'username email')
            .populate('assignedTo', 'username email')
            .populate('lastUpdatedBy', 'username email');

         return tasks;
      } catch (error) {
         console.log(error);
         throw error;
      }
   }
};