import React from 'react';
import { student } from '../../../services/api';
import { Download } from 'lucide-react';

interface Subject {
  _id: string;
  code: string;
  name: string;
  credits: number;
}

interface Grade {
  subject: Subject;
  grade: string;
  semester: number;
  attempts: number;
}

interface Props {
  semester: number;
  grades: Grade[];
}

const ResultCard = ({ semester, grades }: Props) => {
  const handleChallengeValuation = async (subjectId: string) => {
    try {
      await student.applyChallengeValuation(subjectId);
      // Show success message or update UI
    } catch (error) {
      // Handle error
    }
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6 border-b">
        <h3 className="text-lg font-medium text-gray-900">
          Semester {semester} Results
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Subject Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Subject Name
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Credits
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Grade
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Attempts
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {grades.map((grade) => (
              <tr key={grade.subject._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {grade.subject.code}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {grade.subject.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                  {grade.subject.credits}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className={`px-2 py-1 text-sm font-semibold rounded-full ${
                    grade.grade === 'F' || grade.grade === 'W'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {grade.grade}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                  {grade.attempts}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                  <button
                    onClick={() => handleChallengeValuation(grade.subject._id)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    Challenge Valuation
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
        <button
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Download className="h-4 w-4 mr-2" />
          Download Results
        </button>
      </div>
    </div>
  );
};

export default ResultCard;