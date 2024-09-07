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
      return res.status(400).json({
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
      message: "Application Submitted successfully",
      success: true,
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
  try {
    const jobSeeker = req.body.user.userId;
    const { search, sort, location } = req.query;

    const queryObject = { jobSeeker };

    if (location) {
      queryObject.status = { $regex: location, $options: "i" };
    }

    let queryResult = Applications.find(queryObject)
      .select("-password")
      .populate("jobSeeker", "firstName lastName email -password")
      .populate({
        path: "jobPosting",
        select: "company jobTitle",
        populate: {
          path: "company",
          select: "name profileUrl -password",
        },
      });

    switch (sort) {
      case "Newest":
        queryResult = queryResult.sort("-createdAt");
        break;
      case "Oldest":
        queryResult = queryResult.sort("createdAt");
        break;
      default:
        break;
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;

    const skip = (page - 1) * limit;

    const applications = await queryResult.skip(skip).limit(limit);

    // Apply additional filtering on the populated results
    if (search) {
      applications = applications.filter((application) =>
        application.jobPosting.jobTitle.match(new RegExp(search, "i"))
      );
    }

    // Sorting based on jobPosting.jobTitle or other fields
    if (sort === "A-Z" || sort === "Z-A") {
      applications.sort((a, b) => {
        const titleA = a.jobPosting.jobTitle.toUpperCase();
        const titleB = b.jobPosting.jobTitle.toUpperCase();
        if (sort === "A-Z") {
          return titleA.localeCompare(titleB);
        } else {
          return titleB.localeCompare(titleA);
        }
      });
    }

    const total = await Applications.countDocuments(queryResult);
    const numOfPage = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      total,
      data: applications,
      page,
      numOfPage,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const updateApplication = async (req, res, next) => {
  try {
    const { status } = req.body;
    const applicationId = req.params.id;

    if (!applicationId || !status) {
      return res.status(400).json({
        status: "Error",
        message: "Missing required fields: applicationId and/or status",
      });
    }

    const updatedApplication = await Applications.findByIdAndUpdate(
      applicationId,
      { status },
      { new: true, runValidators: true }
    )
      .populate("jobSeeker", "firstName lastName email -password")
      .populate({
        path: "jobPosting",
        select: "company jobTitle",
        populate: {
          path: "company",
          select: "name -password",
        },
      });

    if (!updatedApplication) {
      return res.status(404).json({
        status: "Error",
        message: "Application not found",
      });
    }

    res.status(200).json({
      status: "Updated successfully",
      data: {
        updatedApplication,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const deleteApplication = async (req, res, next) => {
  const applicationId = req.params.id;

  const deletedApplication = await Applications.findByIdAndDelete(
    applicationId
  );

  if (!deletedApplication) {
    return res.status(404).json({
      status: "Failure",
      message: "Application not found",
    });
  }

  res.status(200).json({
    status: "Deleted Successfully",
    data: {
      application: deletedApplication,
    },
  });
};
