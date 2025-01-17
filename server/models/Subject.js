import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    credits: {
      type: Number,
      required: true,
    },
    semester: {
      type: Number,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    fees: {
      registration: {
        type: Number,
        default: 1500,
      },
      reRegistrationF: {
        type: Number,
        required: true,
      },
      reRegistrationW: {
        type: Number,
        required: true,
      },
      challengeValuation: {
        type: Number,
        required: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Middleware to remove subject from registeredSubjects in the User model
subjectSchema.pre("deleteOne", { document: true, query: false }, async function (next) {
  const subjectId = this._id;

  try {
    // Remove the subject from all users' registeredSubjects
    await mongoose.model("User").updateMany(
      { "registeredSubjects.subject": subjectId },
      { $pull: { registeredSubjects: { subject: subjectId } } }
    );

    console.log(`Removed subject (${subjectId}) from all registered users.`);
    next();
  } catch (err) {
    console.error(`Error removing subject (${subjectId}) from users:`, err);
    next(err);
  }
});

export default mongoose.model("Subject", subjectSchema);
