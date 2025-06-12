import express from "express";
import { createServer } from "http";
import cors from "cors";
import apiRouter from "./src/routes/apiRouter.js";
import { PORT } from "./src/config/serverConfig.js";
import { FRONTEND } from "./src/config/serverConfig.js";
import { connectDB } from "./src/config/dbConfig.js";

const app = express();
const httpServer = createServer(app);

console.log("CORS allowed origin:", FRONTEND);
// CORS configuration
const allowedOrigins = [
  "https://task-management-mern-amber.vercel.app",
  "http://localhost:5173"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "x-access-token"]
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