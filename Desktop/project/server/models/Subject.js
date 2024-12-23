import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  credits: {
    type: Number,
    required: true
  },
  semester: {
    type: Number,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  fees: {
    registration: {
      type: Number,
      default: 1500
    },
    reRegistrationF: {
      type: Number,
      required: true
    },
    reRegistrationW: {
      type: Number,
      required: true
    },
    challengeValuation: {
      type: Number,
      required: true
    }
  }
}, {
  timestamps: true
});

export default mongoose.model('Subject', subjectSchema);