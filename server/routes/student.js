import express from "express";
import { auth, checkRole } from "../middleware/auth.js";
import User from "../models/User.js";
import Subject from "../models/Subject.js";
import ChallengeValuation from "../models/ChallengeValuation.js";
import Payment from "../models/Payment.js";
import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Faculty from "../models/Faculty.js";
dotenv.config();
const router = express.Router();

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
});

router.get("/profile", auth, checkRole(["student"]), async (req, res) => {
  try {
    const student = await User.findById(req.user.userId)
      .select("-password")
      .populate("registeredSubjects");
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/allstudents", async (req, res) => {
  const students = await User.find({});
  return res.status(200).json({ students });
});

router.delete("/deleteStudents", async (req, res) => {
  try {
    const studentId = req.body.studentId;
    await User.findByIdAndDelete(studentId);
    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.put("/addgrade", async (req, res) => {
  const { studentId, grades } = req.body;

  try {
    if (!studentId || !grades || !Array.isArray(grades)) {
      return res.status(400).json({ message: "Invalid input data" });
    }

    // Find the student by ID
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Update grades for the registered subjects
    grades.forEach(({ subjectCode, grade }) => {
      const existingGrade = student.grades.find(
        (g) => g.subjectCode === subjectCode
      );
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

    return res
      .status(200)
      .json({ message: "Grades updated successfully", student });
  } catch (error) {
    console.error("Error updating grades:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/allsubjects", async (req, res) => {
  const subjects = await Subject.find({});
  return res.status(200).json({ subjects });
});

router.get("/subjects/:semester", async (req, res) => {
  const semester = req.params.semester;
  const subjects = await Subject.find({ semester });
  return res.status(200).json({ subjects });
});

router.get("/subject/:subjectId", async (req, res) => {
  const subjectId = req.params.subjectId;
  try {
    const subject = await Subject.findOne({ _id: subjectId });

    if (subject) {
      return res.status(200).json(subject);
    } else {
      return res.status(404).json({ msg: "No subject found with this ID" });
    }
  } catch (error) {
    console.error(error); // Log the error for debugging
    return res.status(500).json({ msg: "Internal server error", error });
  }
});

router.get("/registeredsubjects", async (req, res) => {
  const userId = req.query.userId;
  console.log("userId from backend " + userId);

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const response = await User.findOne({ _id: userId });
    if (!response) {
      return res.status(404).json({ error: "User not found" });
    }

    const subjects = response.registeredSubjects || [];
    return res.status(200).json(subjects);
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
  const { semester, price } = req.body;

  try {
    // Fetch all subjects for the semester
    const subjects = await Subject.find({ semester });
    if (!subjects.length) {
      return res
        .status(404)
        .json({ success: false, msg: "No subjects found for registration" });
    }

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
    return res
      .status(500)
      .json({ success: false, msg: "Internal Server Error" });
  }
});

router.post("/verifypayment", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
      semester,
    } = req.body;

    // Verify Razorpay signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res
        .status(400)
        .json({ success: false, msg: "Payment verification failed" });
    }

    // Fetch all subjects for registration
    const subjects = await Subject.find({ semester });
    if (!subjects.length) {
      return res
        .status(404)
        .json({ success: false, msg: "No subjects found for registration" });
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
      flag: false,
      semester: semester,
      registerType: "Regular",
    }));

    // Add the registered subjects to the user's registeredSubjects array
    user.registeredSubjects.push(...registeredSubjectsToAdd);

    // Log the payment
    user.payments.push({
      amount: 1500, // Adjust the amount as necessary
      type: `Semester ${semester} Registration fees`,
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
    return res
      .status(500)
      .json({ success: false, msg: "Internal Server Error" });
  }
});

router.post("/challenge-valuation", auth, checkRole(["student"]), async (req, res) => {
    try {
      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        userId,
        subjectId,
        userSem,
        price,
      } = req.body;

      // Verify Razorpay signature
      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

      if (expectedSignature !== razorpay_signature) {
        return res
          .status(400)
          .json({ success: false, msg: "Payment verification failed" });
      }

      if (
        !mongoose.Types.ObjectId.isValid(userId) ||
        !mongoose.Types.ObjectId.isValid(subjectId)
      ) {
        return res.status(400).json({ error: "Invalid userId or subjectId" });
      }

      if (!userSem || isNaN(userSem)) {
        return res.status(400).json({ error: "Invalid or missing userSem" });
      }

      // Find the user by ID
      const student = await User.findById(userId).populate(
        "registeredSubjects.subject"
      );

      if (!student) {
        return res.status(404).json({ error: "User not found" });
      }

      // Filter registered subjects based on criteria
      const matchingSubjects = student.registeredSubjects.filter(
        (regSub) =>
          regSub.semester === parseInt(userSem, 10) &&
          regSub.subject._id.toString() === subjectId
      );

      if (matchingSubjects.length === 0) {
        return res.status(404).json({ message: "No matching subjects found" });
      }

      // Extract the first matching subject
      const { subject, registerType } = matchingSubjects[0];

      // Create a new ChallengeValuation document
      const challengeValuation = new ChallengeValuation({
        USN: student.USN, // Replace with the actual field for USN in your User schema
        Name: student.name, // Replace with the actual field for Name in your User schema
        SubjectCode: subject.code,
        SubjectName: subject.name,
        Semester: subject.semester,
        Type: registerType,
        Status: "Pending", // Default status
      });

      // Save the ChallengeValuation document
      await challengeValuation.save();

      // Log the payment
      student.payments.push({
        amount: price, // Adjust the amount as necessary
        type: "ChallengeValuation",
        status: "completed",
        razorpay_order_id,
        razorpay_payment_id,
        subject: {
          name: subject.name,
          code: subject.code,
        },
      });

      // Save the user
      await student.save();

      // Send response
      return res.status(200).json({
        success: true,
        msg: "Payment verified and Challenge Valuation request saved successfully",
        transactionId: razorpay_payment_id, // Send transaction ID back to the frontend
      });
    } catch (error) {
      console.error("Error in payment verification:", error);
      return res
        .status(500)
        .json({ success: false, msg: "Internal Server Error" });
    }
  }
);

router.get("/payments/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select("payments");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json(user.payments);
  } catch (error) {
    console.error("Error fetching payment history:", error);
    res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
});

router.get("/payments", auth, checkRole(["student"]), async (req, res) => {
  try {
    const payments = await Payment.find({ student: req.user.userId })
      .populate("subject")
      .sort("-createdAt");
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/results", auth, checkRole(["student"]), async (req, res) => {
  try {
    const student = await User.findById(req.user.userId).populate(
      "grades.subject"
    );

    // Calculate SGPA and CGPA
    const results = calculateGrades(student.grades);
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// router.get("/results", auth, checkRole(["student"]), async (req, res) =>

router.get("/subject/rrSubject/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const { department, currentSemester, registeredSubjects } = user;

    const { subjects, gradeArr } = registeredSubjects.reduce(
      (acc, item) => {
        if (item.flag && currentSemester === item.semester && (item.grade === "F" || item.grade === "W")) {
          acc.subjects.push(item.subject);
          acc.gradeArr.push(item.grade);
        }
        return acc;
      },
      { subjects: [], gradeArr: [] }
    );

    return res.status(200).json({
      success: true,
      message: "Subjects retrieved successfully",
      data: subjects,
      grades: gradeArr,
      department: department
    });
  } catch (error) {
    console.error("Error fetching rrSubject", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

router.post("/order", async (req, res) => {
  const { price } = req.body;

  try {
    // Validate price (e.g., fetch from DB based on subject details)
    if (!price || price <= 0) {
      return res.status(400).json({ success: false, msg: "Invalid price." });
    }

    const options = {
      amount: price * 100, // Amount in paise
      currency: "INR",
    };

    const order = await instance.orders.create(options);
    return res.status(200).json({
      success: true,
      price,
      order,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return res
      .status(500)
      .json({ success: false, msg: "Internal Server Error" });
  }
});

router.post("/rrSubjectpayment", async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
      semester,
      subjectId,
      type,
      facultyId,
    } = req.body;
    

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      await session.abortTransaction();
      return res
        .status(400)
        .json({ success: false, msg: "Payment verification failed" });
    }

    const user = await User.findById(userId).session(session);
    if (!user) throw new Error("User not found.");

    const subject = await Subject.findById(subjectId).session(session);
    if (!subject) throw new Error("Subject not found.");

    const registeredSubject = {
      subject: subjectId,
      grade: "-",
      flag: false,
      semester,
      registerType: type,
    };

    user.registeredSubjects.push(registeredSubject);
    user.payments.push({
      amount: subject.fees[type === "Reregister - W" ? "reRegistrationW" : "reRegistrationF"],
      type,
      status: "completed",
      razorpay_order_id,
      razorpay_payment_id,
      subject:{
        name: subject.name,
        code: subject.code
      }
    });

    if(facultyId){
      const faculty = await Faculty.findById(facultyId).session(session);
      if (!faculty) throw new Error("Faculty not found.");

      const student = {
        usn: user.USN,
        name: user.name,
        semester,
        subCode: subject.code,
        subName: subject.name,
      };

      faculty.students.push(student);

      await faculty.save({ session });

    }

    await user.save({ session });

    await session.commitTransaction();
    return res.status(200).json({
      success: true,
      msg: "Payment verified and subjects registered successfully",
    });
  } catch (error) {
    await session.abortTransaction();
    console.error("Error in payment verification:", error);
    return res
      .status(500)
      .json({ success: false, msg: "Internal Server Error" });
  } finally {
    session.endSession();
  }
});



export default router;

// router.post('/challenge-valuation', auth, checkRole(['student']), async (req, res) => {
//   try {
//     const { subjectId } = req.body;
//     const subject = await Subject.findById(subjectId);

//     const payment = new Payment({
//       student: req.user.userId,
//       subject: subjectId,
//       amount: subject.fees.challengeValuation,
//       type: 'ChallengeValuation',
//       semester: subject.semester,
//       status: 'pending'
//     });
//     await payment.save();

//     res.json({ message: 'Challenge valuation applied', payment });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });
