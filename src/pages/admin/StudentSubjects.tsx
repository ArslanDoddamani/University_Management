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
  const { studentId } = useParams<{ studentId: string }>();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubjects = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch the registered subject IDs
        const response = await student.registeredsubjects(studentId);
        const subjectIds = response.data.subjects;

        // Fetch the full details for each subject ID
        const subjectDetails = await Promise.all(
          subjectIds.map(async (subjectId: string) => {
            try {
              const subjectResponse = await student.getSubjectWithId(subjectId);
              console.log(subjectResponse.data)
              return subjectResponse.data; // Extract the `data` field
            } catch (err) {
              console.error(`Error fetching subject with ID ${subjectId}:`, err);
              return null;
            }
          })
        );

        // Filter out any null values in case of fetch failures
        setSubjects(subjectDetails.filter((subject) => subject !== null) as Subject[]);
      } catch (err) {
        console.error("Error fetching registered subjects:", err);
        setError("Failed to fetch registered subjects. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, [studentId]);

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
      )}
    </div>
  );
};

export default StudentSubjects;
