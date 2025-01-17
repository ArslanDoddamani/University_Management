import express from 'express';
import { auth, checkRole } from '../middleware/auth.js';
import User from '../models/User.js';
import Subject from '../models/Subject.js';
import Admin from '../models/Admin.js';
import ChallengeValuation from "../models/ChallengeValuation.js";
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

router.delete("/subject", async (req, res) => {
  try {
    const subjectId = req.body.subjectId; // Access subjectId from the request body

    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    // Trigger the pre-hook by calling deleteOne
    await subject.deleteOne();
    res.json({ message: "Subject deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

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

router.patch('/launch-result', auth, checkRole(['admin']), async (req, res) => {
  const { semester, date } = req.body;

  if (!semester || typeof semester !== 'number') {
    return res.status(400).json({ error: 'A valid semester number is required.' });
  }

  try {
    // Find all users whose `currentSemester` matches the provided semester
    const students = await User.find({ currentSemester: semester });

    if (!students || students.length === 0) {
      return res.status(404).json({ message: 'No students found for this semester.' });
    }

    // Update the `flag` field in `registeredSubjects` and increment `currentSemester`
    const updatedStudents = await Promise.all(
      students.map(async (student) => {
        let isUpdated = false;

        student.registeredSubjects.forEach((subject) => {
          if (subject.semester === semester) {
            subject.flag = true; // Set the flag to true if semesters match
            subject.time = date; // Update the time for the subject
            isUpdated = true;
          }
        });

        if (isUpdated) {
          student.currentSemester += 1; // Increment the currentSemester
          await student.save(); // Save the updated student document
        }

        return student; // Return the updated student object
      })
    );

    // Filter and include only students with updated flags in the response
    const successfullyUpdated = updatedStudents.filter((student) =>
      student.registeredSubjects.some((subject) => subject.flag)
    );

    if (successfullyUpdated.length === 0) {
      return res.status(404).json({ message: 'No subjects were updated for this semester.' });
    }

    res.status(200).json({
      message: `Flags updated and currentSemester incremented successfully for semester ${semester}`,
      students: successfullyUpdated,
    });
  } catch (error) {
    console.error('Error updating results:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/challengevaluations', auth, checkRole(['admin']), async (req, res) => {
  try{
    const result=await ChallengeValuation.find({});
    res.json(result);
  }
  catch(err){
    res.status(500).json({message:'Server error',error:err.message});
  }
});

router.patch('/challengevaluations/status', auth, checkRole(['admin']), async (req, res) => {
  const { id, action } = req.body; // Extract id and action from request body

  // Validate action
  if (!id || !action) {
    return res.status(400).json({ message: "ID and action are required." });
  }

  // Validate the action (it must be 'Approved' or 'Rejected')
  if (!["Approved", "Rejected"].includes(action)) {
    return res.status(400).json({ message: "Invalid action. It must be 'Approved' or 'Rejected'." });
  }

  try {
    // Find the ChallengeValuation by ID
    const challengeValuation = await ChallengeValuation.findById(id);

    if (!challengeValuation) {
      return res.status(404).json({ message: "ChallengeValuation not found." });
    }

    // Update the status
    challengeValuation.Status = action;

    // Save the updated document
    await challengeValuation.save();

    // Return a success response
    return res.status(200).json({
      success: true,
      message: `Status successfully updated to ${action}`,
      data: challengeValuation,
    });
  } catch (err) {
    console.error("Error updating status:", err);
    return res.status(500).json({ message: "Internal server error. Please try again." });
  }
});

export default router;