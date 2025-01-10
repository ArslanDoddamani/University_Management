import React, { useEffect, useState } from 'react';
import { student } from '../../../services/api';
import { AlertCircle } from 'lucide-react';

interface Subject {
  _id: string;
  code: string;
  name: string;
  credits: number;
  semester: number;
  grade: string;
  attempts: number;
  fees: {
    reRegistrationF: number;
    reRegistrationW: number;
  };
}

const ReRegistration = () => {
  const [failedSubjects, setFailedSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchFailedSubjects = async () => {
      try {
        const response = await student.getProfile();
        const failed = response.data.grades.filter(
          (g: any) => g.grade === 'F' || g.grade === 'W'
        );
        setFailedSubjects(failed);
      } catch (error) {
        setError('Failed to load subjects');
      } finally {
        setLoading(false);
      }
    };

    fetchFailedSubjects();
  }, []);

  const handleReRegister = async (subjectId: string) => {
    try {
      await student.registerSubjects([subjectId]);
      setSuccess('Successfully re-registered for the subject');
      setFailedSubjects(failedSubjects.filter(s => s._id !== subjectId));
    } catch (error: any) {
      setError(error.response?.data?.message || 'Re-registration failed');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Re-Registration</h2>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-md">
          {success}
        </div>
      )}

      {failedSubjects.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No subjects available for re-registration
        </div>
      ) : (
        <div className="space-y-4">
          {failedSubjects.map((subject) => (
            <div key={subject._id} className="border rounded-md p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium">{subject.name}</h3>
                  <p className="text-sm text-gray-500">
                    Code: {subject.code} | Credits: {subject.credits}
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-medium text-red-600">
                    Grade: {subject.grade}
                  </div>
                  <div className="text-sm text-gray-500">
                    Attempts: {subject.attempts}
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <button
                  onClick={() => handleReRegister(subject._id)}
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
                >
                  Re-Register (₹
                  {subject.grade === 'F' 
                    ? subject.fees.reRegistrationF * subject.attempts
                    : subject.fees.reRegistrationW
                  })
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReRegistration;