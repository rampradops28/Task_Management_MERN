import express from "express";
import mongoose from "mongoose";

const app = express();
const PORT =  6000;
const MONGO_URI = "mongodb://127.0.0.1:27017/taskManagementDB"; // Change DB name if needed

// Connect to MongoDB
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((error) => {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1);
  });

// Middleware
app.use(express.json());

// Sample route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Start server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
