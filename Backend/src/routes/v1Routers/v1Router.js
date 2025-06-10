import express from "express";
import testRouter from "./testRouter.js";
import userRouter from "./userRoutes.js";
import taskRouter from "./taskRouter.js"; 

// Router object
const v1Router = express.Router();

// Routes
v1Router.use('/test', testRouter);
v1Router.use('/users', userRouter);
v1Router.use('/task', taskRouter); 

export default v1Router;