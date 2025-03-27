import express from "express";
import v1Router from "./v1Routers/v1Router.js";

// Router object
const apiRouter = express.Router();

// Routes
apiRouter.use('/v1', v1Router);

export default apiRouter;