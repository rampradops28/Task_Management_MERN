import express from "express";
import cors from "cors";
import { PORT } from "./src/config/serverConfig.js";
import apiRouter from "./src/routes/apiRouter.js";
import { connectDB } from "./src/config/dbConfig.js";


//rest object
const app = express(); 

const corsOptions = {
  origin: 'http://localhost:5173', // Allow this origin to access the server
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed methods
  credentials: true, // Allow credentials (if needed)
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.text()); 
app.use(express.urlencoded({ extended: true }));
app.use(express.raw());


//route
  // URL => localhost:8080
  app.use("/api", apiRouter);

app.get("/ping", (req,res) => {
    return (res.status(200).send("<h1> Pong </h1>"))
});

// app.post("/api/v1/tasks/create/:id", (req, res) => {
//   res.send("Task Created");
// });


//Port
// const PORT = 8080;

//Listen
app.listen(PORT, () => {
   console.log(`Server Running on ${PORT}`);
   connectDB()
});