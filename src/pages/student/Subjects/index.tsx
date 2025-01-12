import React, { useState, useEffect } from "react";
import { student } from "../../../services/api";
import {jwtDecode} from "jwt-decode";

interface Subject {
  _id: string;
  code: string;
  name: string;
  credits: number;
  semester: number;
  department: string;
}

interface JwtPayload {
  userId: string;
}

const Subjects: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchSubjects() {
      try {
        const response = await student.getSubjects();
        setSubjects(response.data.subjects);
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    }
    fetchSubjects();
  }, []);

  async function initiatePayment() {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to continue.");
      return;
    }

    const decoded: JwtPayload = jwtDecode(token);
    const userId = decoded.userId;

    try {
      setLoading(true);

      const orderResponse = await student.createOrder(userId);
      const { order } = orderResponse.data;

      const apiKeyResponse = await student.getApiKey();
      const apiKey: string = apiKeyResponse.data;

      const options = {
        key: apiKey,
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        prefill: {
          name: "Your Name",
          email: "email@example.com",
        },
        handler: async (response: any) => {
          const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = response;

          try {
            const verifyResponse = await student.verifyPayment(
              razorpay_order_id,
              razorpay_payment_id,
              razorpay_signature,
              userId
            );

            if (verifyResponse.data.success) {
              alert("Payment successful! Subjects registered.");
            } else {
              alert("Payment verification failed. Please try again.");
            }
          } catch (error) {
            console.error("Error verifying payment:", error);
            alert("Error verifying payment.");
          }
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Error during payment:", error);
      alert("Error during payment. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="subjects-container">
      <h1>Available Subjects</h1>
      {subjects.length === 0 ? (
        <p>Loading subjects...</p>
      ) : (
        <div>
          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Name</th>
                <th>Credits</th>
                <th>Department</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((subject) => (
                <tr key={subject._id}>
                  <td>{subject.code}</td>
                  <td>{subject.name}</td>
                  <td>{subject.credits}</td>
                  <td>{subject.department}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={initiatePayment} disabled={loading}>
            {loading ? "Processing..." : "Register All Subjects"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Subjects;
