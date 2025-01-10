import React, { useState, useEffect } from 'react';
import { student } from '../../../services/api';
import {jwtDecode} from 'jwt-decode';
import axios from 'axios';

const Subjects = () => {
  const [subjects, setSubjects] = useState([]);

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

  async function initiatePayment(SubjectId){
    alert("SubjectId is"+SubjectId);
    
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found. Please login again.');

      const decoded = jwtDecode(token);
      const userId = decoded.userId;

      console.log('User ID: ', userId);

      alert('Redirecting you to payment page');

      try{
      const orderResponse = await (student.createOrder(SubjectId, userId));
      console.log('Order Response: ', orderResponse);

      const apiKeyResponse = await student.getApiKey();
      const apiKey= apiKeyResponse.data; // Ensure apiKey is a string
      console.log('Razorpay API Key: ', apiKey);

      const options = {
        key: apiKey,
        amount: orderResponse.order.amount,
        currency: orderResponse.order.currency,
        order_id: orderResponse.order.id,
        callback_url: 'http://localhost:3001/api/student/verifypayment',
        prefill: {
          name: 'Your Name',
          email: 'email@example.com',
        },
        theme: {
          color: '#3399cc',
        },
        handler: function (response) {
          console.log("Payment handler response: ", orderResponse);
          const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = orderResponse;

         // Step 4: Call the backend to verify the payment
         axios.post(`${import.meta.env.VITE_ADMIN_BACKEND_URL}/User/verifypayment`, {
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
          SubjectId, // Send courseId from the purchase step
          userId    // Send userId for adding course
      }).then((verifyResponse) => {
          if (verifyResponse.data.success) {
              alert("Payment successful and course added!");
          } else {
              alert("Payment verification failed");
          }
      }).catch((error) => {
          console.error("Error in payment verification: ", error);
          alert("Error verifying payment. Please try again.");
      });
  },
};

// Step 5: Open Razorpay Checkout widget
const rzp1 = new Razorpay(options);
rzp1.open();
          } catch (error) {
            console.error('Error in payment verification: ', error);
            alert('Error verifying payment. Please try again.');
          }

      };

     

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
                className='bg-red-800 p-2 border-2 text-white cursor-pointer'
                onClick={() => {
                  initiatePayment(subject._id);
                }}
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
