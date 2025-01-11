import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import mongooseSequence from 'mongoose-sequence';


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  usn: {
    type: Number, // Change this to Number
    unique: true,
  },
  department: {
    type: String,
    required: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['student', 'admin', 'faculty'],
    default: 'student'
  },
  currentSemester: {
    type: Number,
    default: 1
  },
  registeredSubjects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject'
  }],
  grades: [{
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject'
    },
    grade: String,
    semester: Number,
    attempts: {
      type: Number,
      default: 1
    }
  }]
}, {
  timestamps: true
});

// Apply mongoose-sequence for auto-incrementing the usn
const AutoIncrement = mongooseSequence(mongoose);
userSchema.plugin(AutoIncrement, { inc_field: 'usn' });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema);