import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/serverConfig.js";

export const createToken = function(payload) {
    return jwt.sign(payload, JWT_SECRET, {expiresIn: "7d"})
};

export const verifyToken = async function(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        console.error("JWT Verification Error:", error);
        return null; // Return null if token is invalid or expired
    }
};
