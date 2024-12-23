import React, { useEffect, useState } from 'react';
import { student } from '../../services/api';
import { BookOpen } from 'lucide-react';

interface Subject {
  _id: string;
  code: string;
  name: string;
  credits: number;
}

interface Grade {
  subject: Subject;
  grade: string;
  points: number;
}

interface SemesterResult {
  grades: Grade[];
  sgpa: number;
  totalCredits: number;
}

interface Results {
  semesterResults: { [key: string]: SemesterResult };
  cgpa: number;
}

const Semester = () => {
  const [results, setResults] = useState<Results | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await student.getResults();
        setResults(response.data);
      } catch (error) {
        console.error('Error fetching results:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  if (loading) {
    return <div className="flex justify-center">Loading...</div>;
  }

  if (!results) {
    return <div>No results found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Academic Performance</h2>
          <div className="text-lg font-semibold text-indigo-600">
            CGPA: {results.cgpa.toFixed(2)}
          </div>
        </div>

        {Object.entries(results.semesterResults).map(([semester, result]) => (
          <SemesterCard
            key={semester}
            semester={parseInt(semester)}
            result={result}
          />
        ))}
      </div>
    </div>
  );
};

const SemesterCard = ({ 
  semester, 
  result 
}: { 
  semester: number; 
  result: SemesterResult 
}) => (
  <div className="border rounded-lg p-4 mb-4">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-2">
        <BookOpen className="h-5 w-5 text-indigo-600" />
        <h3 className="text-lg font-semibold">Semester {semester}</h3>
      </div>
      <div className="text-indigo-600 font-semibold">
        SGPA: {result.sgpa.toFixed(2)}
      </div>
    </div>

    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left">Code</th>
            <th className="px-4 py-2 text-left">Subject</th>
            <th className="px-4 py-2 text-center">Credits</th>
            <th className="px-4 py-2 text-center">Grade</th>
            <th className="px-4 py-2 text-center">Points</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {result.grades.map((grade) => (
            <tr key={grade.subject._id}>
              <td className="px-4 py-2">{grade.subject.code}</td>
              <td className="px-4 py-2">{grade.subject.name}</td>
              <td className="px-4 py-2 text-center">{grade.subject.credits}</td>
              <td className="px-4 py-2 text-center font-semibold">{grade.grade}</td>
              <td className="px-4 py-2 text-center">{grade.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default Semester;