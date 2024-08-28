import express from "express";
import userAuth from "../middlewares/authMiddleware.js";
import {
  createApplication,
  getAllApplications,
} from "../controllers/applicationController.js";

const router = express.Router();

router.post("/create-application", userAuth, createApplication);
router.get("/get-all-applications", userAuth, getAllApplications);

export default router;
