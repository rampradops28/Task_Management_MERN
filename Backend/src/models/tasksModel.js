import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    status: {
        type: String,
        enum: ["pending", "in-progress", "completed"],
        default: "pending"
    },
    assignedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Refers to Admin
        required: true
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Refers to Regular User
        required: true
    },
    deadline: {
        type: Date
    },
    priority: {
        type: String,
        enum: ["low", "medium", "high"],
        default: "medium"
    }
}, { timestamps: true });

const Task = mongoose.model("Task", taskSchema);

export default Task;
