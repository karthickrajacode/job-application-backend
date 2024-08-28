import Applications from "../models/applicationModel.js";
import User from "../models/userModel.js";
import JobPosting from "../models/jobsModel.js";

// Create a new application
export const createApplication = async (req, res, next) => {
  try {
    const { jobSeekerId, jobPostingId, resume } = req.body;

    // Check if job seeker and job posting exist
    const jobSeeker = await User.findById(jobSeekerId);
    const jobPosting = await JobPosting.findById(jobPostingId);

    if (!jobSeeker || !jobPosting) {
      return res.status(404).json({
        status: "fail",
        message: "Job seeker or job posting not found",
      });
    }

    // Create the application
    const application = await Applications.create({
      jobSeeker: jobSeekerId,
      jobPosting: jobPostingId,
      resume,
    });

    jobPosting.application.push(application._id);

    await jobPosting.save();

    res.status(201).json({
      status: "success",
      data: {
        application,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

// Get all applications
export const getAllApplications = async (req, res, next) => {
  const applications = await Applications.find()
    .populate("jobSeeker", "firstName lastName email -password")
    .populate({
      path: "jobPosting",
      select: "company jobTitle",
      populate: {
        path: "company",
        select: "name -password",
      },
    });

  res.status(200).json({
    status: "success",
    results: applications.length,
    data: {
      applications,
    },
  });
};


