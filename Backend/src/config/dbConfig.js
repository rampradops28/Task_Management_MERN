import mongoose from "mongoose";
import { DEV_DB_URL } from "./serverConfig.js";


export const connectDB = async function () {
    try {
        await mongoose.connect(DEV_DB_URL);
        console.log(`connected to mongoDb database${mongoose.connection.host}`)
    } catch (error) {   
        console.log(error,'Soemthing went wrong');
    }
};