import express from "express";
import { deleteUserController, getUserController, loginController, registerController, registerControllerForAdmin, updatePasswordController, updateUserController } from "../../controller/usersController.js";
import { validRegistartion } from "../../middleware/validRegistartion.js";
import { validLogin } from "../../middleware/validLogin.js";
import { isAuthenticated } from "../../middleware/authValidation.js";
import { validRegistartionAdmin } from "../../middleware/validRegistrationAdmin.js";

const userRouter = express.Router();

userRouter.post('/signup', validRegistartion, registerController);

userRouter.post('/signup/admin', validRegistartionAdmin, registerControllerForAdmin);

userRouter.post('/login', validLogin, loginController);

userRouter.get('/', isAuthenticated, getUserController);

userRouter.put('/update', isAuthenticated, updateUserController);

userRouter.put('/updatePassword', isAuthenticated, updatePasswordController);

userRouter.delete('/delete/:id', isAuthenticated, deleteUserController);

userRouter.get('/profile', isAuthenticated, async (req, res) => {
    try {
        return res.status(200).json({
            success: true,
            message: "User fetched successfully",
            data: req.user,  // User is already set in `isAuthenticated`
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

userRouter.post('/logout', isAuthenticated, (req, res) => {
    res.status(200).json({
        success: true,
        message: "User logged out successfully",
    });
});



export default userRouter;