import express from 'express';
import { auth, checkRole } from '../middleware/auth.js';
import User from '../models/User.js';
import Faculty from '../models/Faculty.js';
const router = express.Router();

//create
router.post('/register', async (req, res) => {
  try {
    const { name,email, password} = req.body;
    
    const existingFaculty = await Faculty.findOne({ email });
    if (existingFaculty) {
      return res.status(400).json({ message: 'Faculty already exists' });
    }

    const faculty = new Faculty({
      name,
      email,
      password,
      role: 'faculty'
    });

    await faculty.save();

    const token = jwt.sign(
      { facultyId: faculty._id, role: faculty.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({ token, user: { ...faculty._doc, password: undefined } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

//login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const faculty = await Faculty.findOne({ email });
    if (!faculty) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await faculty.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { facultyId: faculty._id, role: faculty.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, faculty: { ...faculty._doc, password: undefined } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});



// Get re-registered students
router.get('/re-registered-students', auth, checkRole(['faculty']), async (req, res) => {
  try {
    const students = await User.find({
      'grades.attempts': { $gt: 1 }
    }).populate('grades.subject');
    
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;