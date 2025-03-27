import { deleteUserService, getUserService, loginService, registerUserService, registerUserServiceForAdmin, updatePasswordService, updateUserService , getAllUsersService} from "../service/userService.js";

export const registerController = async function(req, res) {
    try {
        const user = await registerUserService(req.body);   // {username, email, password, phone, address} = req.body;

        res.status(201).send({
          success: true,
          message: "User Registered",
          data: user
        });
     } catch (error) {
    console.error("Error in register controller:", error);
        res.status(500).send({
        success: false,
        message: "Internal Server Error",
        error: error.message
      });
    }
};

export const registerControllerForAdmin = async function(req, res) {
  try {
      const user = await registerUserServiceForAdmin(req.body);   // {username, email, password, usertype} = req.body;

      res.status(201).send({
        success: true,
        message: "Admin Registered",
        data: user
      });
   } catch (error) {
  console.error("Error in register controller Admin:", error);
      res.status(500).send({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
};

export const loginController = async function (req, res) {
    try {
        const user = await loginService(req.body);
        return res.status(200).json({
            success: true,
            message:'User Logged in successfully',
            data: user
        })
    } catch (error) {
     console.error("Error in LogIn controller:", error);
        res.status(500).send({
        success: false,
        message: "Internal Server Error",
        error: error.message
      });
    }
};

// export const getUserController = async function (req, res) {
//   try {
//     const user = await getUserService(req.user.id);
//     return res.status(200).json({
//       success: true,
//       message:'User fetched successfully',
//       data: user
//    });
//   } catch (error) {
//       console.error("Error in getUser controller:", error);
//       res.status(500).send({
//       success: false,
//       message: "Internal Server Error",
//       error: error.message
//     });
//   }
// }; 

export const getUserController = async function (req, res) {
  try {
      const users = await getAllUsersService();  // Fetch all users
      return res.status(200).json({
          success: true,
          message: 'Users fetched successfully',
          data: users
      });
  } catch (error) {
      console.error("Error in getUserController:", error);
      res.status(500).send({
          success: false,
          message: "Internal Server Error",
          error: error.message
      });
  }
};


export const updateUserController = async function (req, res) {
  try {
      const userId = req.user.id;
      const data = req.body;

      const userToUpdate = await updateUserService(userId, data);
      return res.status(200).json({
        success: true,
        message:'User updated successfully',
        data: userToUpdate
     });
  } catch (error) {
      console.error("Error in getUser controller:", error);
      res.status(500).send({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
};

export const updatePasswordController = async function (req, res) {
  try {
    const data = {
      oldPassword: req.body.oldPassword, // Extract as a string
      newPassword: req.body.newPassword  // Extract as a string
    };

    const updatedData = await updatePasswordService(req.user, data);

    return res.status(200).json({
      success: true,
      message:'password updated successfully',
      data: updatedData
   });
    
  } catch (error) {
    console.error("Error in updatePassword controller:", error);
    res.status(500).send({
    success: false,
    message: "Internal Server Error",
    error: error.message
   });
  }
};
export const deleteUserController = async function (req, res) {
  try {
      const userId = req.params.id;

      // Ensure only the logged-in user OR an admin can delete an account
      if (req.user.id !== userId && req.user.usertype !== 'admin') {
          return res.status(403).json({
              success: false,
              message: "You are not authorized to delete this account"
          });
      }

      const response = await deleteUserService(userId);

      return res.status(200).json({
        success: true,
        message: 'User deleted successfully',
        data: response
     });
  } catch (error) {
    console.error("Error in delete User controller:", error);
    res.status(500).send({
    success: false,
    message: "Internal Server Error",
    error: error.message
   });
  }
};

export const getAllUsersController = async (req, res) => {
  try {
      console.log("Fetching all users...");
      const users = await userRepository.getAllUsers();  // Should return an array of users

      if (!users || users.length === 0) {
          return res.status(404).json({ success: false, message: "No users found" });
      }

      res.status(200).json({
          success: true,
          message: "Users fetched successfully",
          data: users  // Should return an array, not a single object
      });
  } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
