import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { student, admin } from "../../services/api";

interface Subject {
  code: string;
  name: string;
  credits: number;
  semester: number;
  department: string;
}

interface Grade {
  subjectCode: string;
  grade: string;
}

interface Student {
  _id: string;
  USN: number;
  name: string;
  department: string;
  dateOfBirth: number;
  email: string;
  phone: string;
  currentSemester: number;
  registeredSubjects: Subject[];
  grades: Grade[];
}

const Students = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await student.getStudents();
        setStudents(response.data.students); // Assuming response.data contains students
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, []);

  async function AddUsn(userId: string) {
    const usnInput = prompt("Enter the USN");
    const USN = usnInput ? Number(usnInput) : null;

    if (USN === null || isNaN(USN)) {
      alert("Invalid USN. Please enter a valid number.");
      return;
    }

    try {
      const res = await admin.assignUSN(userId, USN);
      if (res.status === 200) {
        alert("USN assigned successfully");
        setStudents((prev) =>
          prev.map((student) =>
            student._id === userId ? { ...student, USN } : student
          )
        );
      } else {
        alert("Error while assigning USN");
      }
    } catch (error) {
      alert("An error occurred: " + error);
    }
  }

  const redirectToSubjects = (studentId: string) => {
    navigate(`/admin/students//${studentId}/subjects`);
  };

  return (
    <div className="bg-gray-800 text-white min-h-screen py-6 px-4">
      <h1 className="text-3xl font-semibold text-center mb-6">Student Details</h1>
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse bg-gray-700 rounded-lg shadow-lg">
          <thead className="bg-gray-900">
            <tr>
              <th className="p-3 border border-gray-600">USN</th>
              <th className="p-3 border border-gray-600">Name</th>
              <th className="p-3 border border-gray-600">Department</th>
              <th className="p-3 border border-gray-600">Date of Birth</th>
              <th className="p-3 border border-gray-600">Email</th>
              <th className="p-3 border border-gray-600">Phone</th>
              <th className="p-3 border border-gray-600">Current Semester</th>
              <th className="p-3 border border-gray-600">Registered Subjects</th>
              <th className="p-3 border border-gray-600">Assign USN</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student._id} className="hover:bg-gray-600">
                <td className="p-3 border border-gray-600">
                  {student.USN || "Not Assigned"}
                </td>
                <td className="p-3 border border-gray-600">{student.name}</td>
                <td className="p-3 border border-gray-600">
                  {student.department}
                </td>
                <td className="p-3 border border-gray-600">
                  {new Date(student.dateOfBirth).toLocaleDateString()}
                </td>
                <td className="p-3 border border-gray-600">{student.email}</td>
                <td className="p-3 border border-gray-600">{student.phone}</td>
                <td className="p-3 border border-gray-600">
                  {student.currentSemester}
                </td>
                <td className="p-3 border border-gray-600">
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                    onClick={() => redirectToSubjects(student._id)}
                  >
                    View Subjects
                  </button>
                </td>
                <td className="p-3 border border-gray-600">
                  <button
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                    onClick={() => AddUsn(student._id)}
                  >
                    Assign USN
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Students;
