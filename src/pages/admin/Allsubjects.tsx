import { useEffect, useState } from "react";
import { admin } from "../../services/api";

export default function Allsubjects() {
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    async function fetchSubjects() {
      const response = await admin.allSubjects();
      setSubjects(response.data);
    }

    fetchSubjects();
  }, []);

  async function DeleteSubject(subjectId: any, name: String) {
    alert("subject id is " + subjectId);
    let res = confirm("Are you sure to delete the subject " + name);
    if (!res) return;
    try {
      const response = await admin.DeleteSubject(subjectId);
      alert("subject deleted successfully");
    } catch (err) {
      alert("error while deleting subject");
    }
  }

  // async function EditSubject(subjectId:any){
  //     alert('subject id is '+subjectId);
  //     let res=confirm('Are you sure to delete the subject '+name);

  // }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">All Subjects</h1>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-gray-800 rounded-lg shadow-lg">
          <thead>
            <tr className="bg-gray-700 text-left text-sm font-semibold">
              <th className="p-3 border-b border-gray-600">Subject Name</th>
              <th className="p-3 border-b border-gray-600">Semester</th>
              <th className="p-3 border-b border-gray-600">Credits</th>
              <th className="p-3 border-b border-gray-600">Department</th>
              <th className="p-3 border-b border-gray-600">Registration</th>
              <th className="p-3 border-b border-gray-600">
                Re-Registration (F)
              </th>
              <th className="p-3 border-b border-gray-600">
                Re-Registration (W)
              </th>
              <th className="p-3 border-b border-gray-600">
                Challenge Valuation
              </th>
              <th className="p-3 border-b border-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((subject, index) => (
              <tr
                key={subject._id}
                className="even:bg-gray-700 odd:bg-gray-800 hover:bg-gray-600"
              >
                <td className="p-3 border-b border-gray-700">{subject.name}</td>
                <td className="p-3 border-b border-gray-700">
                  {subject.semester}
                </td>
                <td className="p-3 border-b border-gray-700">
                  {subject.credits}
                </td>
                <td className="p-3 border-b border-gray-700">
                  {subject.department}
                </td>
                <td className="p-3 border-b border-gray-700">
                  {subject.fees.registration}
                </td>
                <td className="p-3 border-b border-gray-700">
                  {subject.fees.reRegistrationF}
                </td>
                <td className="p-3 border-b border-gray-700">
                  {subject.fees.reRegistrationW}
                </td>
                <td className="p-3 border-b border-gray-700">
                  {subject.fees.challengeValuation}
                </td>
                <td className="p-3 border-b border-gray-700">
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded shadow-lg focus:outline-none focus:ring-2 focus:ring-red-400"
                    onClick={() => DeleteSubject(subject._id, subject.name)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
