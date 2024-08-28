import express from "express";

import authRoute from "./authRouter.js";
import userRoute from "./userRouter.js";
import companyRoute from "./companiesRouter.js"
import jobRoute from "./jobRouter.js";
import applicationRoute from './applicationRouter.js'

const router = express.Router();

const path = "/api-v1/";

router.use(`${path}auth`, authRoute); //api-v1/auth/
router.use(`${path}users`, userRoute);
router.use(`${path}companies`, companyRoute);
router.use(`${path}jobs`, jobRoute)
router.use(`${path}applications`, applicationRoute)

export default router;