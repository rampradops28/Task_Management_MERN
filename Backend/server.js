import express from "express";
import { createServer } from "http";
import cors from "cors";
import apiRouter from "./src/routes/apiRouter.js";
import { PORT } from "./src/config/serverConfig.js";
import { FRONTEND } from "./src/config/serverConfig.js";
import { connectDB } from "./src/config/dbConfig.js";

const app = express();
const httpServer = createServer(app);

// CORS configuration
app.use(cors({
    origin: FRONTEND || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "x-access-token"],
    credentials: true
}));

// Middleware
app.use(express.json());

// API Routes
app.use('/api', apiRouter);

// Sample route
app.get("/", (req, res) => {
    res.send("API is running...");
});

// Connect to DB and start server
connectDB().then(() => {
    httpServer.listen(PORT, () =>
        console.log(`🚀 Server running on port ${PORT}`)
    );
});