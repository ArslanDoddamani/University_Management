import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  USN: {
    type: Number,
    default:-1
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
    ref: 'Subject',
    grade: String
  }],
}, {
  timestamps: true
});


// userSchema.pre('save', async function(next) {
//   if (!this.isModified('password')) return next();
//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });

// userSchema.methods.comparePassword = async function(candidatePassword) {
//   return bcrypt.compare(candidatePassword, this.password);
// };

export default mongoose.model('User', userSchema);