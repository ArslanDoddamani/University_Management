import React, { useState, useEffect } from 'react';
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
  dateOfBirth: number; // Assuming dateOfBirth is stored as a timestamp or a number
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
    <div className="students-container">
      {students.length === 0 ? (
        <p className="loading-message">Students will load here...</p>
      ) : (
        <div className="students-list">
          {students.map((student) => (
            <div className="student-card" key={student._id}>
              <h2 className="student-name">Name: {student.name}</h2>
              <p className="student-usn">University roll no: {student.usn || 'Not assigned'}</p>
              <p className="student-details">Department: {student.department}</p>
              <p className="student-details">Date of Birth: {new Date(student.dateOfBirth).toLocaleDateString()}</p>
              <p className="student-details">Email: {student.email}</p>
              <p className="student-details">Phone: {student.phone}</p>
              <p className="student-details">Current Semester: {student.currentSemester}</p>
              <p className="student-details">Registered Subjects:</p>
              <ul>
                {student.registeredSubjects.length === 0 ? (
                  <li>No subjects registered</li>
                ) : (
                  student.registeredSubjects.map((subject) => (
                    <li key={subject.code}>
                      {subject.name} (Code: {subject.code}, Credits: {subject.credits})
                      <div>
                        <label htmlFor={`grade-${student._id}-${subject.code}`}>Grade: </label>
                        <input
                          id={`grade-${student._id}-${subject.code}`}
                          type="text"
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
              <br />
              <hr />
              <hr />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Students;
