import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true },
    type: {
      type: String,
      enum: [
        "Registration fees",
        "ExamFee",
        "ChallengeValuation",
        "F",
        "W",
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
