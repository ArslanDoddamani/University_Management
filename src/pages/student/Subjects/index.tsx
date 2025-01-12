import React, { useState, useEffect } from "react";
import { student } from "../../../services/api";
import { jwtDecode } from "jwt-decode";

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
  const [usn, setUsn] = useState<string | null>("");

  // Check `usn` from localStorage
  useEffect(() => {
    const storedUsn = localStorage.getItem("usn");
    setUsn(storedUsn);
  }, []);

  useEffect(() => {
    async function fetchSubjects() {
      try {
        const response = await student.getSubjects();
        setSubjects(response.data.subjects);
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    }

    if (usn && usn !== "-1") {
      fetchSubjects();
    }
  }, [usn]);

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

  if (usn === "-1") {
    return (
      <div className="bg-gray-900 text-gray-200">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-6">Available Subjects</h1>
          <p className="text-lg text-gray-400">
            Your USN has not been assigned by the admin yet. Please contact the admin for assistance.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-6">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Available Subjects</h1>
        {subjects.length === 0 ? (
          <p className="text-center text-lg">Loading subjects...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-auto w-full border-collapse border border-gray-700 text-sm md:text-base">
              <thead>
                <tr className="bg-gray-800 text-gray-200">
                  <th className="border border-gray-700 px-4 py-2">Subject Code</th>
                  <th className="border border-gray-700 px-4 py-2">Subject Name</th>
                  <th className="border border-gray-700 px-4 py-2">Credits</th>
                  <th className="border border-gray-700 px-4 py-2">Department</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map((subject) => (
                  <tr key={subject._id} className="text-center hover:bg-gray-700">
                    <td className="border border-gray-700 px-4 py-2">{subject.code}</td>
                    <td className="border border-gray-700 px-4 py-2">{subject.name}</td>
                    <td className="border border-gray-700 px-4 py-2">{subject.credits}</td>
                    <td className="border border-gray-700 px-4 py-2">{subject.department}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-center mt-8">
              <button
                onClick={initiatePayment}
                disabled={loading}
                className={`${
                  loading ? "bg-gray-600 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                } px-6 py-3 text-lg rounded-lg font-semibold text-white`}
              >
                {loading ? "Processing..." : "Register All Subjects"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Subjects;
