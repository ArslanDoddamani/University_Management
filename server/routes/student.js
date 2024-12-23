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
  console.log(students);
  return res.status(200).json({students})

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
  console.log(subjects);
  return res.status(200).json({subjects})
})

router.get("/getApiKey", (req, res) => {
  const key = process.env.RAZORPAY_API_KEY;
  res.status(200).json({ key });
});

router.post("/purchase", async (req, res) => {
  const SubjectId = req.body.SubjectId;
  const userId = req.body.userId;
  console.log("User ID is: " + userId);
  console.log("Subject ID is: " +SubjectId);

  try {
      const subject = await Subject.findById(SubjectId);
      if (!subject) {
          return res.status(404).json({ msg: "Subject not found" });
      }

      const price = subject.price;
      console.log("Subject price: " + price);

      // Razorpay order options
      const options = {
          amount: Number(price * 100) || Number(1500*100), // amount in the smallest currency unit (paise)
          currency: "INR",
      };

      // Create the order in Razorpay
      const order = await instance.orders.create(options);
      console.log("Created order: ", order);

      return res.status(200).json({
          price,
          success: true,
          order, // send order info to the frontend
      });
  } catch (error) {
      console.error("Error in purchase route:", error);
      return res.status(500).json({ msg: "inside catch"+error });
  }
});


router.post("/verifypayment", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      SubjectId,
      userId,
    } = req.body;

    console.log("Verification initiated...");
    console.log("Razorpay Order ID:", razorpay_order_id);
    console.log("Razorpay Payment ID:", razorpay_payment_id);
    console.log("Provided Signature:", razorpay_signature);
    console.log("Subject ID:", SubjectId);
    console.log("User ID:", userId);

    // Step 1: Verify the payment signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    console.log("Expected Signature:", expectedSignature);

    if (expectedSignature !== razorpay_signature) {
      console.error("Signature mismatch! Payment verification failed.");
      return res
        .status(400)
        .json({ success: false, msg: "Payment verification failed" });
    }

    console.log("Payment signature verified.");

    // Step 2: Find the user in the database
    const user = await User.findById(userId);
    if (!user) {
      console.error("User not found!");
      return res.status(404).json({ msg: "User not found" });
    }

    console.log("User found:", user.name);

    // Step 3: Add the subject to the user's registeredSubjects if not already added
    if (!user.registeredSubjects.includes(SubjectId)) {
      user.registeredSubjects.push(SubjectId);
      await user.save();
      console.log(`Subject ${SubjectId} added to user ${userId}.`);
    } else {
      console.log(`Subject ${SubjectId} already registered for user ${userId}.`);
    }

    // Step 4: Send success response
    return res
      .status(200)
      .json({ success: true, msg: "Payment verified and subject added" });
  } catch (error) {
    console.error("Error in payment verification:", error);
    return res.status(500).json({ success: false, msg: "Internal Server Error" });
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