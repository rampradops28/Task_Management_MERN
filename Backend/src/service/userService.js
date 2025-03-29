import { userRepository } from "../repository/userRepository.js";
import bcrypt from "bcryptjs";
import { createToken } from "../utils/authUtils.js";

export const registerUserService = async function (user) {
    try {
        const alreadyExist = await userRepository.findUserByEmail(user.email);
        if(alreadyExist) {
            throw new Error("Email Already Registered");
            };

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        
        user.password = hashedPassword;

        const newUser = await userRepository.create(user);
        return newUser;
    } catch (error) {
        console.log('Error in createUserService:', error); // Debug log
        if (error.name === 'MongoServerError' && error.code === 11000) {
            throw {
                status: 400,
                message: 'User with same email or username already exists',
            };
        } else {
            throw error; // Re-throw other errors
        }
       
    }
};

export const registerUserServiceForAdmin = async function (user) {
    try {
        const alreadyExist = await userRepository.findUserByEmailOrUsername(user.email, user.username);
        if (alreadyExist) {
            throw new Error("Email or Username Already Registered");
        };
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        
        user.password = hashedPassword;

        const newAdmin = await userRepository.create(user);
        return newAdmin;
    } catch (error) {
        console.log('Error in createAdminService:', error); // Debug log
        if (error.name === 'MongoServerError' && error.code === 11000) {
            throw {
                status: 400,
                message: 'Admin with same email or username already exists',
            };
        } else {
            throw error; // Re-throw other errors
        }
       
    }
};

export const loginService = async function (userDetails) {
    try {
        const user = await userRepository.findUserByEmail(userDetails.email);
        if(!user) {
            throw new Error("User Not Found");
        };

        const isMatch = await bcrypt.compare(userDetails.password, user.password);
        if(!isMatch) {
            console.log("Entered Password:", userDetails.password);
            console.log("Stored Password:", user.password);    
            throw new Error("wrong password");
        };

       return {
        user,
        token: createToken({id:user._id, username: user.username, email: user.email})
       };
    } catch (error) {
        console.log("Login service error",error);
        throw error;
    }
};

export const getUserService = async function (userId) {
    try {
        const user = await userRepository.getUserById(userId);
        if(!user) {
            throw new Error("User Not Found");
        };

        return user;
    } catch (error) {
        console.log("getUser service error",error);
        throw error;
    }
};

export const updateUserService = async function (userId, data) {
    try {
        const user = await userRepository.getUserById(userId);
        if(!user) {
            throw new Error("User Not Found");
        };

        const updatedUser = await userRepository.update(userId, data);
        return updatedUser;
    } catch (error) {
        console.log("updateUser service error",error);
        throw error;
    }
};

export const updatePasswordService = async function (userId, data) {
    try {
        const user = await userRepository.getUserById(userId);
        if(!user) {
            throw new Error("User Not Found");
        };

        // destructure coming data
        const {oldPassword, newPassword} = data;

        // Perform Password validation
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if(!isMatch) {
            console.log("Entered Password:", oldPassword);
            console.log("Stored Password:", user.password);    
            throw new Error("wrong password");
        };
        
        // Hash The New Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        
        // save and update newPassword in DB
        const updatePassword = await userRepository.update(userId, {password:hashedPassword});
        return updatePassword;
    } catch (error) {
        console.log("updatePassword service error",error);
        throw error;
    }
};

export const deleteUserService = async function (userId) {
    try {
        const user = await userRepository.getUserById(userId);
        if(!user) {
            throw new Error("User Not Found");
        };

        const deleteUser = await userRepository.delete(user);
        return deleteUser;
    } catch (error) {
        console.log("delete user service error",error);
        throw error;
    }
};

export const getAllUsersService = async function () {
    try {
        const users = await userRepository.getAllUsers(); // Fetch all users
        return users;
    } catch (error) {
        console.log("getAllUsers service error", error);
        throw error;
    }
};
