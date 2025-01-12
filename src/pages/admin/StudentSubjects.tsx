import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { student, admin } from "../../services/api";

interface Subject {
  code: string;
  name: string;
  credits: number;
  semester: number;
  department: string;
  grade?: string; // Optional field for grade
}

const GRADE_OPTIONS = ["O", "A+", "A", "B+", "B", "C", "P", "F", "W"];

const StudentSubjects = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [grade, setGrade] = useState('');

  const fetchSubjects = async () => {
    setLoading(true);
    setError(null);
  
    try {
      // Fetch the registered subject IDs
      const response = await student.registeredsubjects(studentId);
      const subjectIds = response.data.map((item) => item.subject);
      const gradesArray = response.data.map((item) => item.grade); // Directly use this variable
  
      // Fetch the full details for each subject ID
      const subjectDetails = await Promise.all(
        subjectIds.map(async (subjectId: string, index: number) => {
          try {
            const subjectResponse = await student.getSubjectWithId(subjectId);
            return {
              ...subjectResponse.data,
              grade: gradesArray[index], // Use gradesArray here
            };
          } catch (err) {
            console.error(`Error fetching subject with ID ${subjectId}:`, err);
            return null;
          }
        })
      );
  
      const validSubjects = subjectDetails.filter((subject) => subject !== null) as Subject[];
      setSubjects(validSubjects); // Update state with valid subjects
    } catch (err) {
      console.error("Error fetching registered subjects:", err);
      setError("Failed to fetch registered subjects. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, [studentId]);

  const handleGradeChange = (index: number, gradePoint: string) => {
    setGrade(gradePoint);
  };

  const handleSubmit = async (subjectId) => {
    try {
      await admin.addGrades(studentId, subjectId, grade);
      alert("Grades updated successfully");
    } catch (error) {
      console.error("Failed to update grades", error);
      alert("Failed to update grades");
    }
  };

  return (
    <div className="bg-gray-800 text-white min-h-screen py-6 px-4">
      <h1 className="text-3xl font-semibold text-center mb-6">
        Registered Subjects
      </h1>

      {loading && <p className="text-center">Loading subjects...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && subjects.length === 0 && (
        <p className="text-center">No subjects found.</p>
      )}

      {!loading && !error && subjects.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse bg-gray-700 rounded-lg shadow-lg">
            <thead className="bg-gray-900">
              <tr>
                <th className="p-3 border border-gray-600">Subject Name</th>
                <th className="p-3 border border-gray-600">Semester</th>
                <th className="p-3 border border-gray-600">Credits</th>
                <th className="p-3 border border-gray-600">Department</th>
                <th className="p-3 border border-gray-600">Current Grade</th>
                <th className="p-3 border border-gray-600">New Grade</th>
                <th className="p-3 border border-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((subject, index) => (
                <tr key={subject.code} className="hover:bg-gray-600">
                  <td className="p-3 border border-gray-600">{subject.name}</td>
                  <td className="p-3 border border-gray-600">{subject.semester}</td>
                  <td className="p-3 border border-gray-600">{subject.credits}</td>
                  <td className="p-3 border border-gray-600">{subject.department}</td>
                  <td className="p-3 border border-gray-600">{subject.grade}</td>
                  <td className="p-3 border border-gray-600">
                    <select
                      value={grade[index] || ""}
                      onChange={(e) => handleGradeChange(index, e.target.value)}
                      className="bg-gray-800 text-white p-2 rounded border border-gray-600"
                    >
                      <option value="">Select Grade</option>
                      {GRADE_OPTIONS.map((grade) => (
                        <option key={grade} value={grade}>
                          {grade}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-3 border border-gray-600">
                    <button
                      onClick={() => handleSubmit(subject._id)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                    >
                      Submit Grade
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StudentSubjects;
