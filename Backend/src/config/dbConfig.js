import mongoose from "mongoose";
import { DEV_DB_URL } from "./serverConfig.js";


export const connectDB = async function () {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/test");
        console.log(`connected to mongoDb database${mongoose.connection.host}`)
    } catch (error) {
        console.log(error,'Soemthing went wrong');
    }
};