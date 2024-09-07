import express from "express";
import userAuth from "../middlewares/authMiddleware.js";
import {
  createApplication,
  deleteApplication,
  getAllApplications,
  updateApplication,
} from "../controllers/applicationController.js";



const router = express.Router();

router.post("/create-application", userAuth, createApplication);
router.get("/", userAuth, getAllApplications);
router.put("/update-application/:id",userAuth,updateApplication );
router.delete("/delete-application/:id",userAuth,deleteApplication);

export default router;
