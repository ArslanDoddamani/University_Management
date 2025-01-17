import mongoose from "mongoose";

const challengeValuationSchema = new mongoose.Schema(
  {
    USN: {
      type: String,
      required: true,
    },
    Name: {
      type: String,
      required: true,
    },
    SubjectCode: {
      type: String,
      required: true,
    },
    SubjectName: {
      type: String,
      required: true,
    },
    Semester: {
      type: Number,
      required: true,
    },
    Type: {
      type: String,
      enum: ["Regular", "Reregister - F", "Reregister - W"],
      required: true,
    },
    Status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("ChallengeValuation", challengeValuationSchema);
