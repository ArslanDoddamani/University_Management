import React from 'react';
import { CreditCard, CheckCircle, XCircle, Clock } from 'lucide-react';

interface Payment {
  _id: string;
  amount: number;
  type: 'ExamFee' | 'ChallengeValuation' | 'F' | 'W';
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
  subject?: {
    name: string;
    code: string;
  };
}

interface Props {
  payment: Payment;
}

const PaymentCard = ({ payment }: Props) => {
  const getStatusIcon = () => {
    switch (payment.status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusColor = () => {
    switch (payment.status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-indigo-100 p-2 rounded-full">
            <CreditCard className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              {payment.type === 'ExamFee' ? 'Semester Registration' :
               payment.type === 'ChallengeValuation' ? 'Challenge Valuation' :
               `Re-Registration (Grade ${payment.type})`}
            </h3>
            <p className="text-sm text-gray-500">
              {new Date(payment.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-lg font-semibold text-gray-900">
              ₹{payment.amount}
            </p>
            <p className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor()}`}>
              {getStatusIcon()}
              <span className="ml-1">{payment.status}</span>
            </p>
          </div>
        </div>
      </div>

      {payment.subject && (
        <div className="mt-2 text-sm text-gray-500">
          Subject: {payment.subject.name} ({payment.subject.code})
        </div>
      )}
    </div>
  );
};

export default PaymentCard;