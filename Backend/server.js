import express from "express";
import mongoose from "mongoose";
import { createServer } from "http";
import cors from "cors"; 
import apiRouter from "./src/routes/apiRouter.js";

const app = express();
const httpServer = createServer(app);
const PORT = 5000;
const MONGO_URI = "mongodb://127.0.0.1:27017/test"; // Change DB name if needed

// CORS configuration
app.use(cors({
  origin: "http://localhost:5173", // Your frontend URL
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "x-access-token"],
  credentials: true
}));

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

// API Routes
app.use('/api', apiRouter);

// Sample route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Start server
httpServer.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
