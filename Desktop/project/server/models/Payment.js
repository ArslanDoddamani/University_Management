import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject'
  },
  amount: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['ExamFee', 'ChallengeValuation', 'F', 'W'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  semester: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Payment', paymentSchema);