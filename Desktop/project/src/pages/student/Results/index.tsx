import React, { useEffect, useState } from 'react';
import { student } from '../../../services/api';
import ResultCard from './ResultCard';
import { AlertCircle } from 'lucide-react';

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

const Results = () => {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await student.getProfile();
        setGrades(response.data.grades);
      } catch (error) {
        setError('Failed to load results');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  if (loading) return <div>Loading...</div>;

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-md flex items-center">
        <AlertCircle className="h-5 w-5 mr-2" />
        {error}
      </div>
    );
  }

  // Group grades by semester
  const gradesBySemester = grades.reduce((acc, grade) => {
    const sem = grade.semester;
    if (!acc[sem]) acc[sem] = [];
    acc[sem].push(grade);
    return acc;
  }, {} as Record<number, Grade[]>);

  return (
    <div className="space-y-6">
      {Object.entries(gradesBySemester).map(([semester, semesterGrades]) => (
        <ResultCard
          key={semester}
          semester={parseInt(semester)}
          grades={semesterGrades}
        />
      ))}
    </div>
  );
};

export default Results;