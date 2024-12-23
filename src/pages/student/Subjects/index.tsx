import React, { useState, useEffect } from 'react';
import { student } from '../../../services/api';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

interface Subject {
  _id: string;
  code: string;
  name: string;
  credits: number;
  semester: number;
  department: string;
  fees: {
    registration: number;
    reRegistrationF: number;
    reRegistrationW: number;
    challengeValuation: number;
  };
}

interface JwtPayload {
  userId: string;
}

const Subjects: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);

  useEffect(() => {
    async function fetchSubjects() {
      try {
        const response = await student.getSubjects();
        setSubjects(response.data.subjects);
      } catch (error) {
        console.error('Error fetching subjects:', error);
      }
    }

    fetchSubjects();
  }, []);

  async function initiatePayment(SubjectId: string) {
    alert('SubjectId is ' + SubjectId);

    const token = localStorage.getItem('token');
    if (!token) {
      alert('No token found. Please login again.');
      return;
    }

    const decoded: JwtPayload = jwtDecode(token);
    const userId = decoded.userId;

    console.log('User ID: ', userId);

    alert('Redirecting you to payment page');

    try {
      const orderResponse = await student.createOrder(SubjectId, userId);
      const { order } = orderResponse.data;
      console.log('Order Response: ', orderResponse);

      const apiKeyResponse = await student.getApiKey();
      const apiKey: string = apiKeyResponse.data;
      console.log('Razorpay API Key: ', apiKey);

      const options = {
        key: apiKey,
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        callback_url: 'http://localhost:3001/api/student/verifypayment',
        prefill: {
          name: 'Your Name',
          email: 'email@example.com',
        },
        theme: {
          color: '#3399cc',
        },
        handler: (response: any) => {
          console.log('Payment handler response: ', response);
          const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = response;

          // Verify payment
          axios
            .post('http://localhost:3001/api/student/verifypayment', {
              razorpay_order_id,
              razorpay_payment_id,
              razorpay_signature,
              SubjectId,
              userId,
            })
            .then((verifyResponse) => {
              if (verifyResponse.data.success) {
                alert('Payment successful and course added!');
              } else {
                alert('Payment verification failed');
              }
            })
            .catch((error) => {
              console.error('Error in payment verification: ', error);
              alert('Error verifying payment. Please try again.');
            });
        },
      };

      const rzp1 = new (window as any).Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error('Error during payment initiation: ', error);
      alert('Error during payment initiation. Please try again.');
    }
  }

  return (
    <div className="subjects-container bg-gray-900 text-white p-6 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-6">Available Subjects</h1>
      {subjects.length < 1 ? (
        <p className="loading-message text-center text-lg">Subjects will load here...</p>
      ) : (
        <table className="min-w-full table-auto border-collapse bg-gray-800 rounded-lg shadow-lg">
          <thead>
            <tr className="border-b-2 border-gray-700">
              <th className="py-2 px-4 text-left text-lg">Subject Code</th>
              <th className="py-2 px-4 text-left text-lg">Subject Name</th>
              <th className="py-2 px-4 text-left text-lg">Credits</th>
              <th className="py-2 px-4 text-left text-lg">Semester</th>
              <th className="py-2 px-4 text-left text-lg">Department</th>
              <th className="py-2 px-4 text-left text-lg">Registration Fee</th>
              <th className="py-2 px-4 text-left text-lg">Re-Registration Fee (Full)</th>
              <th className="py-2 px-4 text-left text-lg">Re-Registration Fee (WithDraw)</th>
              <th className="py-2 px-4 text-left text-lg">Challenge Valuation Fee</th>
              <th className="py-2 px-4 text-left text-lg">Action</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((subject) => (
              <tr key={subject._id} className="border-b border-gray-700">
                <td className="py-2 px-4">{subject.code}</td>
                <td className="py-2 px-4">{subject.name}</td>
                <td className="py-2 px-4">{subject.credits}</td>
                <td className="py-2 px-4">{subject.semester}</td>
                <td className="py-2 px-4">{subject.department}</td>
                <td className="py-2 px-4">₹{subject.fees.registration}</td>
                <td className="py-2 px-4">₹{subject.fees.reRegistrationF}</td>
                <td className="py-2 px-4">₹{subject.fees.reRegistrationW}</td>
                <td className="py-2 px-4">₹{subject.fees.challengeValuation}</td>
                <td className="py-2 px-4">
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition duration-200"
                    onClick={() => initiatePayment(subject._id)}
                  >
                    Register
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Subjects;
