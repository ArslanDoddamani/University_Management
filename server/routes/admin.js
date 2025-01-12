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

router.get('/allSubjects',async(req,res)=>{
  try{
    const subjects=await Subject.find({});
    res.json(subjects);
  }
  catch(err){
    res.status(500).json({message:'Server error',error:err.message});
  }
})
router.get('/particularSubject', async (req, res) => {
  try {
    const subjectId = req.query.subjectId; // Use query parameter instead of body
    console.log(subjectId);
    const subject = await Subject.findOne({ _id: subjectId });
    res.status(200).json({ subject });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Assign USN to student
router.patch('/assign-usn/:userId', async (req, res) => {
  try {
    const { USN } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { USN },
      { new: true }
    );
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/subject', async (req, res) => {
  try {
    const subjectId = req.body.subjectId; // Access subjectId from the request body
    console.log('Subject ID:', subjectId);

    await Subject.findByIdAndDelete(subjectId);
    res.json({ message: 'Subject deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add grades
router.patch('/grades', auth, checkRole(['admin']), async (req, res) => {
  try {
    const { studentId, subjectId, grade } = req.body;

    // Fetch the student and populate registeredSubjects
    const student = await User.findById(studentId).populate('registeredSubjects.subject');

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Find the registered subject by subjectId and update the grade
    const registeredSubject = student.registeredSubjects.find(
      (sub) => sub.subject._id.toString() === subjectId
    );

    if (!registeredSubject) {
      return res.status(404).json({ message: 'Subject not found for this student' });
    }

    // Update the grade
    registeredSubject.grade = grade;

    // Save the updated student
    await student.save();

    res.status(200).json({ message: 'Grade updated successfully', student });
  } catch (error) {
    console.error('Error updating grades:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


export default router;