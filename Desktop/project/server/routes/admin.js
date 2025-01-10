import express from 'express';
import { auth, checkRole } from '../middleware/auth.js';
import User from '../models/User.js';
import Subject from '../models/Subject.js';
import Admin from '../models/Admin.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

//admin login
router.post('/login',async(req,res)=>{
  try {
     const { email, password } = req.body;
     
     const admin = await Admin.findOne({ email,password });
     if (!admin) {
       return res.status(400).json({ message: 'Invalid credentials' });
     }
 
     const token = jwt.sign(
       { userId: admin._id, role: admin.role },
       process.env.JWT_SECRET,
       { expiresIn: '24h' }
     );
 
     res.json({ token, admin: { ...admin._doc, password: undefined } });
   } catch (error) {
     res.status(500).json({ message: 'Server error', error: error.message });
   }
})

// Add subject
router.post('/subjects', auth, checkRole(['admin']), async (req, res) => {
  console.log('add subject request received');
  try {
    const subject = new Subject(req.body);
    await subject.save();
    res.status(201).json(subject);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Assign USN to student
router.patch('/assign-usn/:userId', auth, checkRole(['admin']), async (req, res) => {
  try {
    const { usn } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { usn },
      { new: true }
    );
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add grades
router.post('/grades', auth, checkRole(['admin']), async (req, res) => {
  try {
    const { studentId, subjectId, grade, semester } = req.body;
    
    const student = await User.findById(studentId);
    const existingGradeIndex = student.grades.findIndex(
      g => g.subject.toString() === subjectId && g.semester === semester
    );

    if (existingGradeIndex > -1) {
      student.grades[existingGradeIndex].grade = grade;
      student.grades[existingGradeIndex].attempts += 1;
    } else {
      student.grades.push({ subject: subjectId, grade, semester, attempts: 1 });
    }

    await student.save();
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;