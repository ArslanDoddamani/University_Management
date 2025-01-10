import React, { useEffect, useState } from 'react';
import { student } from '../../services/api';
import { admin } from '../../services/api';
import {jwtDecode} from 'jwt-decode';

const Semester = () => {
  const [subjects, setSubjects] = useState([]);


  // Function to fetch registered subject details
  async function fetchRegisteredSubjects() {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('User not logged in');

      const decode = jwtDecode(token);
      const userId = decode.userId;
      alert(userId);

      // Step 1: Fetch registered subject IDs
      const res = await student.registeredsubjects(userId); // API returns {"subjects": [...]}
      const subjectIds = res.data.subjects;

      // Step 2: Fetch full details of each subject using IDs
      const subjectsData = await Promise.all(
        subjectIds.map(async (subjectId:string) => {
          const subjectDetails = await admin.FindSubject(subjectId);
          return subjectDetails.data; // Assuming each API call returns detailed subject data
        })
      );

      console.log(subjectsData);

      // Step 3: Update state and calculate SGPA/CGPA
      setSubjects(subjectsData);
      // calculateGrades(subjectsData);
    } catch (error) {
      console.error('Error fetching registered subjects:', error);
    }
  }


  useEffect(() => {
    fetchRegisteredSubjects();
  }, []);

  return (
    <div>
      <h1>Registered Subjects</h1>
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">Subject Code</th>
            <th className="border border-gray-300 px-4 py-2">Subject Name</th>
            <th className="border border-gray-300 px-4 py-2">Credits</th>
            <th className="border border-gray-300 px-4 py-2">department</th>
            <th className="border border-gray-300 px-4 py-2">semester</th>
            <th className="border border-gray-300 px-4 py-2">Registration fees</th>
          </tr>
        </thead>
        <tbody>
          {subjects.map((subject) => (
            <tr key={subject._id}>
              <td className="border border-gray-300 px-4 py-2 ">{subject.subject.code}</td>
              <td className="border border-gray-300 px-4 py-2">{subject.subject.name}</td>
              <td className="border border-gray-300 px-4 py-2">{subject.subject.credits}</td>
              <td className="border border-gray-300 px-4 py-2">{subject.subject.department}</td>
              <td className="border border-gray-300 px-4 py-2">{subject.subject.semester}</td>
              <td className="border border-gray-300 px-4 py-2">{subject.subject.fees.registration}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* <div className="mt-4">
        <p>SGPA: {sgpa.toFixed(2)}</p>
        <p>CGPA: {cgpa.toFixed(2)}</p>
      </div> */}
    </div>
  );
};

export default Semester;
