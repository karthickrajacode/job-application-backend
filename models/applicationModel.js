import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    // Reference to the job seeker (applicant)
    jobSeeker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users", // Assuming the user schema is named 'User'
      required: true,
    },

    // Reference to the job posting
    jobPosting: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Jobs", // Assuming the job posting schema is named 'JobPosting'
      required: true,
    },

    // Cover letter submitted by the applicant
    coverLetter: {
      type: String,
    },

    // Resume file URL or reference
    resume: {
      url: {
        type: String,
        required: true,
      },
      // Add other details related to the resume if needed
    },

    // Status of the application (e.g., 'Pending', 'Reviewed', 'Accepted', 'Rejected')
    status: {
      type: String,
      enum: ["Pending", "Reviewed", "Accepted", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true }
);


// Create the model using the schema
const Applications = mongoose.model("Applications", applicationSchema);

export default Applications;
