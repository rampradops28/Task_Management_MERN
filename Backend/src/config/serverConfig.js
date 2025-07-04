import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT ;

export const DEV_DB_URL = process.env.MONGODB_URI;

export const JWT_SECRET = process.env.JWT_SECRET;

export const FRONTEND = process.env.FRONTEND_URL || "http://localhost:5173";