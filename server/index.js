import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './models/User.js';

dotenv.config();

const app = express();



app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// User.createIndexes(
//   {USN:1},
//   {unique:true, partialFilterExpression:{USN:{$ne:null}}}
// )
// Routes will be imported here
import authRoutes from './routes/auth.js';
import studentRoutes from './routes/student.js';
import adminRoutes from './routes/admin.js';
import facultyRoutes from './routes/faculty.js';

app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/faculty', facultyRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});