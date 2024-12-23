import React, { useState, useEffect } from 'react';
import { student } from '../../../services/api';
import {jwtDecode} from 'jwt-decode';
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
      const {order}=orderResponse.data;
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
    <div className="subjects-container">
      {subjects.length < 1 ? (
        <p className="loading-message">Subjects will load here...</p>
      ) : (
        <div className="subjects-list">
          {subjects.map((subject) => (
            <div className="subject-card" key={subject._id}>
              <h2 className="subject-code">{subject.code}</h2>
              <p className="subject-name">{subject.name}</p>
              <p className="subject-details">Credits: {subject.credits}</p>
              <p className="subject-details">Semester: {subject.semester}</p>
              <p className="subject-details">Department: {subject.department}</p>
              <p className="subject-details">Registration Fee: ₹{subject.fees.registration}</p>
              <p className="subject-details">Re-Registration Fee (Full): ₹{subject.fees.reRegistrationF}</p>
              <p className="subject-details">Re-Registration Fee (Withheld): ₹{subject.fees.reRegistrationW}</p>
              <p className="subject-details">Challenge Valuation Fee: ₹{subject.fees.challengeValuation}</p>
              <button
                className="bg-red-800 p-2 border-2 text-white cursor-pointer"
                onClick={() => initiatePayment(subject._id)}
              >
                Register
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Subjects;
