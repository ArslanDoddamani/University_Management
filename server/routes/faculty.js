import express from 'express';
import { auth, checkRole } from '../middleware/auth.js';
import User from '../models/User.js';
import Faculty from '../models/Faculty.js';
const router = express.Router();
import jwt from 'jsonwebtoken';

//create
router.post('/register', async (req, res) => {
  try {
    const { name,email, password, department } = req.body;
    
    const existingFaculty = await Faculty.findOne({ email });
    if (existingFaculty) {
      return res.status(400).json({ message: 'Faculty already exists' });
    }

    const faculty = new Faculty({
      name,
      email,
      password,
      department,
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
    
    const faculty = await Faculty.findOne({ email,password});
    if (!faculty) {
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

router.get('/profile/:facultyId', async(req,res) => {
  const { facultyId } = req.params;

  try {
    const faculty = await Faculty.findById(facultyId);
    if (!faculty) {
      return res.status(404).json({ message: 'Faculty not found' });
    }
    res.json(faculty);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.patch('/updateStatus', async (req, res) => {
  const { facultyId, usn, subCode, status } = req.body;

  if (!facultyId || !usn || !subCode || !status) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Find the faculty by ID
    const faculty = await Faculty.findById(facultyId);
    if (!faculty) {
      return res.status(404).json({ message: 'Faculty not found' });
    }

    // Locate the student with the matching USN and subject code in the students array
    const student = faculty.students.find(
      (student) =>
        student.usn === usn &&
        student.subCode === subCode
    );

    if (!student) {
      return res.status(404).json({ message: 'Student or subject not found' });
    }

    // Update the status field
    student.status = status;

    // Save the changes to the database
    await faculty.save();

    res.status(200).json({ success: true ,message: 'Status updated successfully', updatedStudent: student });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/allFaculty', async(req, res) =>{
  try {
    const allFaculty = await Faculty.find({});
    return res.status(200).json({allFaculty})
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/allFaculty/:dept', async(req, res) =>{
  try {
    const { dept } = req.params;
    console.log(dept);
    const allFaculty = await Faculty.find({department: dept});
    return res.status(200).json({allFaculty})
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/deleteFaculty', async(req, res) =>{
  try {
    const facultyId = req.body.facultyId;
    await Faculty.findByIdAndDelete(facultyId);
    res.json({ message: 'Faculty deleted successfully' });

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