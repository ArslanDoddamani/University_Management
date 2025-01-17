import mongoose from "mongoose";

const reRegisteredStudnetsSchema = new mongoose.Schema({
  usn:{
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  semester: {
    type: Number,
    required: true,
  },
  subCode: {
    type: String,
    required: true,
  },
  subName:{
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: [
      "Pending",
      "Passed",
      "Failed",
    ],
    default: "Pending",
  }
},{ _id: false });

const FacultySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["student", "admin", "faculty"],
    default: "faculty",
  },
  students: [reRegisteredStudnetsSchema]
});

export default mongoose.model("Faculty", FacultySchema);
