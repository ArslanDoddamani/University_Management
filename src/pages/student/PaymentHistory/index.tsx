import React, { useEffect, useState } from 'react';
import { student } from '../../../services/api';
import PaymentCard from './PaymentCard';
import { AlertCircle } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';

interface Payment {
  _id: string;
  amount: number;
  type: string; // 'ExamFee' | 'ChallengeValuation' | 'F' | 'W';
  status: string; // 'pending' | 'completed' | 'failed';
  createdAt: string;
  subject?: {
    name: string;
    code: string;
  };
}

const PaymentHistory = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token=localStorage.getItem('token');
        const decoded=jwtDecode(token);
        const userId=decoded.userId;
        const response = await student.getPaymentHistory(userId) // Replace {userId} dynamically
        setPayments(response.data);
      } catch (error) {
        setError('Failed to load payment history');
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
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

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Payment History</h2>

      {payments.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No payment history available
        </div>
      ) : (
        payments.map((payment) => (
          <PaymentCard key={payment._id} payment={payment} />
        ))
      )}
    </div>
  );
};

export default PaymentHistory;
