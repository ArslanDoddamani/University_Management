import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    USN: { type: String, default: -1 },
    department: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    role: { type: String, enum: ['student', 'admin', 'faculty'], default: 'student' },
    currentSemester: { type: Number, default: 1 },
    registeredSubjects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        grade: String,
      },
    ],
    payments: [
      {
        amount: { type: Number, required: true },
        type: { type: String, enum: ['Registration fees','ExamFee', 'ChallengeValuation', 'F', 'W'], required: true },
        status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
        subject: {
          name: String,
          code: String,
        },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
