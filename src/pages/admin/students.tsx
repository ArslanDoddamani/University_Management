import { useState, useEffect } from 'react';
import { student } from '../../services/api';

interface Subject {
  code: string;
  name: string;
  credits: number;
}

interface Grade {
  subjectCode: string;
  grade: string;
}

interface Student {
  _id: string;
  usn: string;
  name: string;
  department: string;
  dateOfBirth: number;
  email: string;
  password?: string;
  phone: string;
  currentSemester: number;
  registeredSubjects: Subject[];
  grades: Grade[];
}

const Students = () => {
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await student.getStudents();
        setStudents(response.data.students); // Assuming response.data contains students
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchStudents();
  }, []);

  const handleAssignGrades = async (studentId: string, grades: Grade[]) => {
    try {
      const res = await student.addGrades(studentId, grades); // Assuming an endpoint for adding grades
      if (res.status === 200) {
        alert('Grades added successfully');
      } else {
        alert('Failed to add grades');
      }
    } catch (error) {
      console.error('Error assigning grades:', error);
      alert('An error occurred while assigning grades');
    }
  };

  const handleGradeChange = (
    studentId: string,
    subjectCode: string,
    grade: string,
    updatedStudents: Student[]
  ) => {
    setStudents(updatedStudents);

    // Prepare grades for the student
    const student = updatedStudents.find((s) => s._id === studentId);
    const grades = student?.registeredSubjects.map((subject) => ({
      subjectCode: subject.code,
      grade: student.grades.find((g) => g.subjectCode === subject.code)?.grade || '',
    }));

    // Sync with the database
    if (grades) handleAssignGrades(studentId, grades);
  };

  return (
    <div className="bg-gray-800 text-white min-h-screen py-6 px-4">
      <h1 className="text-3xl font-semibold text-center mb-6">Student Details</h1>
      {students.length === 0 ? (
        <p className="text-center text-gray-400">Students will load here...</p>
      ) : (
        <div className="space-y-6">
          {students.map((student) => (
            <div className="bg-gray-700 p-6 rounded-lg shadow-lg" key={student._id}>
              <h2 className="text-2xl font-semibold mb-2">{student.name}</h2>
              <p className="text-gray-400">University Roll No: {student.usn || 'Not assigned'}</p>
              <p className="text-gray-400">Department: {student.department}</p>
              <p className="text-gray-400">Date of Birth: {new Date(student.dateOfBirth).toLocaleDateString()}</p>
              <p className="text-gray-400">Email: {student.email}</p>
              <p className="text-gray-400">Phone: {student.phone}</p>
              <p className="text-gray-400">Current Semester: {student.currentSemester}</p>
              
              <div className="mt-4">
                <p className="text-lg font-semibold text-gray-200">Registered Subjects:</p>
                <ul className="space-y-4">
                  {student.registeredSubjects.length === 0 ? (
                    <li>No subjects registered</li>
                  ) : (
                    student.registeredSubjects.map((subject) => (
                      <li key={subject.code} className="bg-gray-600 p-4 rounded-lg">
                        <p className="text-lg font-semibold">{subject.name} (Code: {subject.code}, Credits: {subject.credits})</p>
                        <div className="flex items-center space-x-4">
                          <label htmlFor={`grade-${student._id}-${subject.code}`} className="text-gray-300">Grade:</label>
                          <input
                            id={`grade-${student._id}-${subject.code}`}
                            type="text"
                            className="bg-gray-500 text-white rounded-md p-2 w-24"
                            value={
                              student.grades.find((g) => g.subjectCode === subject.code)?.grade || ''
                            }
                            onChange={(e) => {
                              const updatedStudents = students.map((s) => {
                                if (s._id === student._id) {
                                  const updatedGrades = s.grades.map((g) =>
                                    g.subjectCode === subject.code
                                      ? { ...g, grade: e.target.value }
                                      : g
                                  );
                                  const newGrade = {
                                    subjectCode: subject.code,
                                    grade: e.target.value,
                                  };
                                  const isGradeNew = !updatedGrades.find(
                                    (g) => g.subjectCode === subject.code
                                  );

                                  return {
                                    ...s,
                                    grades: isGradeNew
                                      ? [...updatedGrades, newGrade]
                                      : updatedGrades,
                                  };
                                }
                                return s;
                              });
                              handleGradeChange(
                                student._id,
                                subject.code,
                                e.target.value,
                                updatedStudents
                              );
                            }}
                          />
                        </div>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Students;
