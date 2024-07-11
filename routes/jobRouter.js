import express from "express";
import userAuth from "../middlewares/authMiddleware.js"
import { createJob, deleteJobPost, getJobById, getJobPosts, updateJob } from "../controllers/jobController.js";


const router = express.Router();

//Post Job
router.post("/upload-job", userAuth, createJob);

//Update job
router.put("/update-job/:jobId", userAuth, updateJob);

//Get Job Post
router.get("/find-jobs", getJobPosts);
router.get("/get-job-detail/:id", getJobById);

//Delete Job Post
router.delete("/delete-job/:id", userAuth, deleteJobPost);

export default router;