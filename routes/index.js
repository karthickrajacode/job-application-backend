import express from "express";

import authRoute from "./authRouter.js";
import userRoute from "./userRouter.js";

const router = express.Router();

const path = "/api-v1/";

router.use(`${path}auth`, authRoute); //api-v1/auth/
router.use(`${path}auth`, userRoute); 

export default router;