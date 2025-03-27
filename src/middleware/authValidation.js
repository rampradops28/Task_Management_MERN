import { userRepository } from "../repository/userRepository.js";
import { verifyToken } from "../utils/authUtils.js";

export const isAuthenticated = async function (req, res, next) {

    // Check if JWT is passed in the header
    const token = req.headers['x-access-token'];

    if (!token) {
        return res.status(400).json({
            success: false,
            message: 'Token is required'
        });
    }

    // Verify the token
    try {
        const response = await verifyToken(token);

        // console.log("✅ Decoded Token:", response);


        if (!response) {
            return res.status(400).json({
                success: false,
                message: 'invalid auth token'
            });
        }

        const user = await userRepository.getUserById(response.id);
        // console.log("Decoded response.id:", response.id);
        // console.log("✅ Found User:", user);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // console.log('auth Middleware before', req);
        
        req.user = user; 
      //console.log('auth Middleware after', req);
        next();
    } catch (error) {
        console.log(error)
        return res.status(401).json({
            success: false,
            message: 'Invalid token'
        });
    }
};

    export const isAdmin = (req, res, next) => {
        if (req.user.usertype !== 'admin') {
            return res.status(403).json({
                success: false,
                message: "Access denied. Admins only."
            });
        }
        next();
    };
