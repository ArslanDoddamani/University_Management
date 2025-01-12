import express from 'express';
import { auth, checkRole } from '../middleware/auth.js';
import User from '../models/User.js';
import Subject from '../models/Subject.js';
import Payment from '../models/Payment.js';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();
const router = express.Router();

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
});


// Get student profile
router.get('/profile', auth, checkRole(['student']), async (req, res) => {
  try {
    const student = await User.findById(req.user.userId)
      .select('-password')
      .populate('registeredSubjects');
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

//fetch all students
router.get('/allstudents',async(req,res)=>{
  const students=await User.find({});
  return res.status(200).json({students})
})

router.delete('/deleteStudents',async(req,res)=>{
  try {
    const studentId = req.body.studentId;
    await User.findByIdAndDelete(studentId);
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
})


router.put('/addgrade', async (req, res) => {
  const { studentId, grades } = req.body;

  try {
    if (!studentId || !grades || !Array.isArray(grades)) {
      return res.status(400).json({ message: 'Invalid input data' });
    }

    // Find the student by ID
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Update grades for the registered subjects
    grades.forEach(({ subjectCode, grade }) => {
      const existingGrade = student.grades.find((g) => g.subjectCode === subjectCode);
      if (existingGrade) {
        // Update existing grade
        existingGrade.grade = grade;
      } else {
        // Add new grade
        student.grades.push({ subjectCode, grade });
      }
    });

    // Save updated student
    await student.save();

    return res.status(200).json({ message: 'Grades updated successfully', student });
  } catch (error) {
    console.error('Error updating grades:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

//fetch all Subjects
router.get('/allsubjects',async(req,res)=>{
  const subjects=await Subject.find({});
  return res.status(200).json({subjects})
})

router.get('/subject/:subjectId', async (req, res) => {
  const subjectId = req.params.subjectId;
  try {
    const subject = await Subject.findOne({ _id: subjectId }); 

    if (subject) {
      return res.status(200).json(subject);
    } else {
      return res.status(404).json({ msg: 'No subject found with this ID' });
    }
  } catch (error) {
    console.error(error); // Log the error for debugging
    return res.status(500).json({ msg: 'Internal server error', error });
  }
});


router.get('/registeredsubjects', async (req, res) => {
  const userId = req.query.userId; 
   console.log("userId from backend " + userId);

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const response = await User.findOne({ _id:userId });
    if (!response) {
      return res.status(404).json({ error: "User not found" });
    }

    const subjects = response.registeredSubjects || [];
    return res.status(200).json( subjects );
  } catch (error) {
    console.error("Error fetching registered subjects:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});


router.get("/getApiKey", (req, res) => {
  const key = process.env.RAZORPAY_API_KEY;
  res.status(200).json({ key });
});


router.post("/purchase", async (req, res) => {
  const { userId } = req.body;
  try {
    // Fetch all subjects for the semester
    const subjects = await Subject.find({});
    if (!subjects.length) {
      return res.status(404).json({ success: false, msg: "No subjects found for registration" });
    }

    const price = 1500; // Fixed price for all subjects in a semester

    // Razorpay order options
    const options = {
      amount: price * 100, // Amount in paise
      currency: "INR",
    };

    // Create Razorpay order
    const order = await instance.orders.create(options);
    return res.status(200).json({
      success: true,
      price,
      order, // Send order details to the frontend
    });
  } catch (error) {
    console.error("Error in purchase route:", error);
    return res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
});

// Payment verification route
router.post("/verifypayment", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId } = req.body;

    // Verify Razorpay signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, msg: "Payment verification failed" });
    }

    // Fetch all subjects for registration
    const subjects = await Subject.find({});
    if (!subjects.length) {
      return res.status(404).json({ success: false, msg: "No subjects found for registration" });
    }

    // Fetch the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }

    // Prepare subjects to be added with default grades
    const registeredSubjectsToAdd = subjects.map((subject) => ({
      subject: subject._id,
      grade: "-", // Default grade
    }));

    // Add the registered subjects to the user's registeredSubjects array
    user.registeredSubjects.push(...registeredSubjectsToAdd);

    // Log the payment
    user.payments.push({
      amount: 1500, // Adjust the amount as necessary
      type: "Registration fees",
      status: "completed",
      razorpay_order_id,
      razorpay_payment_id,
    });

    // Save the user
    await user.save();

    // Send response
    return res.status(200).json({
      success: true,
      msg: "Payment verified and subjects registered successfully",
      transactionId: razorpay_payment_id, // Send transaction ID back to the frontend
    });
  } catch (error) {
    console.error("Error in payment verification:", error);
    return res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
});

// Route to fetch payment history
router.get('/payments/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select('payments');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.status(200).json(user.payments);
  } catch (error) {
    console.error('Error fetching payment history:', error);
    res.status(500).json({ success: false, msg: 'Internal Server Error' });
  }
});





router.post('/challenge-valuation', auth, checkRole(['student']), async (req, res) => {
  try {
    const { subjectId } = req.body;
    const subject = await Subject.findById(subjectId);
    
    const payment = new Payment({
      student: req.user.userId,
      subject: subjectId,
      amount: subject.fees.challengeValuation,
      type: 'ChallengeValuation',
      semester: subject.semester,
      status: 'pending'
    });
    await payment.save();

    res.json({ message: 'Challenge valuation applied', payment });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get payment history
router.get('/payments', auth, checkRole(['student']), async (req, res) => {
  try {
    const payments = await Payment.find({ student: req.user.userId })
      .populate('subject')
      .sort('-createdAt');
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get semester results
router.get('/results', auth, checkRole(['student']), async (req, res) => {
  try {
    const student = await User.findById(req.user.userId)
      .populate('grades.subject');
    
    // Calculate SGPA and CGPA
    const results = calculateGrades(student.grades);
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;