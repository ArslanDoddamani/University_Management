import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { student } from "../../services/api";

interface Subject {
  code: string;
  name: string;
  credits: number;
  semester: number;
  department: string;
}

const StudentSubjects = () => {
  const { studentId } = useParams();
  const [subjects, setSubjects] = useState<Subject[]>([]);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await student.registeredsubjects(studentId); // Assuming an endpoint for fetching subjects
        setSubjects(response.data.subjects);
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    };

    fetchSubjects();
  }, [studentId]);

  return (
    <div className="bg-gray-800 text-white min-h-screen py-6 px-4">
      <h1 className="text-3xl font-semibold text-center mb-6">
        Registered Subjects
      </h1>
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse bg-gray-700 rounded-lg shadow-lg">
          <thead className="bg-gray-900">
            <tr>
              <th className="p-3 border border-gray-600">Subject Name</th>
              <th className="p-3 border border-gray-600">Semester</th>
              <th className="p-3 border border-gray-600">Credits</th>
              <th className="p-3 border border-gray-600">Department</th>
              <th className="p-3 border border-gray-600">Current Grade</th>
              <th className="p-3 border border-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((subject) => (
              <tr key={subject.code} className="hover:bg-gray-600">
                <td className="p-3 border border-gray-600">{subject.name}</td>
                <td className="p-3 border border-gray-600">{subject.semester}</td>
                <td className="p-3 border border-gray-600">{subject.credits}</td>
                <td className="p-3 border border-gray-600">{subject.department}</td>
                <td className="p-3 border border-gray-600">--</td>
                <td className="p-3 border border-gray-600">
                  <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded">
                    Add/Change Grade
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

export default StudentSubjects;
