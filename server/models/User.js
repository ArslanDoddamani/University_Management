import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true },
    type: {
      type: String,
      enum: [
        "Semester 1 Registration fees",
        "Semester 2 Registration fees",
        "Semester 3 Registration fees",
        "Semester 4 Registration fees",
        "Semester 5 Registration fees",
        "Semester 6 Registration fees",
        "Semester 7 Registration fees",
        "Semester 8 Registration fees",
        "ExamFee",
        "ChallengeValuation",
        "Reregister - F",
        "Reregister - W",
      ],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    subject: {
      name: { type: String },
      code: { type: String },
    },
    razorpay_order_id: { type: String },
    razorpay_payment_id: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false } // Disable automatic _id for subdocuments
);

const registeredSubjectSchema = new mongoose.Schema(
  {
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
    grade: {
      type: String,
      default: "-",
    },
    flag: {
      type: Boolean,
      default: false,
    },
    semester: {
      type: Number,
      required: true,
    },
    registerType: {
      type: String,
      enum: [
        "Regular",
        "Reregister - F",
        "Reregister - W",
      ],
      required: true,
    },
    time: {
      type: String, // Change the type from Date to String
      default: () => new Date().toISOString().slice(0, 16), // Default to ISO 8601 format with date and time (to the minute)
    },
  },
  { _id: false } // Disable automatic _id for subdocuments
);



const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    USN: { type: String, default: "-1" },
    department: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    role: {
      type: String,
      enum: ["student", "admin", "faculty"],
      default: "student",
    },
    currentSemester: { type: Number, default: 1 },
    registeredSubjects: [registeredSubjectSchema], // Array of subdocuments
    payments: [paymentSchema], // Array of payments subdocuments
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
