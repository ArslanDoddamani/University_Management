import { useState, useEffect } from 'react';
import { student } from '../../services/api';
import { admin } from '../../services/api';
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
  USN: number;
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

  async function AddUsn(userId: any) {
    alert("studentId is " + userId);
    const usnInput = prompt("Enter the USN");
  
    // Convert input to a number and handle null or invalid inputs
    const USN = usnInput ? Number(usnInput) : null;
  
    if (USN === null || isNaN(USN)) {
      alert("Invalid USN. Please enter a valid number.");
      return;
    }
  
    try {
      const res = await admin.assignUSN(userId, USN);
      if (res.status === 200) {
        alert("USN assigned successfully");
      } else {
        alert("Error while assigning USN");
      }
    } catch (error) {
      alert("An error occurred: " + error);
    }
  }
  
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
              <p className="text-gray-400">University Roll No: {student.USN || 'Not assigned'}</p>
              <p className="text-gray-400">Department: {student.department}</p>
              <p className="text-gray-400">Date of Birth: {new Date(student.dateOfBirth).toLocaleDateString()}</p>
              <p className="text-gray-400">Email: {student.email}</p>
              <p className="text-gray-400">Phone: {student.phone}</p>
              <p className="text-gray-400">Current Semester: {student.currentSemester}</p>
              
              <div className="mt-4">
                <p className="text-lg font-semibold text-gray-200">Registered Subjects:</p>
                {student.registeredSubjects.map((subject)=>{
                  return(
                    <div>
                      <p className="text-gray-400">{subject}</p>
                      <p>Current Grade --</p>
                      <div className='m-2'>
                      <select className='bg-black'>
                        <option value="A">O</option>
                        <option value="W">A+</option>
                        <option value="F">A</option>
                        <option value="A">B+</option>
                        <option value="W">B</option>
                        <option value="F">C</option>
                        <option value="A">P</option>
                        <option value="W">F</option>
                        <option value="F">PP</option>
                        <option value="A">NP</option>
                        <option value="W">NE</option>
                        <option value="F">W</option>
                      </select>
                      <button className='ml-2 border-2 boder-black bg-black p-1 cursor-pointer'>ADD/Change Grade</button>
                      </div>
                    </div>
                  )
                })}
              </div>
          <button className='border-2 border-black mt-2 p-2 bg-black cursor-pointer' onClick={()=>AddUsn(student._id)}>Assign USN</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Students;
