import express from "express";
import { testController } from "../../controller/testController.js";

// Router object
const testRouter = express.Router();

// Routes
testRouter.get('/', testController)

export default testRouter;