import crudRepository from "./crudRepository.js";
import User from "../models/usersModels.js";

export const userRepository = {
    ...crudRepository(User),

    findUserByEmail: async function (email) {
        try {
            const user = await User.findOne({ email });
            return user;
        } catch (error) {
            console.error("Error in findUserByEmail:", error);
            throw error;
        }
    },

    getUserById: async function (id) {
        try {
            const user = await User.findById(id);
            return user;
        } catch (error) {
            console.error("Error in getUserById:", error);
            throw error;
        }
    },

    findUserByEmailOrUsername: async function (email, username) {
        try {
            return await User.findOne({ $or: [{ email }, { username }] });
        } catch (error) {
            console.error("Error in findUserByEmailOrUsername:", error);
            throw error;
        }
    },
    
    getAllUsers: async function () {
        try {
            const users = await User.find({ usertype: "user" }); // Fetch all users
            return users; // Return array of users
        } catch (error) {
            console.log("Error in getAllUsers:", error);
            throw error;
        }
    }

};
